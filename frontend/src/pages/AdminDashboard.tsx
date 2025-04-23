import{ useState } from 'react';
import {
  Users,
  BookOpen,
  Bell,
  MessageSquare,
  Settings,
  UserPlus,
  BookPlus,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-7">
          {[
            { id: 'dashboard', icon: Users, label: 'Dashboard' },
            { id: 'courses', icon: BookOpen, label: 'Courses' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 p-4 lg:p-8">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 lg:p-8  text-white mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Welcome Back, Admin!</h2>
              <p className="text-blue-100 mb-6">"Empowering education through technology."</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {[
                  { label: 'Total Tutors', value: '45' },
                  { label: 'Total Students', value: '280' },
                  { label: 'Active Courses', value: '32' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-blue-100">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-white cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <button className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Add New User</h3>
              <p className="text-sm text-gray-500">Create tutor or student account</p>
            </div>
          </button>
          <button className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-3 rounded-lg">
              <BookPlus className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">New Course</h3>
              <p className="text-sm text-gray-500">Create and publish a course</p>
            </div>
          </button>
        </div>

        {/* Recent Activity & Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Users Management */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Wilson',
                  role: 'Tutor',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  status: 'Active',
                },
                {
                  name: 'Michael Brown',
                  role: 'Student',
                  image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  status: 'Pending',
                },
              ].map((user) => (
                <div key={user.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Management */}
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Courses</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: 'Advanced Mathematics',
                  tutor: 'Dr. Smith',
                  students: 24,
                  status: 'Active',
                },
                {
                  name: 'Web Development',
                  tutor: 'John Doe',
                  students: 18,
                  status: 'Pending',
                },
              ].map((course) => (
                <div key={course.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>Tutor: {course.tutor}</p>
                    <p>{course.students} Students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;