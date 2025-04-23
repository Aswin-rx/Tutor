import mongoose from 'mongoose';

const studyTrackerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  quizScores: [{
    quizName: String,
    score: Number,
    maxScore: Number,
    dateTaken: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String
  },
  challenges: {
    type: String
  }
});

// Index for efficient querying
studyTrackerSchema.index({ studentId: 1, courseId: 1, date: -1 });

const StudyTracker = mongoose.model('StudyTracker', studyTrackerSchema);
export default StudyTracker;