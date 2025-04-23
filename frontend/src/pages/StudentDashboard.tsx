import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  Bell, 
  BookOpen, 
  Calendar, 
  User,
  Trophy,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-[64px] bottom-0 w-20 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col items-center py-8 space-y-8">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center"
      >
        <BookOpen className="text-white" size={24} />
      </motion.div>
      {[Calendar, Bell, User].map((Icon, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <Icon size={24} />
        </motion.button>
      ))}
    </div>
  );
};

const WelcomeSection = () => {
  const progress = 78;
  const { user } = useAuth();
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Student';
  
  return (
    <div className="relative overflow-hidden rounded-3xl bg-blue-500 p-8 text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] opacity-10 bg-cover bg-center" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
          <p className="text-blue-100">"Learning is a journey that never ends."</p>
          <div className="mt-6 flex items-center space-x-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-white"
            />
            <div>
              <p className="font-semibold">Your next class starts in</p>
              <p className="text-2xl font-bold">23 minutes</p>
            </div>
          </div>
        </div>
        <div className="w-32">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textColor: 'white',
              pathColor: 'white',
              trailColor: 'rgba(255,255,255,0.2)',
            })}
          />
        </div>
      </div>
    </div>
  );
};

const UpcomingClasses = () => {
  const classes = [
    {
      subject: 'Advanced Mathematics',
      time: '10:00 AM',
      duration: '1h 30m',
      instructor: 'Dr. Smith',
      color: 'bg-blue-400',
    },
    {
      subject: 'Physics Lab',
      time: '2:00 PM',
      duration: '2h',
      instructor: 'Prof. Johnson',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Today's Classes</h2>
        <p className="text-gray-500 dark:text-gray-400">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>
      <div className="space-y-4">
        {classes.map((class_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl bg-blue-50 dark:bg-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${class_.color} rounded-2xl flex items-center justify-center text-white`}>
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">{class_.subject}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{class_.instructor}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold dark:text-white">{class_.time}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{class_.duration}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await API.get('/students/profile');
        console.log('Student profile response:', response.data);
        
        if (response.data.enrolledCourses && response.data.enrolledCourses.length > 0) {
          const courses = response.data.enrolledCourses.map((enrollment: any) => ({
            id: enrollment.courseId._id,
            title: enrollment.courseId.title,
            progress: enrollment.progress || 65,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            instructor: `${enrollment.courseId.tutorId.firstName} ${enrollment.courseId.tutorId.lastName}`,
            nextLesson: "Next Lesson" // TODO: Get actual next lesson
          }));
          setEnrolledCourses(courses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error: any) {
        console.error('Error fetching enrolled courses:', error);
        setError('Failed to load enrolled courses. Please try again later.');
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Enrolled Courses</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Enrolled Courses</h2>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Enrolled Courses</h2>
      <div className="space-y-6">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary text-white px-6 py-2 rounded-xl font-semibold"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          enrolledCourses.map((course) => (
          <motion.div
              key={course.id}
            whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-blue-50 dark:bg-gray-700 cursor-pointer"
              onClick={() => handleCourseClick(course.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm" />
            <div className="relative p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Instructor: {course.instructor}</p>
                  <div className="mt-2">
                    <div className="h-2 w-full bg-white dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Next: {course.nextLesson}
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {course.progress}%
                </div>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const LearningProgress = () => {
  const stats = [
    { icon: Trophy, label: "Course Completion", value: "85%", color: "text-blue-500" },
    { icon: Clock, label: "Study Hours", value: "124h", color: "text-blue-400" },
    { icon: CheckCircle2, label: "Assignments", value: "45/50", color: "text-blue-500" },
    { icon: Star, label: "Average Grade", value: "A", color: "text-blue-400" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Learning Progress</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-2xl bg-blue-50 dark:bg-gray-700"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Assignments = () => {
  const assignments = [
    {
      title: "Research Paper",
      subject: "Biology",
      dueDate: "Mar 15",
      status: "In Progress",
      progress: 60
    },
    {
      title: "Problem Set 3",
      subject: "Physics",
      dueDate: "Mar 18",
      status: "Not Started",
      progress: 0
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Assignments</h2>
        <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400">
          <FileText size={16} />
          <span>New Assignment</span>
        </button>
      </div>
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl bg-blue-50 dark:bg-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold dark:text-white">{assignment.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold dark:text-white">Due {assignment.dueDate}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.status}</p>
              </div>
            </div>
            <div className="h-2 w-full bg-white dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${assignment.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Recommendations = () => {
  const courses = [
    {
      title: "Machine Learning Basics",
      instructor: "Dr. Alan Turing",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
      tag: "Hot 🔥"
    },
    {
      title: "Advanced Calculus",
      instructor: "Prof. Maria Garcia",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904",
      tag: "New ✨"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Recommended for You</h2>
        <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400">
          <Award size={16} />
          <span>View All</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{course.title}</h3>
                <span className="px-2 py-1 rounded-full bg-blue-500/50 text-sm">
                  {course.tag}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-80">{course.instructor}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-blue-400 fill-current" />
                  <span className="ml-1 text-sm">{course.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed top-[64px] h-[calc(100vh-64px)] left-0 w-20 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center py-8 space-y-8 h-full">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <BookOpen className="text-white" size={24} />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation('/student/schedule')}
          >
            <Calendar size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation('/student/notifications')}
          >
            <Bell size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation('/student/profile')}
          >
            <User size={24} />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-20">
        <main className="px-8 pt-[80px] pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <WelcomeSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UpcomingClasses />
            <EnrolledCourses />
            <LearningProgress />
            <Assignments />
            <Recommendations />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default App;