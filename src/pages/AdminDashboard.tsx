import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Star,
  Settings,
  LogOut,
  FileText,
  Scale,
  Shield,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import admin components
import OverviewTab from '../components/admin/OverviewTab';
import ContactsTab from '../components/admin/ContactsTab';
import UsersTab from '../components/admin/UsersTab';
import TestimonialsTab from '../components/admin/TestimonialsTab';
import ServicesTab from '../components/admin/ServicesTab';
import AboutUsTab from '../components/admin/AboutUsTab';
import PrivacyPolicyManager from '../components/admin/PrivacyPolicyManager';
import TermsOfServiceManager from '../components/admin/TermsOfServiceManager';
import ContactInfoManager from '../components/admin/ContactInfoManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: Scale },
    { id: 'contact-info', label: 'Contact Info', icon: Phone },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'contacts':
        return <ContactsTab />;
      case 'users':
        return <UsersTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'services':
        return <ServicesTab />;
      case 'about':
        return <AboutUsTab />;
      case 'privacy':
        return <PrivacyPolicyManager />;
      case 'terms':
        return <TermsOfServiceManager />;
      case 'contact-info':
        return <ContactInfoManager />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="/company logo.png" 
              alt="Drave Capitals Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Drave Digitals</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user?.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-600">{user?.email}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;