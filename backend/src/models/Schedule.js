import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String
  },
  notes: {
    type: String
  }
});

// Index for querying schedules efficiently
scheduleSchema.index({ tutorId: 1, startTime: 1 });
scheduleSchema.index({ studentId: 1, startTime: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;