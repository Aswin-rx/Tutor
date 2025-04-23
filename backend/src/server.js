import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tutorRoutes from './routes/tutors.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';
import scheduleRoutes from './routes/schedules.js';
import studyTrackerRoutes from './routes/studyTracker.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Frontend URL - update to allow connections from both development and production
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server default port
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

// Initialize Socket.IO with updated CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });
  
  // Leave a chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });
  
  // Send a message
  socket.on('send-message', (message) => {
    console.log('Message received:', message);
    io.to(message.chatId).emit('new-message', message);
  });
  
  // Typing indicators
  socket.on('typing', ({ chatId, isTyping }) => {
    socket.to(chatId).emit('user-typing', { userId: socket.id, isTyping });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Trust first proxy for rate limiting to work correctly
app.set('trust proxy', 1);

// Rate limiting with proper IP handling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Custom key generator to handle various IP scenarios
  keyGenerator: (req) => {
    return req.ip || 
           req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           '127.0.0.1';
  }
});

app.use(limiter);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/study-tracker', studyTrackerRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the full error details for debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  });

  // Send appropriate error response
  const statusCode = err.statusCode || 500;
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message || 'Internal Server Error'
    : 'Something went wrong!';

  res.status(statusCode).json({
    status: 'error',
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed origins for CORS: ${allowedOrigins.join(', ')}`);
});