import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, X, Save, Target } from 'lucide-react';
import { apiService, AboutContentData } from '../../utils/api';

interface AboutContent extends AboutContentData {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AboutUsTab = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutForm, setAboutForm] = useState<AboutContentData>({
    title: '',
    subtitle: '',
    description: '',
    values: [],
    commitments: [],
    active: true
  });
  const [newCommitment, setNewCommitment] = useState('');
  const [newValue, setNewValue] = useState({ title: '', description: '', icon: 'Target' });

  const iconOptions = ['Shield', 'Briefcase', 'Code', 'TrendingUp', 'Award', 'Users', 'Settings', 'Target', 'Heart'];

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const aboutData = await apiService.getAboutContent();
      setAboutContent(aboutData);
    } catch (error) {
      console.error('Failed to fetch about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateAboutContent(aboutForm);
      setShowAboutModal(false);
      await fetchAboutContent();
    } catch (error) {
      console.error('Failed to save about content:', error);
      alert(`Failed to save about content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditAbout = () => {
    if (aboutContent) {
      setAboutForm({
        title: aboutContent.title || '',
        subtitle: aboutContent.subtitle || '',
        description: aboutContent.description || '',
        values: aboutContent.values || [],
        commitments: aboutContent.commitments || [],
        active: aboutContent.active !== false
      });
    }
    setShowAboutModal(true);
  };

  const resetAboutForm = () => {
    setAboutForm({
      title: '',
      subtitle: '',
      description: '',
      values: [],
      commitments: [],
      active: true
    });
  };

  const addCommitment = () => {
    if (newCommitment.trim()) {
      setAboutForm(prev => ({
        ...prev,
        commitments: [...prev.commitments, newCommitment.trim()]
      }));
      setNewCommitment('');
    }
  };

  const removeCommitment = (index: number) => {
    setAboutForm(prev => ({
      ...prev,
      commitments: prev.commitments.filter((_, i) => i !== index)
    }));
  };

  const addValue = () => {
    if (newValue.title.trim() && newValue.description.trim()) {
      setAboutForm(prev => ({
        ...prev,
        values: [...prev.values, { ...newValue }]
      }));
      setNewValue({ title: '', description: '', icon: 'Target' });
    }
  };

  const removeValue = (index: number) => {
    setAboutForm(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">About Us Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEditAbout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Edit size={16} />
          <span>Edit About Content</span>
        </motion.button>
      </div>

      {aboutContent && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{aboutContent.title}</h3>
          <p className="text-gray-600 mb-6">{aboutContent.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Values</h4>
              <div className="space-y-4">
                {(aboutContent.values || []).map((value, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900">{value.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Commitments</h4>
              <div className="space-y-2">
                {(aboutContent.commitments || []).map((commitment, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-gray-700 text-sm">{commitment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Content Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit About Content</h2>
              <button
                onClick={() => {
                  setShowAboutModal(false);
                  resetAboutForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAboutSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={aboutForm.subtitle}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={aboutForm.description}
                  onChange={(e) => setAboutForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Values</label>
                <div className="space-y-4 mb-4">
                  {aboutForm.values.map((value, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{value.title}</h4>
                        <button
                          type="button"
                          onClick={() => removeValue(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newValue.title}
                    onChange={(e) => setNewValue(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Value title"
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newValue.description}
                    onChange={(e) => setNewValue(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Value description"
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      value={newValue.icon}
                      onChange={(e) => setNewValue(prev => ({ ...prev, icon: e.target.value }))}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addValue}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Commitments</label>
                <div className="space-y-2 mb-4">
                  {aboutForm.commitments.map((commitment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={commitment}
                        onChange={(e) => {
                          const newCommitments = [...aboutForm.commitments];
                          newCommitments[index] = e.target.value;
                          setAboutForm(prev => ({ ...prev, commitments: newCommitments }));
                        }}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeCommitment(index)}
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
                    value={newCommitment}
                    onChange={(e) => setNewCommitment(e.target.value)}
                    placeholder="Add new commitment"
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-red-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCommitment}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAboutModal(false);
                    resetAboutForm();
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AboutUsTab;