import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService, TestimonialData } from '../utils/api';

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<TestimonialData>({
    name: '',
    role: '',
    company: '',
    rating: 5,
    text: '',
    avatar: '👤',
    service: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const avatarOptions = ['👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '👨‍🎯', '👩‍🎯'];
  
  const serviceOptions = [
    'Job Consultancy',
    'Fraud Assistance', 
    'Web Development',
    'Digital Marketing',
    'Training',
    'Recruitment',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await apiService.submitTestimonial(formData);
      setSubmitStatus('success');
      setStatusMessage('Thank you for your testimonial! It will be reviewed and published soon.');
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        company: '',
        rating: 5,
        text: '',
        avatar: '👤',
        service: ''
      });
      
      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
          <p className="text-gray-600">Help others by sharing your success story with Drave Digitals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Role/Position *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                placeholder="Your company name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Service Used *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                required
              >
                <option value="">Select service</option>
                {serviceOptions.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Rating *</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`${
                        rating <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">({formData.rating}/5)</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl hover:border-red-400 transition-colors ${
                      formData.avatar === avatar ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Your Testimonial *</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors resize-none"
              placeholder="Share your experience with our services..."
              required
            />
          </div>

          {/* Status Message */}
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl flex items-center space-x-3 ${
                submitStatus === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {submitStatus === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm">{statusMessage}</span>
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Testimonial</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TestimonialForm;