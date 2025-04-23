import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all enrollments (admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'firstName lastName')
      .populate('courseId', 'title')
      .populate('tutorId', 'firstName lastName');
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
});

// Get student's enrollments
router.get('/my-enrollments', auth, authorize(['student']), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.userId })
      .populate('courseId', 'title description')
      .populate('tutorId', 'firstName lastName');
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
});

// Create enrollment
router.post('/', auth, authorize(['student']), async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log('Creating enrollment for course:', courseId);
    console.log('Student ID:', req.user.userId);
    
    // Validate courseId
    if (!courseId) {
      console.log('No courseId provided');
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.log('Invalid courseId format:', courseId);
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    
    // First, ensure student profile exists
    let student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      console.log('Creating student profile for user:', req.user.userId);
      student = new Student({
        userId: req.user.userId,
        enrolledCourses: []
      });
      await student.save();
    }
    
    // Check if course exists and has space
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.enrolledStudents.length >= course.maxStudents) {
      console.log('Course is full:', courseId);
      return res.status(400).json({ message: 'Course is full' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.userId,
      courseId: courseId
    });

    if (existingEnrollment) {
      console.log('Student already enrolled in course:', courseId);
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId: req.user.userId,
      courseId,
      tutorId: course.tutorId
    });

    console.log('Saving enrollment:', enrollment);
    await enrollment.save();

    // Update course and student
    course.enrolledStudents.push(req.user.userId);
    await course.save();

    // Update student's enrolled courses
    await Student.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { enrolledCourses: { courseId } } }
    );

    console.log('Enrollment created successfully:', enrollment._id);
    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    res.status(500).json({ 
      message: 'Error creating enrollment', 
      error: error.message,
      details: error.keyPattern ? {
        duplicateFields: Object.keys(error.keyPattern)
      } : undefined
    });
  }
});

// Update enrollment status
router.put('/:id', auth, authorize(['tutor', 'admin']), async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ message: 'Error updating enrollment' });
  }
});

export default router;