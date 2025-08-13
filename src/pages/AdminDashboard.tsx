import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  Briefcase,
  Shield,
  Star,
  TrendingUp,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  FileText,
  Scale,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, ServiceData, TestimonialData, AboutContentData, ContactInfoData, DashboardStatsData, PrivacyPolicyData } from '../utils/api';

interface DashboardStats {
  totalContacts: number;
  totalJobApplications: number;
  totalFraudCases: number;
  totalUsers: number;
  happyClients: string;
  successRate: string;
  fraudCasesResolved: string;
  growthRate: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalJobApplications: 0,
    totalFraudCases: 0,
    totalUsers: 0,
    happyClients: '5000+',
    successRate: '98%',
    fraudCasesResolved: '1200+',
    growthRate: '150%'
  });
  const [contacts, setContacts] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [fraudCases, setFraudCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContentData>({
    title: '',
    subtitle: '',
    description: '',
    values: [],
    commitments: []
  });
  const [contactInfo, setContactInfo] = useState<ContactInfoData>({
    phone: [],
    email: [],
    address: [],
    workingHours: []
  });
  const [dashboardStatsData, setDashboardStatsData] = useState<DashboardStatsData>({
    happyClients: '5000+',
    successRate: '98%',
    fraudCasesResolved: '1200+',
    growthRate: '150%'
  });
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicyData>({
    title: '',
    subtitle: '',
    introduction: '',
    sections: [],
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [editingStats, setEditingStats] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingPrivacy, setEditingPrivacy] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        dashboardStats,
        contactsData,
        jobAppsData,
        fraudCasesData,
        usersData,
        testimonialsData,
        servicesData,
        aboutData,
        contactInfoData,
        dashboardStatsInfo,
        privacyPolicyData
      ] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getContacts(),
        apiService.getJobApplications(),
        apiService.getFraudCases(),
        apiService.getUsers(),
        apiService.getTestimonialsAdmin(),
        apiService.getServicesAdmin(),
        apiService.getAboutContent(),
        apiService.getContactInfo(),
        apiService.getDashboardStatsData(),
        apiService.getPrivacyPolicy()
      ]);

      // Set dynamic stats from API
      setStats({
        totalContacts: contactsData?.length || 0,
        totalJobApplications: jobAppsData?.length || 0,
        totalFraudCases: fraudCasesData?.length || 0,
        totalUsers: usersData?.length || 0,
        happyClients: dashboardStatsInfo?.happyClients || '5000+',
        successRate: dashboardStatsInfo?.successRate || '98%',
        fraudCasesResolved: dashboardStatsInfo?.fraudCasesResolved || '1200+',
        growthRate: dashboardStatsInfo?.growthRate || '150%'
      });

      setContacts(contactsData || []);
      setJobApplications(jobAppsData || []);
      setFraudCases(fraudCasesData || []);
      setUsers(usersData || []);
      setTestimonials(testimonialsData || []);
      setServices(servicesData || []);
      
      if (aboutData && Object.keys(aboutData).length > 0) {
        setAboutContent(aboutData);
      }
      
      if (contactInfoData && Object.keys(contactInfoData).length > 0) {
        setContactInfo(contactInfoData);
      }
      
      if (dashboardStatsInfo && Object.keys(dashboardStatsInfo).length > 0) {
        setDashboardStatsData(dashboardStatsInfo);
      }
      
      if (privacyPolicyData && Object.keys(privacyPolicyData).length > 0) {
        setPrivacyPolicy(privacyPolicyData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleUpdateStats = async () => {
    try {
      await apiService.updateDashboardStats(dashboardStatsData);
      setStats(prev => ({
        ...prev,
        happyClients: dashboardStatsData.happyClients,
        successRate: dashboardStatsData.successRate,
        fraudCasesResolved: dashboardStatsData.fraudCasesResolved,
        growthRate: dashboardStatsData.growthRate
      }));
      setEditingStats(false);
      alert('Dashboard stats updated successfully!');
    } catch (error) {
      console.error('Failed to update stats:', error);
      alert('Failed to update stats. Please try again.');
    }
  };

  const handleUpdateAbout = async () => {
    try {
      await apiService.updateAboutContent(aboutContent);
      setEditingAbout(false);
      alert('About content updated successfully!');
    } catch (error) {
      console.error('Failed to update about content:', error);
      alert('Failed to update about content. Please try again.');
    }
  };

  const handleUpdateContact = async () => {
    try {
      await apiService.updateContactInfo(contactInfo);
      setEditingContact(false);
      alert('Contact info updated successfully!');
    } catch (error) {
      console.error('Failed to update contact info:', error);
      alert('Failed to update contact info. Please try again.');
    }
  };

  const handleUpdatePrivacy = async () => {
    try {
      await apiService.updatePrivacyPolicy(privacyPolicy);
      setEditingPrivacy(false);
      alert('Privacy policy updated successfully!');
    } catch (error) {
      console.error('Failed to update privacy policy:', error);
      alert('Failed to update privacy policy. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingStats(!editingStats)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
        >
          <Edit size={16} />
          <span>Edit Stats</span>
        </motion.button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <Mail className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Job Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalJobApplications}</p>
            </div>
            <Briefcase className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Fraud Cases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFraudCases}</p>
            </div>
            <Shield className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Website Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Happy Clients</p>
              {editingStats ? (
                <input
                  type="text"
                  value={dashboardStatsData.happyClients}
                  onChange={(e) => setDashboardStatsData(prev => ({ ...prev, happyClients: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.happyClients}</p>
              )}
            </div>
            <Users className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              {editingStats ? (
                <input
                  type="text"
                  value={dashboardStatsData.successRate}
                  onChange={(e) => setDashboardStatsData(prev => ({ ...prev, successRate: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.successRate}</p>
              )}
            </div>
            <TrendingUp className="text-purple-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Fraud Cases Resolved</p>
              {editingStats ? (
                <input
                  type="text"
                  value={dashboardStatsData.fraudCasesResolved}
                  onChange={(e) => setDashboardStatsData(prev => ({ ...prev, fraudCasesResolved: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.fraudCasesResolved}</p>
              )}
            </div>
            <Shield className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Growth Rate</p>
              {editingStats ? (
                <input
                  type="text"
                  value={dashboardStatsData.growthRate}
                  onChange={(e) => setDashboardStatsData(prev => ({ ...prev, growthRate: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.growthRate}</p>
              )}
            </div>
            <TrendingUp className="text-orange-400" size={32} />
          </div>
        </div>
      </div>

      {editingStats && (
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpdateStats}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditingStats(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center space-x-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </motion.button>
        </div>
      )}
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Privacy Policy Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingPrivacy(!editingPrivacy)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
        >
          <Edit size={16} />
          <span>{editingPrivacy ? 'Cancel Edit' : 'Edit Privacy Policy'}</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            {editingPrivacy ? (
              <input
                type="text"
                value={privacyPolicy.title}
                onChange={(e) => setPrivacyPolicy(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Privacy Policy"
              />
            ) : (
              <p className="text-gray-900">{privacyPolicy.title || 'Privacy Policy'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Subtitle</label>
            {editingPrivacy ? (
              <input
                type="text"
                value={privacyPolicy.subtitle}
                onChange={(e) => setPrivacyPolicy(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                placeholder="How we protect your data"
              />
            ) : (
              <p className="text-gray-900">{privacyPolicy.subtitle || 'How we protect your data'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Introduction</label>
            {editingPrivacy ? (
              <textarea
                value={privacyPolicy.introduction}
                onChange={(e) => setPrivacyPolicy(prev => ({ ...prev, introduction: e.target.value }))}
                rows={4}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Introduction to your privacy policy..."
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-line">{privacyPolicy.introduction || 'Introduction to your privacy policy...'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact Information</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                {editingPrivacy ? (
                  <input
                    type="email"
                    value={privacyPolicy.contactInfo.email}
                    onChange={(e) => setPrivacyPolicy(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="privacy@company.com"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{privacyPolicy.contactInfo.email || 'privacy@company.com'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Phone</label>
                {editingPrivacy ? (
                  <input
                    type="text"
                    value={privacyPolicy.contactInfo.phone}
                    onChange={(e) => setPrivacyPolicy(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="+91 9876543210"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{privacyPolicy.contactInfo.phone || '+91 9876543210'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Address</label>
                {editingPrivacy ? (
                  <input
                    type="text"
                    value={privacyPolicy.contactInfo.address}
                    onChange={(e) => setPrivacyPolicy(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, address: e.target.value }
                    }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Mumbai, Maharashtra"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{privacyPolicy.contactInfo.address || 'Mumbai, Maharashtra'}</p>
                )}
              </div>
            </div>
          </div>

          {editingPrivacy && (
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdatePrivacy}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingPrivacy(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-blue-900 font-medium">Privacy Policy Information</h4>
            <p className="text-blue-700 text-sm mt-1">
              The privacy policy content is displayed on the website at /privacy-policy. 
              Make sure to keep it updated with your current data handling practices and legal requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'contacts', name: 'Contacts', icon: Mail },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'testimonials', name: 'Testimonials', icon: Star },
    { id: 'services', name: 'Services', icon: Briefcase },
    { id: 'about', name: 'About Us', icon: Info },
    { id: 'privacy', name: 'Privacy Policy', icon: Scale }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/company logo.png" 
              alt="Drave Capitals Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </motion.button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'privacy' && renderPrivacyPolicy()}
          {/* Other tabs would be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;