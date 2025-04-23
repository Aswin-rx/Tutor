import { motion } from 'framer-motion';
import { Star, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Course } from './types';

interface CourseCardProps {
  course: Course;
  isGridView: boolean;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isGridView, onClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // If not logged in, redirect to login page
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      // If not a student, show error or redirect
      alert('Only students can enroll in courses');
      return;
    }

    // If authenticated and is a student, proceed with enrollment
    onClick();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer ${
        isGridView ? 'h-full' : 'flex'
      }`}
      onClick={onClick}
    >
      <div className={`relative ${isGridView ? 'h-48' : 'w-64 h-full'}`}>
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-sm">
            {course.category}
          </span>
        </div>
      </div>

      <div className={`p-6 ${isGridView ? '' : 'flex-1'}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-gray-600">{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-gray-600">{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" fill="currentColor" />
            <span className="font-bold text-gray-900">{course.rating}</span>
          </div>
          {!isAuthenticated ? (
            <button 
              onClick={handleEnroll}
              className="btn-primary text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Login to Enroll
            </button>
          ) : user?.role === 'student' ? (
            <button 
              onClick={handleEnroll}
              className="btn-primary text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Enroll Now
            </button>
          ) : (
            <span className="text-gray-600 text-sm italic">
              Students Only
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;