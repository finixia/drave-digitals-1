import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Mail,
  Briefcase,
  Shield,
  Star,
  Settings,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Phone,
  FileText,
  Scale,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalJobApplications: 0,
    totalFraudCases: 0,
    totalUsers: 0
  });
  const [contacts, setContacts] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [fraudCases, setFraudCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [aboutContent, setAboutContent] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [dashboardStats, setDashboardStats] = useState({});
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const [termsOfService, setTermsOfService] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingStats, setEditingStats] = useState({});
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [editingAboutContent, setEditingAboutContent] = useState(false);
  const [editingPrivacyPolicy, setEditingPrivacyPolicy] = useState(false);
  const [editingTermsOfService, setEditingTermsOfService] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        dashboardData,
        contactsData,
        jobAppsData,
        fraudData,
        usersData,
        testimonialsData,
        servicesData,
        aboutData,
        contactInfoData,
        dashboardStatsData,
        privacyData,
        termsData
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
        apiService.getPrivacyPolicy(),
        apiService.getTermsOfService()
      ]);

      setStats(dashboardData);
      setContacts(contactsData || []);
      setJobApplications(jobAppsData || []);
      setFraudCases(fraudData || []);
      setUsers(usersData || []);
      setTestimonials(testimonialsData || []);
      setServices(servicesData || []);
      setAboutContent(aboutData || {});
      setContactInfo(contactInfoData || {});
      setDashboardStats(dashboardStatsData || {});
      setPrivacyPolicy(privacyData || {});
      setTermsOfService(termsData || {});
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

  const handleEditStat = (statKey) => {
    setEditingStats({
      ...editingStats,
      [statKey]: true
    });
  };

  const handleSaveStat = async (statKey, value) => {
    try {
      const updatedStats = {
        ...dashboardStats,
        [statKey]: value
      };
      await apiService.updateDashboardStats(updatedStats);
      setDashboardStats(updatedStats);
      setEditingStats({
        ...editingStats,
        [statKey]: false
      });
    } catch (error) {
      console.error('Failed to update stat:', error);
    }
  };

  const handleCancelEdit = (statKey) => {
    setEditingStats({
      ...editingStats,
      [statKey]: false
    });
  };

  const handleUpdateContactInfo = async (updatedInfo) => {
    try {
      await apiService.updateContactInfo(updatedInfo);
      setContactInfo(updatedInfo);
      setEditingContactInfo(false);
    } catch (error) {
      console.error('Failed to update contact info:', error);
    }
  };

  const handleUpdateAboutContent = async (updatedContent) => {
    try {
      await apiService.updateAboutContent(updatedContent);
      setAboutContent(updatedContent);
      setEditingAboutContent(false);
    } catch (error) {
      console.error('Failed to update about content:', error);
    }
  };

  const handleUpdatePrivacyPolicy = async (updatedPolicy) => {
    try {
      await apiService.updatePrivacyPolicy(updatedPolicy);
      setPrivacyPolicy(updatedPolicy);
      setEditingPrivacyPolicy(false);
    } catch (error) {
      console.error('Failed to update privacy policy:', error);
    }
  };

  const handleUpdateTermsOfService = async (updatedTerms) => {
    try {
      await apiService.updateTermsOfService(updatedTerms);
      setTermsOfService(updatedTerms);
      setEditingTermsOfService(false);
    } catch (error) {
      console.error('Failed to update terms of service:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'about', label: 'About Us', icon: FileText },
    { id: 'contact-info', label: 'Contact Info', icon: Phone },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms-of-service', label: 'Terms of Service', icon: Scale }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Mail className="text-blue-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalContacts}</div>
          <div className="text-gray-600">Total Contacts</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="text-green-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalJobApplications}</div>
          <div className="text-gray-600">Job Applications</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-red-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalFraudCases}</div>
          <div className="text-gray-600">Fraud Cases</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-purple-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
      </div>

      {/* Editable Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Happy Clients */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400">❤️</div>
            {!editingStats.happyClients ? (
              <button
                onClick={() => handleEditStat('happyClients')}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit size={16} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const input = document.getElementById('happyClients-input');
                    handleSaveStat('happyClients', input.value);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleCancelEdit('happyClients')}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {editingStats.happyClients ? (
            <input
              id="happyClients-input"
              type="text"
              defaultValue={dashboardStats.happyClients || '5000+'}
              className="text-3xl font-bold text-gray-900 mb-2 w-full border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {dashboardStats.happyClients || '5000+'}
            </div>
          )}
          <div className="text-gray-600">Happy Clients</div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-400">📈</div>
            {!editingStats.successRate ? (
              <button
                onClick={() => handleEditStat('successRate')}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit size={16} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const input = document.getElementById('successRate-input');
                    handleSaveStat('successRate', input.value);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleCancelEdit('successRate')}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {editingStats.successRate ? (
            <input
              id="successRate-input"
              type="text"
              defaultValue={dashboardStats.successRate || '98%'}
              className="text-3xl font-bold text-gray-900 mb-2 w-full border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {dashboardStats.successRate || '98%'}
            </div>
          )}
          <div className="text-gray-600">Success Rate</div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-orange-400">🏆</div>
            {!editingStats.growthRate ? (
              <button
                onClick={() => handleEditStat('growthRate')}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit size={16} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const input = document.getElementById('growthRate-input');
                    handleSaveStat('growthRate', input.value);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleCancelEdit('growthRate')}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {editingStats.growthRate ? (
            <input
              id="growthRate-input"
              type="text"
              defaultValue={dashboardStats.growthRate || '150%'}
              className="text-3xl font-bold text-gray-900 mb-2 w-full border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {dashboardStats.growthRate || '150%'}
            </div>
          )}
          <div className="text-gray-600">Growth Rate</div>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Contact Information Management</h2>
        <button
          onClick={() => setEditingContactInfo(!editingContactInfo)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {editingContactInfo ? 'Cancel' : 'Edit Contact Info'}
        </button>
      </div>

      {editingContactInfo ? (
        <ContactInfoEditor
          contactInfo={contactInfo}
          onSave={handleUpdateContactInfo}
          onCancel={() => setEditingContactInfo(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phone Numbers</h3>
              <div className="space-y-2">
                {(contactInfo.phone || []).map((phone, index) => (
                  <div key={index} className="text-gray-600">{phone}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Addresses</h3>
              <div className="space-y-2">
                {(contactInfo.email || []).map((email, index) => (
                  <div key={index} className="text-gray-600">{email}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Address</h3>
              <div className="space-y-2">
                {(contactInfo.address || []).map((addr, index) => (
                  <div key={index} className="text-gray-600">{addr}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Working Hours</h3>
              <div className="space-y-2">
                {(contactInfo.workingHours || []).map((hours, index) => (
                  <div key={index} className="text-gray-600">{hours}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Privacy Policy Management</h2>
        <button
          onClick={() => setEditingPrivacyPolicy(!editingPrivacyPolicy)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {editingPrivacyPolicy ? 'Cancel' : 'Edit Privacy Policy'}
        </button>
      </div>

      {editingPrivacyPolicy ? (
        <PrivacyPolicyEditor
          privacyPolicy={privacyPolicy}
          onSave={handleUpdatePrivacyPolicy}
          onCancel={() => setEditingPrivacyPolicy(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {privacyPolicy.title || 'Privacy Policy'}
          </h3>
          <p className="text-gray-600 mb-6">
            {privacyPolicy.subtitle || 'Data Protection and Privacy Information'}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {privacyPolicy.introduction || 'Privacy policy content will appear here...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderTermsOfService = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Terms of Service Management</h2>
        <button
          onClick={() => setEditingTermsOfService(!editingTermsOfService)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {editingTermsOfService ? 'Cancel' : 'Edit Terms'}
        </button>
      </div>

      {editingTermsOfService ? (
        <TermsOfServiceEditor
          termsOfService={termsOfService}
          onSave={handleUpdateTermsOfService}
          onCancel={() => setEditingTermsOfService(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {termsOfService.title || 'Terms of Service'}
          </h3>
          <p className="text-gray-600 mb-6">
            {termsOfService.subtitle || 'Legal Terms and Conditions'}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {termsOfService.introduction || 'Terms of service content will appear here...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAboutUs = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">About Us Management</h2>
        <button
          onClick={() => setEditingAboutContent(!editingAboutContent)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {editingAboutContent ? 'Cancel' : 'Edit About Content'}
        </button>
      </div>

      {editingAboutContent ? (
        <AboutContentEditor
          aboutContent={aboutContent}
          onSave={handleUpdateAboutContent}
          onCancel={() => setEditingAboutContent(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {aboutContent.title || 'Your Trusted Career Partner'}
          </h3>
          <p className="text-gray-600 mb-6">
            {aboutContent.description || 'About content will appear here...'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Values</h4>
              <div className="space-y-4">
                {(aboutContent.values || []).map((value, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-gray-800">{value.title}</h5>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Commitments</h4>
              <div className="space-y-2">
                {(aboutContent.commitments || []).map((commitment, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-gray-600 text-sm">{commitment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'contacts':
        return <ContactsTab contacts={contacts} />;
      case 'users':
        return <UsersTab users={users} />;
      case 'testimonials':
        return <TestimonialsTab testimonials={testimonials} onRefresh={fetchDashboardData} />;
      case 'services':
        return <ServicesTab services={services} onRefresh={fetchDashboardData} />;
      case 'about':
        return renderAboutUs();
      case 'contact-info':
        return renderContactInfo();
      case 'privacy-policy':
        return renderPrivacyPolicy();
      case 'terms-of-service':
        return renderTermsOfService();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/company logo.png" 
                alt="Drave Capitals Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Welcome back, {user?.name || 'Admin'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ContactInfoEditor = ({ contactInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    phone: contactInfo.phone || [''],
    email: contactInfo.email || [''],
    address: contactInfo.address || [''],
    workingHours: contactInfo.workingHours || ['']
  });

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSave = () => {
    const cleanedData = {
      phone: formData.phone.filter(item => item.trim()),
      email: formData.email.filter(item => item.trim()),
      address: formData.address.filter(item => item.trim()),
      workingHours: formData.workingHours.filter(item => item.trim())
    };
    onSave(cleanedData);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(formData).map(([field, values]) => (
          <div key={field}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </h3>
              <button
                onClick={() => addArrayItem(field)}
                className="text-red-500 hover:text-red-700"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {values.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleArrayChange(field, index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                  {values.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(field, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const AboutContentEditor = ({ aboutContent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: aboutContent.title || '',
    subtitle: aboutContent.subtitle || '',
    description: aboutContent.description || '',
    values: aboutContent.values || [{ title: '', description: '', icon: 'Target' }],
    commitments: aboutContent.commitments || ['']
  });

  const handleSave = () => {
    const cleanedData = {
      ...formData,
      values: formData.values.filter(v => v.title.trim() && v.description.trim()),
      commitments: formData.commitments.filter(c => c.trim())
    };
    onSave(cleanedData);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const PrivacyPolicyEditor = ({ privacyPolicy, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: privacyPolicy.title || 'Privacy Policy',
    subtitle: privacyPolicy.subtitle || 'Data Protection and Privacy Information',
    introduction: privacyPolicy.introduction || '',
    contactInfo: privacyPolicy.contactInfo || {
      email: 'privacy@dravedigitals.com',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra, India'
    }
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, email: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="text"
              value={formData.contactInfo.phone}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, phone: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
            <input
              type="text"
              value={formData.contactInfo.address}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, address: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const TermsOfServiceEditor = ({ termsOfService, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: termsOfService.title || 'Terms of Service',
    subtitle: termsOfService.subtitle || 'Legal Terms and Conditions',
    introduction: termsOfService.introduction || '',
    contactInfo: termsOfService.contactInfo || {
      email: 'legal@dravedigitals.com',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra, India'
    }
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, email: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="text"
              value={formData.contactInfo.phone}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, phone: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
            <input
              type="text"
              value={formData.contactInfo.address}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, address: e.target.value }
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ContactsTab = ({ contacts }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Contacts Management</h2>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <p className="text-gray-600">Contacts management functionality will be implemented here.</p>
    </div>
  </div>
);

const UsersTab = ({ users }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Users Management</h2>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <p className="text-gray-600">Users management functionality will be implemented here.</p>
    </div>
  </div>
);

const TestimonialsTab = ({ testimonials, onRefresh }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Testimonials Management</h2>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <p className="text-gray-600">Testimonials management functionality will be implemented here.</p>
    </div>
  </div>
);

const ServicesTab = ({ services, onRefresh }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Services Management</h2>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <p className="text-gray-600">Services management functionality will be implemented here.</p>
    </div>
  </div>
);

export default AdminDashboard;