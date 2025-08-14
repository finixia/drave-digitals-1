import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiService.login(formData);
      
      if (response.user) {
        login(response.user);
        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50 flex items-center justify-center p-6">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 mb-6 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </motion.button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4"
            >
              <img 
                src="/company logo.png" 
                alt="Drave Capitals Logo" 
                className="w-16 h-16 object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Drave Digitals account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white border border-gray-300 rounded focus:ring-red-400 focus:ring-2"
                />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-red-500 text-sm hover:text-red-600 transition-colors">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <button 
              onClick={() => navigate('/register')}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Register here
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;