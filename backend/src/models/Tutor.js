import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  subjects: [{
    name: String,
    level: String
  }],
  hourlyRate: {
    type: Number,
    required: true
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;