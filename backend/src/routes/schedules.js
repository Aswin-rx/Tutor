import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Get all schedules for a tutor
router.get('/tutor', auth, authorize(['tutor']), async (req, res) => {
  try {
    const schedules = await Schedule.find({ tutorId: req.user.userId })
      .populate('studentId', 'firstName lastName')
      .populate('courseId', 'title');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
});

// Get all schedules for a student
router.get('/student', auth, authorize(['student']), async (req, res) => {
  try {
    const schedules = await Schedule.find({ studentId: req.user.userId })
      .populate('tutorId', 'firstName lastName')
      .populate('courseId', 'title');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
});

// Create schedule
router.post('/', auth, authorize(['tutor', 'student']), async (req, res) => {
  try {
    // Check for scheduling conflicts
    const conflictingSchedule = await Schedule.findOne({
      tutorId: req.body.tutorId,
      startTime: { $lt: req.body.endTime },
      endTime: { $gt: req.body.startTime }
    });

    if (conflictingSchedule) {
      return res.status(400).json({ message: 'Schedule conflict detected' });
    }

    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule' });
  }
});

// Update schedule
router.put('/:id', auth, authorize(['tutor', 'student']), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule' });
  }
});

// Cancel schedule
router.delete('/:id', auth, authorize(['tutor', 'student']), async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling schedule' });
  }
});

export default router;