import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  addReview
} from '../controllers/courseController.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', auth, createCourse);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);
router.post('/:id/enroll', auth, enrollInCourse);
router.post('/:id/review', auth, addReview);

export default router; 