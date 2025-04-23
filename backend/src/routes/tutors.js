import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import Tutor from '../models/Tutor.js';
import User from '../models/User.js';

const router = express.Router();

// Get all tutors
router.get('/', async (req, res) => {
  try {
    const tutors = await Tutor.find().populate('userId', '-password');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutors' });
  }
});

// Get tutor by ID
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate('userId', '-password');
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutor' });
  }
});

// Create tutor profile (requires authentication)
router.post('/', auth, authorize(['tutor']), async (req, res) => {
  try {
    const tutor = new Tutor({
      userId: req.user.userId,
      ...req.body
    });
    await tutor.save();
    res.status(201).json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tutor profile' });
  }
});

// Update tutor profile
router.put('/:id', auth, authorize(['tutor']), async (req, res) => {
  try {
    const tutor = await Tutor.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tutor profile' });
  }
});

// Add review for tutor
router.post('/:id/reviews', auth, authorize(['student']), async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const { rating, comment } = req.body;
    tutor.reviews.push({
      studentId: req.user.userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = tutor.reviews.reduce((sum, review) => sum + review.rating, 0);
    tutor.rating = totalRating / tutor.reviews.length;

    await tutor.save();
    res.status(201).json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

export default router;