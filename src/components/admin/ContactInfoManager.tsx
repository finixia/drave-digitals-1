import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { apiService, ContactInfoData } from '../../utils/api';

const ContactInfoManager = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfoData>({
    phone: ['+91 9876543210', '+91 9876543211'],
    email: ['info@dravedigitals.com', 'support@dravedigitals.com'],
    address: ['123 Business District', 'Bangalore, Karnataka 530068'],
    workingHours: ['Mon - Fri: 9:00 AM - 7:00 PM', 'Sat: 10:00 AM - 4:00 PM']
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactInfo();
      if (data && Object.keys(data).length > 0) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus('idle');
      await apiService.updateContactInfo(contactInfo);
      setStatus('success');
      setStatusMessage('Contact information updated successfully!');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: keyof ContactInfoData) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: keyof ContactInfoData, index: number) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field: keyof ContactInfoData, index: number, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600">Loading contact information...</p>
      </div>
    );
  }

  const contactSections = [
    {
      title: 'Phone Numbers',
      field: 'phone' as keyof ContactInfoData,
      icon: Phone,
      placeholder: 'Enter phone number'
    },
    {
      title: 'Email Addresses',
      field: 'email' as keyof ContactInfoData,
      icon: Mail,
      placeholder: 'Enter email address'
    },
    {
      title: 'Addresses',
      field: 'address' as keyof ContactInfoData,
      icon: MapPin,
      placeholder: 'Enter address line'
    },
    {
      title: 'Working Hours',
      field: 'workingHours' as keyof ContactInfoData,
      icon: Clock,
      placeholder: 'Enter working hours'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="text-red-400" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Contact Information Management</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          {saving ? (
            <>
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Status Message */}
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center space-x-3 ${
            status === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{statusMessage}</span>
        </motion.div>
      )}

      {/* Contact Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactSections.map((section) => (
          <div key={section.field} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <section.icon className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(section.field)}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
              </motion.button>
            </div>

            <div className="space-y-3">
              {contactInfo[section.field].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(section.field, index, e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                    placeholder={section.placeholder}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(section.field, index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Phone size={16} className="text-red-400" />
              <span>Call Us</span>
            </h4>
            {contactInfo.phone.map((phone, index) => (
              <p key={index} className="text-gray-600 text-sm">{phone}</p>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Mail size={16} className="text-red-400" />
              <span>Email Us</span>
            </h4>
            {contactInfo.email.map((email, index) => (
              <p key={index} className="text-gray-600 text-sm">{email}</p>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <MapPin size={16} className="text-red-400" />
              <span>Visit Us</span>
            </h4>
            {contactInfo.address.map((addr, index) => (
              <p key={index} className="text-gray-600 text-sm">{addr}</p>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Clock size={16} className="text-red-400" />
              <span>Working Hours</span>
            </h4>
            {contactInfo.workingHours.map((hours, index) => (
              <p key={index} className="text-gray-600 text-sm">{hours}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoManager;