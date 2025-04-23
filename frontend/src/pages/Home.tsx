import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BarChart, 
  Clock, 
  Shield,
  UserPlus,
  UserCheck,
  BookOpen,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50" >
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            {...fadeIn}
          >
            Learn, Teach, Grow
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your Personalized Learning Hub – Connect with expert tutors, track progress, and explore courses tailored for you.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transform hover:scale-105 transition duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-200"
            >
              Login
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
            {...fadeIn}
          >
            Why Choose Us?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Expert Tutors', description: 'Learn from industry professionals' },
              { icon: BarChart, title: 'Personalized Dashboard', description: 'Track your learning journey' },
              { icon: Clock, title: 'Flexible Learning', description: 'Study anytime, anywhere' },
              { icon: Shield, title: 'Secure & Fast', description: 'Data privacy and instant access' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
            {...fadeIn}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: UserPlus, title: 'Sign Up', description: 'Create an account in seconds' },
              { icon: UserCheck, title: 'Choose Your Role', description: 'Student or Tutor' },
              { icon: BookOpen, title: 'Explore Courses', description: 'Find and enroll in the best courses' },
              { icon: TrendingUp, title: 'Track Progress', description: 'Stay on top of your learning journey' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={fadeIn}
              >
                <div className="bg-white rounded-xl p-6 shadow-md relative z-10">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <step.icon className="h-12 w-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
            {...fadeIn}
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Jane Doe', role: 'Student', content: 'This platform transformed my learning experience! The personalized approach and expert tutors made all the difference.' },
              { name: 'John Smith', role: 'Tutor', content: 'As a tutor, I love the seamless scheduling system and the ability to connect with motivated students worldwide.' }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8"
                variants={fadeIn}
              >
                <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Join thousands of students and tutors today!
          </h2>
          <motion.button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up Now
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition"><Twitter className="h-6 w-6" /></a>
                <a href="#" className="hover:text-white transition"><Facebook className="h-6 w-6" /></a>
                <a href="#" className="hover:text-white transition"><Linkedin className="h-6 w-6" /></a>
                <a href="#" className="hover:text-white transition"><Github className="h-6 w-6" /></a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p>support@tutorapp.com</p>
              <p>1-800-TUTOR-APP</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Online Tutor App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}