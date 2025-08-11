import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Shield,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Star,
  Eye,
  EyeOff,
  Save,
  X,
  LogOut,
  BarChart3,
  MessageSquare,
  Settings,
  Award,
  Code
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, TestimonialData, ServiceData } from '../utils/api';

interface DashboardStats {
  totalContacts: number;
  totalApplications: number;
  totalFraudCases: number;
  placedJobs: number;
  resolvedFraudCases: number;
  totalUsers: number;
  newsletterSubscribers: number;
  totalTestimonials: number;
  successRate: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Testimonial extends TestimonialData {
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

interface Service extends ServiceData {
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
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

  const [serviceForm, setServiceForm] = useState<ServiceData>({
    title: '',
    description: '',
    icon: 'Shield',
    color: 'from-red-500 to-pink-600',
    features: [],
    active: true,
    order: 0
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, contactsData, testimonialsData, servicesData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getContacts(),
        apiService.getTestimonialsAdmin(),
        apiService.getServicesAdmin()
      ]);

      setStats(statsData);
      setContacts(contactsData);
      setTestimonials(testimonialsData);
      setServices(servicesData);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting testimonial:', testimonialForm);
      if (editingTestimonial) {
        await apiService.updateTestimonial(editingTestimonial._id, testimonialForm);
      } else {
        await apiService.createTestimonial(testimonialForm);
      }
      
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      resetTestimonialForm();
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      alert(`Failed to save testimonial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting service:', serviceForm);
      if (editingService) {
        await apiService.updateService(editingService._id, serviceForm);
      } else {
        await apiService.createService(serviceForm);
      }
      
      setShowServiceModal(false);
      setEditingService(null);
      resetServiceForm();
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert(`Failed to save service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        console.log('Deleting testimonial:', id);
        await apiService.deleteTestimonial(id);
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
        alert(`Failed to delete testimonial: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        console.log('Deleting service:', id);
        await apiService.deleteService(id);
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert(`Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      color: service.color,
      features: [...service.features],
      active: service.active,
      order: service.order || 0
    });
    setShowServiceModal(true);
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

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      description: '',
      icon: 'Shield',
      color: 'from-red-500 to-pink-600',
      features: [],
      active: true,
      order: 0
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setServiceForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const iconOptions = ['Shield', 'Briefcase', 'Code', 'TrendingUp', 'Award', 'Users', 'Settings'];
  const colorOptions = [
    'from-red-500 to-pink-600',
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-violet-600',
    'from-orange-500 to-amber-600',
    'from-indigo-500 to-blue-600',
    'from-pink-500 to-rose-600'
  ];

  const avatarOptions = ['👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/company logo.png"
              alt="Drave Capitals Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </motion.button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'contacts', label: 'Contacts', icon: MessageSquare },
              { id: 'testimonials', label: 'Testimonials', icon: Star },
              { id: 'services', label: 'Services', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Contacts', value: stats.totalContacts, icon: Mail, color: 'text-blue-400' },
                  { label: 'Job Applications', value: stats.totalApplications, icon: Briefcase, color: 'text-green-400' },
                  { label: 'Fraud Cases', value: stats.totalFraudCases, icon: Shield, color: 'text-red-400' },
                  { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-purple-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={stat.color} size={32} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Contact Management</h2>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {contact.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {contact.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {contact.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              contact.status === 'resolved' 
                                ? 'bg-green-100 text-green-800'
                                : contact.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
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
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Service Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetServiceForm();
                    setShowServiceModal(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Service</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center`}>
                        <span className="text-white text-xl">🛡️</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditService(service)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{service.description}</p>

                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500 text-xs">Order: {service.order}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
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

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Icon</label>
                  <select
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Color</label>
                  <select
                    value={serviceForm.color}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Features</label>
                <div className="space-y-2 mb-4">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...serviceForm.features];
                          newFeatures[index] = e.target.value;
                          setServiceForm(prev => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={serviceForm.order}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={serviceForm.active}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
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
                  <span>{editingService ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;