import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Shield
} from 'lucide-react';
import { apiService, PrivacyPolicyData } from '../../utils/api';

const PrivacyPolicyManager = () => {
  const [privacyData, setPrivacyData] = useState<PrivacyPolicyData>({
    title: 'Privacy Policy',
    subtitle: 'How we protect your data',
    introduction: '',
    sections: [],
    contactInfo: {
      email: 'privacy@dravedigitals.com',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra, India'
    },
    active: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPrivacyPolicy();
      if (data && Object.keys(data).length > 0) {
        setPrivacyData(data);
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus('idle');
      await apiService.updatePrivacyPolicy(privacyData);
      setStatus('success');
      setStatusMessage('Privacy Policy updated successfully!');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to update privacy policy');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setPrivacyData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: 'New Section',
          content: [
            {
              subtitle: '',
              items: ['']
            }
          ]
        }
      ]
    }));
  };

  const updateSection = (sectionIndex: number, field: string, value: any) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    }));
  };

  const deleteSection = (sectionIndex: number) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }));
  };

  const addContentBlock = (sectionIndex: number) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? {
              ...section,
              content: [
                ...section.content,
                { subtitle: '', items: [''] }
              ]
            }
          : section
      )
    }));
  };

  const updateContentBlock = (sectionIndex: number, contentIndex: number, field: string, value: any) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, cIndex) =>
                cIndex === contentIndex ? { ...content, [field]: value } : content
              )
            }
          : section
      )
    }));
  };

  const addItem = (sectionIndex: number, contentIndex: number) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, cIndex) =>
                cIndex === contentIndex 
                  ? { ...content, items: [...content.items, ''] }
                  : content
              )
            }
          : section
      )
    }));
  };

  const updateItem = (sectionIndex: number, contentIndex: number, itemIndex: number, value: string) => {
    setPrivacyData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, cIndex) =>
                cIndex === contentIndex 
                  ? {
                      ...content,
                      items: content.items.map((item, iIndex) =>
                        iIndex === itemIndex ? value : item
                      )
                    }
                  : content
              )
            }
          : section
      )
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
        <p className="ml-4 text-gray-600">Loading privacy policy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="text-red-400" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Management</h2>
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

      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={privacyData.title}
              onChange={(e) => setPrivacyData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={privacyData.subtitle}
              onChange={(e) => setPrivacyData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-gray-600 text-sm font-medium mb-2">Introduction</label>
          <textarea
            value={privacyData.introduction}
            onChange={(e) => setPrivacyData(prev => ({ ...prev, introduction: e.target.value }))}
            rows={4}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={privacyData.contactInfo.email}
              onChange={(e) => setPrivacyData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, email: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={privacyData.contactInfo.phone}
              onChange={(e) => setPrivacyData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, phone: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={privacyData.contactInfo.address}
              onChange={(e) => setPrivacyData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, address: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addSection}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Section</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {privacyData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2 py-1"
                  placeholder="Section Title"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteSection(sectionIndex)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="bg-gray-50 rounded-lg p-4">
                    <input
                      type="text"
                      value={content.subtitle || ''}
                      onChange={(e) => updateContentBlock(sectionIndex, contentIndex, 'subtitle', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium mb-3 focus:border-red-400 focus:outline-none"
                      placeholder="Subsection Title (optional)"
                    />
                    
                    <div className="space-y-2">
                      {content.items.map((item, itemIndex) => (
                        <textarea
                          key={itemIndex}
                          value={item}
                          onChange={(e) => updateItem(sectionIndex, contentIndex, itemIndex, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-400 focus:outline-none resize-none"
                          rows={2}
                          placeholder="Content item"
                        />
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addItem(sectionIndex, contentIndex)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Item
                      </motion.button>
                    </div>
                  </div>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addContentBlock(sectionIndex)}
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  + Add Content Block
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyManager;