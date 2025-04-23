import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import { AxiosError } from 'axios';
import API from '../utils/api';
import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
 
  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      
      console.log('Submitting login data:', { email: data.email });
      const response = await API.post('/auth/login', data);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      const token = response.data.token;
      console.log('Login successful, token received');
      
      // Store token in localStorage and auth context
      await login(token);
      
      // Try-catch here to handle parsing errors
      try {
        // Decode the JWT token to get user role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;
        
        console.log('User role:', userRole);
        
        // Redirect based on role
        if (userRole === 'student') {
          navigate('/student/dashboard');
        } else if (userRole === 'tutor') {
          navigate('/tutor/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          console.error('Unknown role:', userRole);
          setLoginError('Invalid user role. Please contact support.');
        }
      } catch (parseError) {
        console.error('Error parsing token:', parseError);
        setLoginError('Authentication error. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response?.status === 401) {
        setLoginError('Invalid email or password');
      } else if (axiosError.response?.data?.message) {
        setLoginError(axiosError.response.data.message);
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <LogIn className="h-12 w-12 text-primary-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <button 
              type="submit" 
              className="w-full bg-primary-600 text-white py-3 rounded-lg flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

