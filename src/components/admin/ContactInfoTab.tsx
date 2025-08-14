import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  X, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Edit
} from 'lucide-react';
import { apiService, ContactInfoData } from '../../utils/api';

const ContactInfoTab = () => {
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

  const updateItem = (field: keyof ContactInfoData, index: number, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (field: keyof ContactInfoData, index: number) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const contactFields = [
    {
      key: 'phone' as keyof ContactInfoData,
      label: 'Phone Numbers',
      icon: Phone,
      placeholder: 'Enter phone number',
      color: 'text-green-400'
    },
    {
      key: 'email' as keyof ContactInfoData,
      label: 'Email Addresses',
      icon: Mail,
      placeholder: 'Enter email address',
      color: 'text-blue-400'
    },
    {
      key: 'address' as keyof ContactInfoData,
      label: 'Address Lines',
      icon: MapPin,
      placeholder: 'Enter address line',
      color: 'text-purple-400'
    },
    {
      key: 'workingHours' as keyof ContactInfoData,
      label: 'Working Hours',
      icon: Clock,
      placeholder: 'Enter working hours',
      color: 'text-orange-400'
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Edit className="text-red-400" size={24} />
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

      {/* Contact Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contactFields.map((field) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center ${field.color}`}>
                  <field.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addItem(field.key)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus size={16} />
              </motion.button>
            </div>

            <div className="space-y-3">
              {contactInfo[field.key].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(field.key, index, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                  />
                  {contactInfo[field.key].length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(field.key, index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center space-x-2">
                <field.icon className={field.color} size={16} />
                <span className="font-medium text-gray-900">{field.label}</span>
              </div>
              <div className="space-y-1">
                {contactInfo[field.key].map((item, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {item || `${field.placeholder}...`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfoTab;