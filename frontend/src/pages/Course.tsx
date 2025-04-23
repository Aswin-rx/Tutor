import { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import '../css/Course.css';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModel';
import { Course } from '../components/types';
import API from '../utils/api';

function App() {
  const [isGridView, setIsGridView] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...');
        const response = await API.get('/courses');
        console.log('Courses response:', response.data);
        
        // Transform the backend course data to match our frontend Course interface
        const transformedCourses = response.data.map((course: any) => ({
          id: course._id,
          title: course.title,
          category: course.subject,
          tutor: course.tutor?.firstName + ' ' + course.tutor?.lastName || 'Unknown Tutor',
          rating: course.rating || 4.8,
          duration: `${course.duration} minutes`,
          lessons: course.materials?.length || 12,
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800",
          price: course.price,
          description: course.description
        }));
        
        console.log('Transformed courses:', transformedCourses);
        setCourses(transformedCourses);
      } catch (error: any) {
        console.error('Error fetching courses:', error);
        setError(error.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Controls */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-3 rounded-xl hover:bg-blue-50 transition-colors text-blue-600"
          >
            {isGridView ? 
              <List className="w-6 h-6" /> : 
              <Grid className="w-6 h-6" />
            }
          </button>
        </div>

        {/* Course Grid/List */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available at the moment.</p>
          </div>
        ) : (
          <div className={`grid ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
            {courses.map((course, index) => (
              <div key={course.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CourseCard
                  course={course}
                  isGridView={isGridView}
                  onClick={() => setSelectedCourse(course)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

export default App;