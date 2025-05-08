import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, GraduationCap } from 'lucide-react';
import API from '../utils/api'; // Import API utility

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'tutor';
}

interface RegisterProps {
  onSubmitOverride?: (data: RegisterForm) => Promise<any>;
}

export default function Register({ onSubmitOverride }: RegisterProps = {}) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Use onSubmitOverride if provided, otherwise use the default implementation
      if (onSubmitOverride) {
        const result = await onSubmitOverride(data);
        const token = result.token || result.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          login(token);
          navigate(`/dashboard/${data.role}`);
        }
        return result;
      }
      
      // Default implementation using API
      const response = await API.post('/auth/register', data);
      const token = response.data?.token || response.token;
      
      if (token) {
        localStorage.setItem('token', token);
        login(token);
        navigate(`/dashboard/${data.role}`);
      } else {
        throw new Error('No token received from server');
      }

      navigate(`/dashboard/${data.role}`);
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <UserPlus className="h-12 w-12 text-primary-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>

          {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('firstName', { required: 'First Name is required' })}
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="First Name"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('lastName', { required: 'Last Name is required' })}
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Last Name"
              />
            </div>
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                {...register('role', { required: 'Role is required' })}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg">Create Account</button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
