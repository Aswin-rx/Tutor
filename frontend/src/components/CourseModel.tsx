import React, { useState } from 'react';
import { X, Star, User, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../utils/api';
import { Course } from './types';
import { AxiosError } from 'axios';

interface ErrorResponse {
    message: string;
}

interface CourseModalProps {
    course: Course;
    onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user?.role !== 'student') {
            setError('Only students can enroll in courses');
            return;
        }

        try {
            setIsEnrolling(true);
            setError(null);
            
            console.log('Attempting to enroll in course:', course.id);
            console.log('User:', user);
            
            // First, check if student profile exists
            try {
                await API.get('/students/profile');
            } catch (error: any) {
                if (error.response?.status === 404) {
                    // Create student profile if it doesn't exist
                    console.log('Creating student profile...');
                    await API.post('/students', {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });
                } else {
                    throw error;
                }
            }
            
            // Check if course exists and get its MongoDB ID
            try {
                const courseResponse = await API.get(`/courses/${course.id}`);
                console.log('Course details:', courseResponse.data);
                
                if (!courseResponse.data._id) {
                    setError('Invalid course data');
                    return;
                }
                
                // Now proceed with enrollment using the MongoDB ID
                console.log('Sending enrollment request...');
                const response = await API.post('/enrollments', {
                    courseId: courseResponse.data._id
                });

                console.log('Enrollment response:', response.data);

                if (response.status === 201) {
                    // Enrollment successful
                    navigate(`/course/${courseResponse.data._id}`);
                }
            } catch (error) {
                const axiosError = error as AxiosError<ErrorResponse>;
                console.error('Course enrollment error:', axiosError);
                console.error('Error response:', axiosError.response?.data);
                
                if (axiosError.response?.status === 404) {
                    setError('Course not found');
                } else if (axiosError.response?.status === 400) {
                    setError(axiosError.response.data?.message || 'Course is full');
                } else if (axiosError.response?.status === 401) {
                    setError('Please log in again');
                    navigate('/login');
                } else if (axiosError.response?.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(axiosError.response?.data?.message || 'Failed to enroll in the course. Please try again.');
                }
            }
        } catch (error) {
            console.error('General error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="relative h-72">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-6">
                        <div className="flex items-center gap-2 text-sm text-white/90 mb-3">
                            <span className="glass-effect px-3 py-1 rounded-full text-sm font-medium">
                                {course.category}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8 p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700">{course.tutor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-blue-500" fill="currentColor" />
                            <span className="font-bold text-gray-900">{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700">{course.lessons} lessons</span>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-8">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">About this course</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>

                        <h4 className="text-xl font-semibold mt-8 mb-4 text-gray-900">What you'll learn</h4>
                        <ul className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-blue-500" />
                                    <span>Key learning outcome {item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-gray-900">${course.price}</div>
                            {error && (
                                <div className="text-red-500 text-sm mb-2">{error}</div>
                            )}
                            {!isAuthenticated ? (
                                <button 
                                    onClick={handleEnroll}
                                    className="btn-primary text-white px-8 py-3 rounded-xl text-lg font-semibold"
                                >
                                    Login to Enroll
                                </button>
                            ) : user?.role === 'student' ? (
                                <button 
                                    onClick={handleEnroll}
                                    disabled={isEnrolling}
                                    className={`btn-primary text-white px-8 py-3 rounded-xl text-lg font-semibold ${
                                        isEnrolling ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                                </button>
                            ) : (
                                <div className="text-gray-600 italic">
                                    Only students can enroll in courses
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;