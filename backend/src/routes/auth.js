import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { login, register, getProfile, updateProfile } from '../controllers/authController.js';

// Load environment variables
dotenv.config();

const router = express.Router();

// Debugging route to check token
router.get('/debug-token', auth, (req, res) => {
  res.json({
    user: req.user,
    message: 'Token is valid'
  });
});

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName
    });

    await user.save();
    console.log('Hashed password:', user.password); // Check the hashed password

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Fetching user with ID:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export default router;