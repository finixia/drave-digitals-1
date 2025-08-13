import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { apiService, TestimonialData } from '../../utils/api';

interface Testimonial extends TestimonialData {
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialData>({
    name: '',
    role: '',
    company: '',
    rating: 5,
    text: '',
    avatar: '👤',
    service: '',
    featured: false,
    approved: true
  });

  const avatarOptions = ['👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬'];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsData = await apiService.getTestimonialsAdmin();
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await apiService.updateTestimonial(editingTestimonial._id, testimonialForm);
      } else {
        await apiService.createTestimonial(testimonialForm);
      }
      
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      resetTestimonialForm();
      await fetchTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      alert(`Failed to save testimonial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await apiService.deleteTestimonial(id);
        await fetchTestimonials();
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
        alert(`Failed to delete testimonial: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      rating: testimonial.rating,
      text: testimonial.text,
      avatar: testimonial.avatar,
      service: testimonial.service,
      featured: testimonial.featured || false,
      approved: testimonial.approved || true
    });
    setShowTestimonialModal(true);
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      rating: 5,
      text: '',
      avatar: '👤',
      service: '',
      featured: false,
      approved: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Testimonial Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetTestimonialForm();
            setShowTestimonialModal(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditTestimonial(testimonial)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteTestimonial(testimonial._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 text-sm">"{testimonial.text}"</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-600 text-xs">{testimonial.role}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {testimonial.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  testimonial.approved 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testimonial.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => {
                  setShowTestimonialModal(false);
                  setEditingTestimonial(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Service</label>
                  <input
                    type="text"
                    value={testimonialForm.service}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setTestimonialForm(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={`${
                            rating <= testimonialForm.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.map(avatar => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setTestimonialForm(prev => ({ ...prev, avatar }))}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl hover:border-red-400 transition-colors ${
                          testimonialForm.avatar === avatar ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Testimonial Text</label>
                <textarea
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, text: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testimonialForm.featured}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Featured</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testimonialForm.approved}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, approved: e.target.checked }))}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Approved</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestimonialModal(false);
                    setEditingTestimonial(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>{editingTestimonial ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsTab;