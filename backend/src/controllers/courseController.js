import Course from '../models/Course.js';
import Student from '../models/Student.js';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    console.log('Fetching all courses...');
    const courses = await Course.find({ status: 'Published' })
      .populate('tutor', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    console.log('Found courses:', courses.length);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('enrolledStudents', 'name email')
      .populate('reviews.student', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const course = new Course({
      ...req.body,
      tutor: req.user.id
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course' });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the tutor
    if (course.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course' });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the tutor
    if (course.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await Course.deleteOne({ _id: req.params.id });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Enroll in course
export const enrollInCourse = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student is already enrolled
    if (course.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Find or create student profile
    let student = await Student.findOne({ userId: req.user.userId });
    if (!student) {
      student = new Student({
        userId: req.user.userId,
        enrolledCourses: []
      });
    }

    // Add course to student's enrolled courses
    student.enrolledCourses.push({
      courseId: course._id,
      enrollmentDate: new Date(),
      status: 'active'
    });

    // Add student to course's enrolled students
    course.enrolledStudents.push(req.user.userId);

    // Save both student and course
    await Promise.all([student.save(), course.save()]);

    // Return updated course with populated tutor
    const updatedCourse = await Course.findById(course._id)
      .populate('tutor', 'firstName lastName');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};

// Add review to course
export const addReview = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student is enrolled
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ message: 'Must be enrolled to review' });
    }
    
    const review = {
      student: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };
    
    course.reviews.push(review);
    
    // Update course rating
    const totalRating = course.reviews.reduce((acc, review) => acc + review.rating, 0);
    course.rating = totalRating / course.reviews.length;
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
}; 