import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import StudyTracker from '../models/StudyTracker.js';

const router = express.Router();

// Get student's study records
router.get('/my-progress', auth, authorize(['student']), async (req, res) => {
  try {
    const records = await StudyTracker.find({ studentId: req.user.userId })
      .populate('courseId', 'title')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study records' });
  }
});

// Get study records by course
router.get('/course/:courseId', auth, authorize(['student', 'tutor']), async (req, res) => {
  try {
    const records = await StudyTracker.find({
      courseId: req.params.courseId,
      ...(req.user.role === 'student' ? { studentId: req.user.userId } : {})
    }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course study records' });
  }
});

// Create study record
router.post('/', auth, authorize(['student']), async (req, res) => {
  try {
    const studyRecord = new StudyTracker({
      studentId: req.user.userId,
      ...req.body
    });
    await studyRecord.save();
    res.status(201).json(studyRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating study record' });
  }
});

// Add quiz score
router.post('/:id/quiz', auth, authorize(['student']), async (req, res) => {
  try {
    const record = await StudyTracker.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Study record not found' });
    }

    record.quizScores.push(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error adding quiz score' });
  }
});

// Update study record
router.put('/:id', auth, authorize(['student']), async (req, res) => {
  try {
    const record = await StudyTracker.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!record) {
      return res.status(404).json({ message: 'Study record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error updating study record' });
  }
});

export default router;