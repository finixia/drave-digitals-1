import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Briefcase,
  TrendingUp,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Menu,
  X,
  Settings,
  Edit,
  Plus,
  Trash2,
  Save,
  Eye,
  FileText,
  Image,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalContacts: 0,
    totalApplications: 0,
    totalFraudCases: 0,
    placedJobs: 0,
    resolvedFraudCases: 0,
    successRate: 0,
    totalUsers: 0,
    newsletterSubscribers: 0
  });
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [fraudCases, setFraudCases] = useState([]);
  const [websiteContent, setWebsiteContent] = useState({
    hero: {
      title: 'Your Professional Success Partner',
      subtitle: 'From landing your dream job to protecting against cyber fraud, we provide comprehensive career solutions and digital security services that empower your professional journey.',
      stats: [
        { label: 'Happy Clients', value: '5000+' },
        { label: 'Success Rate', value: '98%' },
        { label: 'Support', value: '24/7' }
      ]
    },
    services: [
      {
        id: 1,
        title: 'Cyber Crime Fraud Assistance',
        description: 'Complete protection against cyber fraud with expert guidance and legal support.',
        features: [
          'Cyber fraud complaint support',
          'FIR filing guidance',
          'Online complaint assistance',
          'Prevention tips & awareness'
        ]
      },
      {
        id: 2,
        title: 'Job Consultancy Services',
        description: 'End-to-end job placement services for IT & Non-IT professionals.',
        features: [
          'IT & Non-IT placements',
          'Resume building support',
          'Interview preparation',
          'Work from home opportunities'
        ]
      }
    ],
    testimonials: [
      {
        id: 1,
        name: 'Priya Sharma',
        role: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        rating: 5,
        text: 'CareerGuard helped me land my dream job in just 2 weeks! Their resume building and interview preparation services are exceptional.',
        service: 'Job Consultancy'
      }
    ],
    contact: {
      phone: '+91 9876543210',
      email: 'info@careerguard.com',
      address: '123 Business District, Mumbai, Maharashtra 400001',
      hours: 'Mon - Fri: 9:00 AM - 7:00 PM'
    }
  });
  const [editingContent, setEditingContent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchContacts();
    fetchJobApplications();
    fetchFraudCases();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await apiService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const fetchJobApplications = async () => {
    try {
      const data = await apiService.getJobApplications();
      setJobApplications(data);
    } catch (error) {
      console.error('Failed to fetch job applications:', error);
    }
  };

  const fetchFraudCases = async () => {
    try {
      const data = await apiService.getFraudCases();
      setFraudCases(data);
    } catch (error) {
      console.error('Failed to fetch fraud cases:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleEditContent = (section, item = null) => {
    setEditingContent({ section, item });
    if (item) {
      setEditForm({ ...item });
    } else {
      setEditForm(websiteContent[section] || {});
    }
  };

  const handleSaveContent = async () => {
    try {
      // Update local state
      if (editingContent.item) {
        // Editing existing item
        const updatedContent = { ...websiteContent };
        if (Array.isArray(updatedContent[editingContent.section])) {
          const index = updatedContent[editingContent.section].findIndex(
            item => item.id === editingContent.item.id
          );
          if (index !== -1) {
            updatedContent[editingContent.section][index] = editForm;
          }
        }
        setWebsiteContent(updatedContent);
      } else {
        // Editing section
        setWebsiteContent({
          ...websiteContent,
          [editingContent.section]: editForm
        });
      }

      // Here you would typically save to backend
      await apiService.updateWebsiteContent(editingContent.section, editForm);
      
      setEditingContent(null);
      setEditForm({});
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleDeleteItem = async (section, itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const updatedContent = { ...websiteContent };
        updatedContent[section] = updatedContent[section].filter(item => item.id !== itemId);
        setWebsiteContent(updatedContent);
        
        await apiService.deleteWebsiteContent(section, itemId);
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleAddItem = (section) => {
    const newItem = {
      id: Date.now(),
      title: '',
      description: '',
      ...(section === 'testimonials' && {
        name: '',
        role: '',
        company: '',
        rating: 5,
        text: '',
        service: ''
      }),
      ...(section === 'services' && {
        features: []
      })
    };
    
    setEditingContent({ section, item: newItem });
    setEditForm(newItem);
  };

  const stats = loading ? [
    {
      title: 'Total Clients',
      value: '...',
      change: '...',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Job Placements',
      value: '...',
      change: '...',
      icon: Briefcase,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Fraud Cases Resolved',
      value: '...',
      change: '...',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Success Rate',
      value: '...',
      change: '...',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ] : [
    {
      title: 'Total Clients',
      value: dashboardStats.totalContacts.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Job Placements',
      value: dashboardStats.placedJobs.toLocaleString(),
      change: '+8%',
      icon: Briefcase,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Fraud Cases Resolved',
      value: dashboardStats.resolvedFraudCases.toLocaleString(),
      change: '+15%',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Success Rate',
      value: `${dashboardStats.successRate}%`,
      change: '+22%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'jobs', label: 'Job Applications', icon: Briefcase },
    { id: 'fraud', label: 'Fraud Cases', icon: Shield },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:relative lg:translate-x-0 w-64 h-full bg-white border-r border-gray-200 z-50 lg:z-auto shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <img 
              src="/company logo.png" 
              alt="Drave Capitals Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-gray-900 font-bold">Drave Capitals</h1>
              <p className="text-gray-600 text-xs">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <p className="text-gray-900 font-medium">{user?.name}</p>
                <p className="text-gray-600 text-xs">{user?.email}</p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-900"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'content' && 'Website Content Management'}
                  {activeTab === 'clients' && 'Client Management'}
                  {activeTab === 'jobs' && 'Job Applications'}
                  {activeTab === 'fraud' && 'Fraud Cases'}
                  {activeTab === 'inquiries' && 'Client Inquiries'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="text-gray-600 text-sm">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                        <stat.icon className={stat.color} size={24} />
                      </div>
                      <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('content')}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                >
                  <Globe className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Website</h3>
                  <p className="text-gray-600">Update content, services, and testimonials</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('clients')}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                >
                  <Users className="text-green-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">View Clients</h3>
                  <p className="text-gray-600">Manage client inquiries and contacts</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                >
                  <Briefcase className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Job Applications</h3>
                  <p className="text-gray-600">Review and manage job applications</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Hero Section Management */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Hero Section</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditContent('hero')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                    <p className="text-gray-900">{websiteContent.hero.title}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Subtitle</label>
                    <p className="text-gray-600">{websiteContent.hero.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Services Management */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Services</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddItem('services')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Service</span>
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {websiteContent.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{service.title}</h4>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleEditContent('services', service)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDeleteItem('services', service.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials Management */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Testimonials</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddItem('testimonials')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Testimonial</span>
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {websiteContent.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleEditContent('testimonials', testimonial)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDeleteItem('testimonials', testimonial.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</p>
                      <p className="text-gray-700 text-sm mt-2">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Client Contacts</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{contact.name}</td>
                        <td className="py-3 px-4">{contact.email}</td>
                        <td className="py-3 px-4">{contact.service}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(contact.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Job Applications</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Experience</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobApplications.map((application) => (
                      <tr key={application._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{application.name}</td>
                        <td className="py-3 px-4">{application.position}</td>
                        <td className="py-3 px-4">{application.experience}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            application.status === 'placed' ? 'bg-green-100 text-green-800' :
                            application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'screening' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(application.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'fraud' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Fraud Cases</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudCases.map((fraudCase) => (
                      <tr key={fraudCase._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{fraudCase.name}</td>
                        <td className="py-3 px-4">{fraudCase.fraudType}</td>
                        <td className="py-3 px-4">₹{fraudCase.amount?.toLocaleString() || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fraudCase.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            fraudCase.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {fraudCase.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(fraudCase.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Edit {editingContent.section}
              </h3>
              <button
                onClick={() => setEditingContent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {editingContent.section === 'hero' && (
                <>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Subtitle</label>
                    <textarea
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </>
              )}

              {editingContent.section === 'services' && (
                <>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </>
              )}

              {editingContent.section === 'testimonials' && (
                <>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value={editForm.role || ''}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={editForm.company || ''}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Testimonial</label>
                    <textarea
                      value={editForm.text || ''}
                      onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingContent(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveContent}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;