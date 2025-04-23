import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding courses'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample course data
const sampleCourses = [
  // Computer Science & Programming Courses
  {
    title: 'Introduction to JavaScript Programming',
    description: 'Learn the fundamentals of JavaScript, including variables, data types, functions, and control structures. This course is perfect for beginners who want to start their journey in web development.',
    subject: 'Computer Science',
    level: 'Beginner',
    price: 49.99,
    duration: 120, // in minutes
    schedule: [
      { day: 'Monday', time: '18:00-20:00' },
      { day: 'Wednesday', time: '18:00-20:00' }
    ],
    maxStudents: 20,
    status: 'Published',
    materials: [
      {
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript syntax and basic concepts',
        type: 'Document'
      },
      {
        title: 'Functions and Objects',
        description: 'Deep dive into JavaScript functions and object-oriented programming',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Advanced React Development',
    description: 'Take your React skills to the next level with advanced concepts like hooks, context API, and Redux. Learn best practices for building scalable and maintainable React applications.',
    subject: 'Web Development',
    level: 'Advanced',
    price: 79.99,
    duration: 180,
    schedule: [
      { day: 'Tuesday', time: '19:00-22:00' },
      { day: 'Thursday', time: '19:00-22:00' }
    ],
    maxStudents: 15,
    status: 'Published',
    materials: [
      {
        title: 'React Hooks in Depth',
        description: 'Comprehensive guide to all React hooks',
        type: 'Document'
      },
      {
        title: 'State Management with Redux',
        description: 'Learn how to manage complex state with Redux',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Data Science Fundamentals with Python',
    description: 'Learn the basics of data science using Python. This course covers data manipulation, visualization, and basic machine learning algorithms.',
    subject: 'Data Science',
    level: 'Intermediate',
    price: 69.99,
    duration: 150,
    schedule: [
      { day: 'Monday', time: '17:00-19:30' },
      { day: 'Friday', time: '17:00-19:30' }
    ],
    maxStudents: 18,
    status: 'Published',
    materials: [
      {
        title: 'Python for Data Analysis',
        description: 'Introduction to pandas and numpy libraries',
        type: 'Document'
      },
      {
        title: 'Data Visualization with Matplotlib',
        description: 'Create compelling visualizations with Python',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Mobile App Development with Flutter',
    description: 'Build cross-platform mobile applications with Flutter. Learn to create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
    subject: 'Mobile Development',
    level: 'Intermediate',
    price: 59.99,
    duration: 140,
    schedule: [
      { day: 'Tuesday', time: '18:00-20:20' },
      { day: 'Thursday', time: '18:00-20:20' }
    ],
    maxStudents: 16,
    status: 'Published',
    materials: [
      {
        title: 'Flutter Basics',
        description: 'Introduction to Flutter widgets and architecture',
        type: 'Document'
      },
      {
        title: 'Building a Complete App',
        description: 'Step-by-step guide to building a real-world Flutter app',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Introduction to Machine Learning',
    description: 'Discover the fundamentals of machine learning algorithms and techniques. This course provides a solid foundation for understanding supervised and unsupervised learning methods.',
    subject: 'Artificial Intelligence',
    level: 'Beginner',
    price: 89.99,
    duration: 160,
    schedule: [
      { day: 'Wednesday', time: '18:00-20:40' },
      { day: 'Saturday', time: '10:00-12:40' }
    ],
    maxStudents: 20,
    status: 'Published',
    materials: [
      {
        title: 'ML Algorithms Overview',
        description: 'Introduction to common machine learning algorithms',
        type: 'Document'
      },
      {
        title: 'Practical ML with Scikit-Learn',
        description: 'Hands-on machine learning with Python',
        type: 'Video'
      }
    ]
  },
  
  // Mathematics Courses
  {
    title: 'Calculus I: Limits and Derivatives',
    description: 'Master the fundamentals of calculus including limits, continuity, and derivatives. This course provides a strong foundation for advanced mathematics and engineering studies.',
    subject: 'Mathematics',
    level: 'Intermediate',
    price: 64.99,
    duration: 160,
    schedule: [
      { day: 'Monday', time: '16:00-18:00' },
      { day: 'Thursday', time: '16:00-18:00' }
    ],
    maxStudents: 18,
    status: 'Published',
    materials: [
      {
        title: 'Limits and Continuity',
        description: 'Comprehensive guide to understanding limits and continuity',
        type: 'Document'
      },
      {
        title: 'Derivative Applications',
        description: 'Real-world applications of derivatives',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Linear Algebra Fundamentals',
    description: 'Learn the core concepts of linear algebra including vectors, matrices, and linear transformations. Essential for computer science, physics, and engineering students.',
    subject: 'Mathematics',
    level: 'Intermediate',
    price: 59.99,
    duration: 140,
    schedule: [
      { day: 'Tuesday', time: '17:00-19:00' },
      { day: 'Friday', time: '17:00-19:00' }
    ],
    maxStudents: 20,
    status: 'Published',
    materials: [
      {
        title: 'Vector Spaces',
        description: 'Introduction to vector spaces and subspaces',
        type: 'Document'
      },
      {
        title: 'Matrix Operations',
        description: 'Comprehensive guide to matrix operations and applications',
        type: 'Video'
      }
    ]
  },
  
  // Language Courses
  {
    title: 'Spanish for Beginners',
    description: 'Start your journey to Spanish fluency with this comprehensive beginner course. Learn essential vocabulary, grammar, and conversation skills for everyday situations.',
    subject: 'Languages',
    level: 'Beginner',
    price: 49.99,
    duration: 120,
    schedule: [
      { day: 'Monday', time: '19:00-21:00' },
      { day: 'Wednesday', time: '19:00-21:00' }
    ],
    maxStudents: 15,
    status: 'Published',
    materials: [
      {
        title: 'Spanish Basics',
        description: 'Introduction to Spanish pronunciation and basic phrases',
        type: 'Document'
      },
      {
        title: 'Everyday Conversations',
        description: 'Practice common Spanish conversations for daily situations',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Business English for Professionals',
    description: 'Enhance your English skills for the business environment. This course focuses on professional communication, negotiation, presentation skills, and business writing.',
    subject: 'Languages',
    level: 'Advanced',
    price: 74.99,
    duration: 160,
    schedule: [
      { day: 'Tuesday', time: '18:00-20:00' },
      { day: 'Thursday', time: '18:00-20:00' }
    ],
    maxStudents: 12,
    status: 'Published',
    materials: [
      {
        title: 'Business Communication',
        description: 'Effective communication strategies for business contexts',
        type: 'Document'
      },
      {
        title: 'Presentation Skills',
        description: 'Techniques for delivering powerful business presentations',
        type: 'Video'
      }
    ]
  },
  
  // Business Courses
  {
    title: 'Introduction to Marketing',
    description: 'Learn the fundamentals of marketing including market research, segmentation, targeting, and positioning. Develop skills to create effective marketing strategies for various business contexts.',
    subject: 'Business',
    level: 'Beginner',
    price: 54.99,
    duration: 130,
    schedule: [
      { day: 'Wednesday', time: '17:00-19:10' },
      { day: 'Friday', time: '17:00-19:10' }
    ],
    maxStudents: 25,
    status: 'Published',
    materials: [
      {
        title: 'Marketing Fundamentals',
        description: 'Core concepts and principles of modern marketing',
        type: 'Document'
      },
      {
        title: 'Digital Marketing Strategies',
        description: 'Introduction to effective digital marketing approaches',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Financial Management for Entrepreneurs',
    description: 'Master the essential financial concepts and tools needed to start and grow a successful business. Learn about financial planning, budgeting, cash flow management, and investment analysis.',
    subject: 'Business',
    level: 'Intermediate',
    price: 69.99,
    duration: 150,
    schedule: [
      { day: 'Monday', time: '18:00-20:30' },
      { day: 'Thursday', time: '18:00-20:30' }
    ],
    maxStudents: 20,
    status: 'Published',
    materials: [
      {
        title: 'Financial Planning',
        description: 'Creating effective financial plans for new businesses',
        type: 'Document'
      },
      {
        title: 'Investment Analysis',
        description: 'Methods for evaluating business investments',
        type: 'Video'
      }
    ]
  },
  
  // Music Courses
  {
    title: 'Piano for Beginners',
    description: 'Start your musical journey with this comprehensive piano course for beginners. Learn proper technique, music reading, and play your first songs within weeks.',
    subject: 'Music',
    level: 'Beginner',
    price: 59.99,
    duration: 140,
    schedule: [
      { day: 'Tuesday', time: '16:00-18:20' },
      { day: 'Saturday', time: '10:00-12:20' }
    ],
    maxStudents: 10,
    status: 'Published',
    materials: [
      {
        title: 'Piano Basics',
        description: 'Introduction to piano technique and music reading',
        type: 'Document'
      },
      {
        title: 'First Piano Pieces',
        description: 'Step-by-step tutorials for beginner piano pieces',
        type: 'Video'
      }
    ]
  },
  {
    title: 'Music Theory Fundamentals',
    description: 'Develop a solid understanding of music theory including notation, scales, intervals, chords, and harmony. Essential knowledge for any musician or composer.',
    subject: 'Music',
    level: 'Intermediate',
    price: 49.99,
    duration: 120,
    schedule: [
      { day: 'Wednesday', time: '19:00-21:00' },
      { day: 'Sunday', time: '15:00-17:00' }
    ],
    maxStudents: 15,
    status: 'Published',
    materials: [
      {
        title: 'Music Notation',
        description: 'Comprehensive guide to reading and writing music',
        type: 'Document'
      },
      {
        title: 'Harmony and Chord Progressions',
        description: 'Understanding harmonic relationships in music',
        type: 'Video'
      }
    ]
  },
  
  // Art & Design Courses
  {
    title: 'Digital Illustration for Beginners',
    description: 'Learn the fundamentals of digital illustration using industry-standard software. Develop skills in digital drawing, coloring, and creating professional illustrations.',
    subject: 'Art & Design',
    level: 'Beginner',
    price: 64.99,
    duration: 160,
    schedule: [
      { day: 'Monday', time: '17:00-19:40' },
      { day: 'Thursday', time: '17:00-19:40' }
    ],
    maxStudents: 12,
    status: 'Published',
    materials: [
      {
        title: 'Digital Drawing Basics',
        description: 'Introduction to digital drawing tools and techniques',
        type: 'Document'
      },
      {
        title: 'Color Theory for Digital Art',
        description: 'Applying color theory principles in digital illustration',
        type: 'Video'
      }
    ]
  },
  {
    title: 'UX/UI Design Principles',
    description: 'Master the principles of user experience and interface design. Learn to create intuitive, accessible, and visually appealing digital products that users love.',
    subject: 'Art & Design',
    level: 'Intermediate',
    price: 79.99,
    duration: 180,
    schedule: [
      { day: 'Tuesday', time: '18:00-21:00' },
      { day: 'Friday', time: '18:00-21:00' }
    ],
    maxStudents: 15,
    status: 'Published',
    materials: [
      {
        title: 'UX Research Methods',
        description: 'Techniques for understanding user needs and behaviors',
        type: 'Document'
      },
      {
        title: 'UI Design Systems',
        description: 'Creating consistent and scalable design systems',
        type: 'Video'
      }
    ]
  }
];

// Seed function
async function seedCourses() {
  try {
    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');
    
    // Find a tutor user to assign as the course tutor
    const tutors = await User.find({ role: 'tutor' }).limit(3);
    
    if (tutors.length === 0) {
      console.log('No tutors found. Creating a sample tutor...');
      const sampleTutor = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'tutor@example.com',
        password: 'password123', // In a real app, this should be hashed
        role: 'tutor'
      });
      await sampleTutor.save();
      tutors.push(sampleTutor);
    }
    
    // Create courses with tutors assigned
    const coursesWithTutors = sampleCourses.map((course, index) => ({
      ...course,
      tutor: tutors[index % tutors.length]._id
    }));
    
    const createdCourses = await Course.insertMany(coursesWithTutors);
    console.log(`${createdCourses.length} sample courses created successfully`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCourses();