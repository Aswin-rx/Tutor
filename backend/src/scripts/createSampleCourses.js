import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';

dotenv.config();

const sampleCourses = [
  {
    title: "Introduction to Python Programming",
    description: "Learn the fundamentals of Python programming language from scratch.",
    subject: "Programming",
    level: "Beginner",
    price: 49.99,
    duration: 60,
    maxStudents: 30,
    schedule: [
      { day: "Monday", time: "10:00 AM" },
      { day: "Wednesday", time: "10:00 AM" }
    ],
    materials: [
      {
        title: "Python Basics",
        description: "Introduction to Python syntax and basic concepts",
        fileUrl: "https://example.com/python-basics.pdf",
        type: "Document"
      }
    ]
  },
  {
    title: "Advanced Mathematics",
    description: "Master advanced mathematical concepts and problem-solving techniques.",
    subject: "Mathematics",
    level: "Advanced",
    price: 59.99,
    duration: 90,
    maxStudents: 25,
    schedule: [
      { day: "Tuesday", time: "2:00 PM" },
      { day: "Thursday", time: "2:00 PM" }
    ],
    materials: [
      {
        title: "Calculus Fundamentals",
        description: "Introduction to calculus concepts",
        fileUrl: "https://example.com/calculus-fundamentals.pdf",
        type: "Document"
      }
    ]
  },
  {
    title: "Web Development Bootcamp",
    description: "Comprehensive course covering HTML, CSS, JavaScript, and modern frameworks.",
    subject: "Web Development",
    level: "Intermediate",
    price: 79.99,
    duration: 120,
    maxStudents: 20,
    schedule: [
      { day: "Monday", time: "6:00 PM" },
      { day: "Wednesday", time: "6:00 PM" },
      { day: "Friday", time: "6:00 PM" }
    ],
    materials: [
      {
        title: "HTML & CSS Basics",
        description: "Introduction to web development",
        fileUrl: "https://example.com/web-dev-basics.pdf",
        type: "Document"
      }
    ]
  }
];

const createSampleCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create a tutor user
    let tutor = await User.findOne({ role: 'Tutor' });
    if (!tutor) {
      tutor = new User({
        email: 'tutor@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Tutor'
      });
      await tutor.save();
    }

    // Create sample courses
    for (const courseData of sampleCourses) {
      const course = new Course({
        ...courseData,
        tutor: tutor._id,
        status: 'Published'
      });
      await course.save();
      console.log(`Created course: ${course.title}`);
    }

    console.log('Sample courses created successfully');
  } catch (error) {
    console.error('Error creating sample courses:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createSampleCourses(); 