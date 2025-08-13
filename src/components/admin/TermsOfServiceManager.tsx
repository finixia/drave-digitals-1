import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Scale, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { apiService, TermsOfServiceData } from '../../utils/api';

interface TermsOfServiceManagerProps {
  onBack: () => void;
}

const TermsOfServiceManager: React.FC<TermsOfServiceManagerProps> = ({ onBack }) => {
  const [termsData, setTermsData] = useState<TermsOfServiceData>({
    title: 'Terms of Service',
    subtitle: 'Legal Terms and Conditions',
    introduction: '',
    sections: [],
    contactInfo: {
      email: 'legal@dravedigitals.com',
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
    fetchTermsOfService();
  }, []);

  const fetchTermsOfService = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTermsOfService();
      if (data && Object.keys(data).length > 0) {
        setTermsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch terms of service:', error);
      setStatus('error');
      setStatusMessage('Failed to load terms of service data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus('idle');
      await apiService.updateTermsOfService(termsData);
      setStatus('success');
      setStatusMessage('Terms of service updated successfully!');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to update terms of service');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setTermsData(prev => ({
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

  const updateSection = (sectionIndex: number, field: string, value: string) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const deleteSection = (sectionIndex: number) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }));
  };

  const addContentBlock = (sectionIndex: number) => {
    setTermsData(prev => ({
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

  const updateContentBlock = (sectionIndex: number, contentIndex: number, field: string, value: string | string[]) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, cIndex) =>
                cIndex === contentIndex
                  ? { ...content, [field]: value }
                  : content
              )
            }
          : section
      )
    }));
  };

  const addItem = (sectionIndex: number, contentIndex: number) => {
    setTermsData(prev => ({
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
    setTermsData(prev => ({
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

  const deleteItem = (sectionIndex: number, contentIndex: number, itemIndex: number) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              content: section.content.map((content, cIndex) =>
                cIndex === contentIndex
                  ? {
                      ...content,
                      items: content.items.filter((_, iIndex) => iIndex !== itemIndex)
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
        <span className="ml-3 text-gray-600">Loading terms of service...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </motion.button>
          <div className="flex items-center space-x-3">
            <Scale className="text-red-400" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service Manager</h1>
          </div>
        </div>
        
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: saving ? 1 : 0.95 }}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={termsData.title}
              onChange={(e) => setTermsData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={termsData.subtitle}
              onChange={(e) => setTermsData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-gray-600 text-sm font-medium mb-2">Introduction</label>
          <textarea
            value={termsData.introduction}
            onChange={(e) => setTermsData(prev => ({ ...prev, introduction: e.target.value }))}
            rows={4}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors resize-none"
            placeholder="Enter the introduction text for your terms of service..."
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={termsData.contactInfo.email}
              onChange={(e) => setTermsData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, email: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={termsData.contactInfo.phone}
              onChange={(e) => setTermsData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, phone: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={termsData.contactInfo.address}
              onChange={(e) => setTermsData(prev => ({ 
                ...prev, 
                contactInfo: { ...prev.contactInfo, address: e.target.value }
              }))}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Terms Sections</h2>
          <motion.button
            onClick={addSection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Section</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {termsData.sections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2 py-1"
                  placeholder="Section Title"
                />
                <motion.button
                  onClick={() => deleteSection(sectionIndex)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>

              {section.content.map((content, contentIndex) => (
                <div key={contentIndex} className="mb-4 pl-4 border-l-2 border-gray-200">
                  {content.subtitle && (
                    <input
                      type="text"
                      value={content.subtitle}
                      onChange={(e) => updateContentBlock(sectionIndex, contentIndex, 'subtitle', e.target.value)}
                      className="font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2 py-1 mb-2 w-full"
                      placeholder="Subsection Title (optional)"
                    />
                  )}
                  
                  <div className="space-y-2">
                    {content.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <textarea
                          value={item}
                          onChange={(e) => updateItem(sectionIndex, contentIndex, itemIndex, e.target.value)}
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-red-400 focus:outline-none transition-colors resize-none"
                          placeholder="Enter terms item..."
                          rows={2}
                        />
                        <motion.button
                          onClick={() => deleteItem(sectionIndex, contentIndex, itemIndex)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    ))}
                    <motion.button
                      onClick={() => addItem(sectionIndex, contentIndex)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium inline-flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add Item</span>
                    </motion.button>
                  </div>
                </div>
              ))}

              <motion.button
                onClick={() => addContentBlock(sectionIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-red-500 hover:text-red-700 text-sm font-medium inline-flex items-center space-x-1 mt-2"
              >
                <Plus size={14} />
                <span>Add Content Block</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceManager;