import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    }
  }],
  studyPreferences: {
    preferredSubjects: [String],
    learningStyle: String,
    availableHours: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  }
});

const Student = mongoose.model('Student', studentSchema);
export default Student;