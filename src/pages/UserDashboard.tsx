import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Edit, 
  Download, 
  Upload, 
  Save, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Building,
  Target,
  Award,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [newResume, setNewResume] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      // Fetch complete user profile from API
      const profileData = await apiService.getUserProfile(user.id);
      setUserProfile(profileData);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user?.gender || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        currentPosition: user?.currentPosition || '',
        experience: user?.experience || '',
        skills: user?.skills || '',
        education: user?.education || '',
        expectedSalary: user?.expectedSalary || '',
        preferredLocation: user?.preferredLocation || '',
        name: profileData?.name || '',
        email: profileData?.email || '',
        phone: profileData?.phone || '',
        dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData?.gender || '',
        address: profileData?.address || '',
        city: profileData?.city || '',
        state: profileData?.state || '',
        pincode: profileData?.pincode || '',
        currentPosition: profileData?.currentPosition || '',
        experience: profileData?.experience || '',
        skills: profileData?.skills || '',
        education: profileData?.education || '',
        expectedSalary: profileData?.expectedSalary || '',
        preferredLocation: profileData?.preferredLocation || '',
        jobType: profileData?.jobType || '',
        workMode: profileData?.workMode || '',
        interestedServices: profileData?.interestedServices || []
      });
    } catch (error) {
      // Fetch complete user profile from API
      const profileData = await apiService.getUserProfile(user.id);
      setUserProfile(profileData);
      setFormData({
        name: profileData?.name || '',
        email: profileData?.email || '',
        phone: profileData?.phone || '',
        dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profileData?.gender || '',
        address: profileData?.address || '',
        city: profileData?.city || '',
        state: profileData?.state || '',
        pincode: profileData?.pincode || '',
        currentPosition: profileData?.currentPosition || '',
        experience: profileData?.experience || '',
        skills: profileData?.skills || '',
        education: profileData?.education || '',
        expectedSalary: profileData?.expectedSalary || '',
        preferredLocation: profileData?.preferredLocation || '',
        jobType: profileData?.jobType || '',
        workMode: profileData?.workMode || '',
        interestedServices: profileData?.interestedServices || []
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setStatus('error');
        setStatusMessage('File size should be less than 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setStatus('error');
        setStatusMessage('Please upload a PDF or Word document');
        return;
      }
      
      setNewResume(file);
      setStatus('idle');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setStatus('idle');
      
      const updateData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          if (key === 'interestedServices' && Array.isArray(value)) {
          } else {
            updateData.append(key, value.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = () => {
    if (userProfile?.resume) {
      const resumeUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${userProfile.resume}`;
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${userProfile.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExperienceLabel = (exp: string) => {
    const expMap: { [key: string]: string } = {
      'fresher': 'Fresher (0 years)',
      '1-2': '1-2 years',
      '3-5': '3-5 years',
      '6-10': '6-10 years',
      '10+': '10+ years'
    };
    return expMap[exp] || exp;
  };

  const getEducationLabel = (edu: string) => {
    const eduMap: { [key: string]: string } = {
      'high-school': 'High School',
      'diploma': 'Diploma',
      'bachelors': "Bachelor's Degree",
      'masters': "Master's Degree",
      'phd': 'PhD'
    };
    return eduMap[edu] || edu;
  };

  if (isLoading && !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </motion.button>
              <div className="flex items-center space-x-3">
                <img 
                  src="/company logo.png" 
                  alt="Drave Capitals Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
                  <p className="text-sm text-gray-600">Drave Digitals</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {userProfile?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userProfile?.name}</h2>
                <p className="text-gray-600">{userProfile?.email}</p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle size={12} className="mr-1" />
                  Active Member
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="text-blue-400 mx-auto mb-1" size={20} />
                  <div className="text-xs text-gray-600">Member Since</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : '2024'}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Award className="text-green-400 mx-auto mb-1" size={20} />
                  <div className="text-xs text-gray-600">Profile</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {userProfile?.profileCompleted ? 'Complete' : 'Incomplete'}
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
                {userProfile?.resume ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="text-red-400" size={20} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Current Resume</p>
                        <p className="text-xs text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadResume}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Download Resume</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600 text-sm">No resume uploaded</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        setNewResume(null);
                        setStatus('idle');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                    status === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
                >
                  {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{statusMessage}</span>
                </motion.div>
              )}

              {/* Personal Information Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User className="text-red-400" size={20} />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.name || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                      {isEditing ? (
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.email || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.phone || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Date of Birth</label>
                      {isEditing ? (
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {formatDate(userProfile?.dateOfBirth)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900 capitalize">
                          {userProfile?.gender || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">PIN Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.pincode || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Address</label>
                    {isEditing ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                        <textarea
                          name="address"
                          value={formData.address || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                        {userProfile?.address || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.city || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.state || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Briefcase className="text-red-400" size={20} />
                    <span>Professional Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Current Position</label>
                      {isEditing ? (
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            name="currentPosition"
                            value={formData.currentPosition || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.currentPosition || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Experience</label>
                      {isEditing ? (
                        <select
                          name="experience"
                          value={formData.experience || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        >
                          <option value="">Select Experience</option>
                          <option value="fresher">Fresher (0 years)</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {getExperienceLabel(userProfile?.experience) || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Education</label>
                      {isEditing ? (
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <select
                            name="education"
                            value={formData.education || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          >
                            <option value="">Select Education</option>
                            <option value="high-school">High School</option>
                            <option value="diploma">Diploma</option>
                            <option value="bachelors">Bachelor's Degree</option>
                            <option value="masters">Master's Degree</option>
                            <option value="phd">PhD</option>
                          </select>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {getEducationLabel(userProfile?.education) || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Expected Salary</label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            name="expectedSalary"
                            value={formData.expectedSalary || ''}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.expectedSalary ? `${userProfile.expectedSalary} LPA` : 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Preferred Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="preferredLocation"
                          value={formData.preferredLocation || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                          {userProfile?.preferredLocation || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Job Type</label>
                      {isEditing ? (
                        <select
                          name="jobType"
                          value={formData.jobType || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        >
                          <option value="">Select Job Type</option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900 capitalize">
                          {userProfile?.jobType?.replace('-', ' ') || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">Work Mode</label>
                      {isEditing ? (
                        <select
                          name="workMode"
                          value={formData.workMode || ''}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                        >
                          <option value="">Select Work Mode</option>
                          <option value="office">Office</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900 capitalize">
                          {userProfile?.workMode || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Skills</label>
                    {isEditing ? (
                      <textarea
                        name="skills"
                        value={formData.skills || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors resize-none"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-900">
                        {userProfile?.skills || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Services & Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Heart className="text-red-400" size={20} />
                    <span>Preferences</span>
                  </h3>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Interested Services</label>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {userProfile?.interestedServices && userProfile.interestedServices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userProfile.interestedServices.map((service: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            >
                              {service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-900">No services selected</span>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Update Resume</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-update"
                      />
                      <label
                        htmlFor="resume-update"
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 transition-colors"
                      >
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <div className="text-gray-600">
                          {newResume ? (
                            <div className="flex items-center justify-center space-x-2">
                              <FileText className="text-red-400" size={20} />
                              <span className="text-red-600 font-medium">{newResume.name}</span>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium">Click to upload new resume</div>
                              <div className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</div>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;