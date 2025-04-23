import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

const router = express.Router();

// Get all students (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const students = await Student.find().populate('userId', '-password');
    res.json(students);
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Get student profile with enrolled courses
router.get('/profile', auth, async (req, res) => {
  try {
    let student = await Student.findOne({ userId: req.user.userId })
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title description tutorId',
        populate: {
          path: 'tutorId',
          select: 'firstName lastName'
        }
      });

    // If no student profile exists, create one
    if (!student) {
      student = new Student({
        userId: req.user.userId,
        enrolledCourses: []
      });
      await student.save();
    }

    // Transform the data to match the frontend expectations
    // Filter out any enrollments where courseId is null (course might have been deleted)
    const enrolledCourses = student.enrolledCourses
      .filter(enrollment => enrollment.courseId != null)
      .map(enrollment => ({
        courseId: enrollment.courseId,
        title: enrollment.courseId.title,
        description: enrollment.courseId.description,
        tutor: enrollment.courseId.tutorId ? {
          firstName: enrollment.courseId.tutorId.firstName,
          lastName: enrollment.courseId.tutorId.lastName
        } : null,
        progress: enrollment.status === 'completed' ? 100 : 65, // TODO: Calculate actual progress
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status
      }));


    res.json({
      ...student.toObject(),
      enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Error fetching student profile' });
  }
});

// Create student profile
router.post('/', auth, authorize(['student']), async (req, res) => {
  try {
    console.log('Creating student profile for user:', req.user.userId);
    
    // Check if profile already exists
    const existingStudent = await Student.findOne({ userId: req.user.userId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student profile already exists' });
    }
    
    const student = new Student({
      userId: req.user.userId,
      ...req.body
    });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student profile:', error);
    res.status(500).json({ message: 'Error creating student profile' });
  }
});

// Update student profile
router.put('/profile', auth, authorize(['student']), async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Error updating student profile' });
  }
});

export default router;