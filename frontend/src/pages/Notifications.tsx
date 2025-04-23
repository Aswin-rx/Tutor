import React from 'react';
import { Bell, Calendar, MessageSquare, BookOpen, CheckCircle } from 'lucide-react';

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'class',
      title: 'Upcoming Class',
      message: 'Your Mathematics class starts in 30 minutes',
      time: '2 minutes ago',
      read: false,
      icon: Calendar
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'John Doe sent you a message about the homework',
      time: '15 minutes ago',
      read: false,
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'assignment',
      title: 'Assignment Graded',
      message: 'Your Physics assignment has been graded',
      time: '1 hour ago',
      read: true,
      icon: BookOpen
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You completed 5 lessons in a row!',
      time: '2 hours ago',
      read: true,
      icon: CheckCircle
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'class' ? 'bg-blue-100 dark:bg-blue-900' :
                  notification.type === 'message' ? 'bg-green-100 dark:bg-green-900' :
                  notification.type === 'assignment' ? 'bg-purple-100 dark:bg-purple-900' :
                  'bg-yellow-100 dark:bg-yellow-900'
                }`}>
                  <notification.icon className={`w-5 h-5 ${
                    notification.type === 'class' ? 'text-blue-600 dark:text-blue-400' :
                    notification.type === 'message' ? 'text-green-600 dark:text-green-400' :
                    notification.type === 'assignment' ? 'text-purple-600 dark:text-purple-400' :
                    'text-yellow-600 dark:text-yellow-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 