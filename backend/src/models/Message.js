import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String,
    url: String,
    fileType: String
  }]
}, {
  timestamps: true
});

// Create indexes for better performance
messageSchema.index({ chatId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ read: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message; 