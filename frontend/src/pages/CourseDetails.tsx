import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, Star, Clock, ChevronRight, Play, Pause, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import API from '../utils/api';

interface Subject {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  tutorId: {
    firstName: string;
    lastName: string;
  };
  duration: number;
  price: number;
  maxStudents: number;
  enrolledStudents: string[];
  schedule: Array<{
    day: string;
    time: string;
  }>;
  materials: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await API.get(`/courses/${courseId}`);
        setCourse(response.data);
        
        // TODO: Replace with actual subjects data from backend
        const mockSubjects: Subject[] = [
          {
            id: '1',
            title: 'Introduction to the Course',
            description: 'Overview of what you will learn in this course',
            videoUrl: 'https://example.com/video1.mp4',
            duration: '10:00'
          },
          {
            id: '2',
            title: 'Basic Concepts',
            description: 'Understanding the fundamental concepts',
            videoUrl: 'https://example.com/video2.mp4',
            duration: '15:00'
          },
          // Add more subjects as needed
        ];
        setSubjects(mockSubjects);
        setSelectedSubject(mockSubjects[0]);
      } catch (error: any) {
        console.error('Error fetching course details:', error);
        setError(error.response?.data?.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!course || !selectedSubject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-xl">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="font-semibold">4.8</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">{course.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{course.title}</h2>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                    selectedSubject.id === subject.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{subject.title}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <video
                  src={selectedSubject.videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay={isPlaying}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedSubject.duration}
                </div>
              </div>

              {/* Subject Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{selectedSubject.title}</h3>
                <p className="text-gray-600 mb-6">{selectedSubject.description}</p>
                
                {/* Course Materials */}
                {course.materials && course.materials.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Course Materials</h4>
                    <div className="space-y-4">
                      {course.materials.map((material, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium">{material.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm mt-2 inline-block"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 