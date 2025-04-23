import React from 'react';
import { Calendar, Clock, Video, BookOpen } from 'lucide-react';

const Schedule: React.FC = () => {
  const upcomingClasses = [
    {
      id: 1,
      title: 'Mathematics 101',
      tutor: 'John Doe',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '1 hour',
      type: 'Live Session',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Physics Basics',
      tutor: 'Jane Smith',
      date: '2024-03-21',
      time: '2:00 PM',
      duration: '1.5 hours',
      type: 'Live Session',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Chemistry Lab',
      tutor: 'Mike Johnson',
      date: '2024-03-22',
      time: '11:00 AM',
      duration: '2 hours',
      type: 'Lab Session',
      status: 'upcoming'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Schedule</h1>
        
        <div className="grid gap-6">
          {upcomingClasses.map((class_) => (
            <div
              key={class_.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {class_.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    with {class_.tutor}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {class_.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {class_.time} ({class_.duration})
                    </div>
                    <div className="flex items-center">
                      {class_.type === 'Live Session' ? (
                        <Video className="w-4 h-4 mr-1" />
                      ) : (
                        <BookOpen className="w-4 h-4 mr-1" />
                      )}
                      {class_.type}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {class_.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule; 