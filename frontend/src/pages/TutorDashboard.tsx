import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  MessageSquare,
  PieChart,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function App() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-10 h-full w-20 bg-white shadow-lg flex flex-col items-center py-8 space-y-8">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="text-white" size={24} />
        </div>
        <nav className="flex flex-col space-y-6">
          <button className="p-3 rounded-xl bg-blue-50">
            <PieChart className="text-blue-600" size={24} />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-100">
            <Calendar className="text-gray-600" size={24} />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-100">
            <BookOpen className="text-gray-600" size={24} />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-100">
            <MessageSquare className="text-gray-600" size={24} />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-100">
            <Bell className="text-gray-600" size={24} />
          </button>
          <button className="p-3 rounded-xl hover:bg-gray-100">
            <Settings className="text-gray-600" size={24} />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-20 mt-20 p-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white mb-8">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
              <p className="text-blue-100 mb-4">
                "The best teachers are those who show you where to look but don't tell you what to see."
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm">Next Class</p>
                  <p className="text-xl font-semibold">23 minutes</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm">Today's Classes</p>
                  <p className="text-xl font-semibold">4/6 Complete</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-xl p-1">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-400 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-full">
            <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
          </div>
          {[1, 2, 3].map((session) => (
            <div
              key={session}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  In 2 hours
                </span>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Mathematics</h3>
              <p className="text-gray-600 mb-4">Sarah Johnson • 60 minutes</p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <span className="text-sm text-gray-500">+3 students</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
