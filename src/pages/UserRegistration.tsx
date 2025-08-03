import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

interface RegistrationFormData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  
  // Personal Details
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Professional Details
  currentPosition: string;
  experience: string;
  skills: string;
  education: string;
  expectedSalary: string;
  preferredLocation: string;
  
  // Documents
  resume: File | null;
  
  // Preferences
  jobType: string;
  workMode: string;
  interestedServices: string[];
}

const UserRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    currentPosition: '',
    experience: '',
    skills: '',
    education: '',
    expectedSalary: '',
    preferredLocation: '',
    resume: null,
    jobType: '',
    workMode: '',
    interestedServices: []
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [resumePreview, setResumePreview] = useState<string>('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(service)
        ? prev.interestedServices.filter(s => s !== service)
        : [...prev.interestedServices, service]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size should be less than 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      setResumePreview(file.name);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.password && formData.confirmPassword && formData.phone);
      case 2:
        return !!(formData.dateOfBirth && formData.gender && formData.address && formData.city && formData.state);
      case 3:
        return !!(formData.experience && formData.education && formData.skills);
      case 4:
        return formData.interestedServices.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        setSubmitStatus('error');
        setStatusMessage('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setSubmitStatus('error');
        setStatusMessage('Password must be at least 6 characters long');
        return;
      }
    }
    
    if (validateStep(currentStep)) {
      setSubmitStatus('idle');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setSubmitStatus('error');
      setStatusMessage('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      setSubmitStatus('error');
      setStatusMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const registrationData = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'resume' && value instanceof File) {
          registrationData.append('resume', value);
        } else if (key === 'interestedServices') {
          registrationData.append('interestedServices', JSON.stringify(value));
        } else if (value !== null && value !== '') {
          registrationData.append(key, value.toString());
        }
      });

      const response = await apiService.registerWithDetails(registrationData);
      
      if (response.user) {
        login(response.user);
        setSubmitStatus('success');
        setStatusMessage('Registration successful! Welcome to Drave Digitals.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h3>
            
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="State"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="PIN Code"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Details</h3>
            
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Current Position</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="e.g., Software Developer, Student, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Experience *</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select Experience</option>
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Education *</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select Education</option>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Skills *</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors resize-none"
                placeholder="List your key skills (e.g., JavaScript, Python, Digital Marketing, etc.)"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Expected Salary</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                    placeholder="e.g., 5-8 LPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Preferred Location</label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="e.g., Bangalore, Remote, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
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
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Work Mode</label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-red-400 focus:outline-none transition-colors"
                >
                  <option value="">Select Work Mode</option>
                  <option value="office">Office</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Upload Resume</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 transition-colors"
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <div className="text-gray-600">
                    {resumePreview ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="text-red-400" size={20} />
                        <span className="text-red-600 font-medium">{resumePreview}</span>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium">Click to upload resume</div>
                        <div className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Preferences</h3>
            
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-4">
                Which services are you interested in? *
              </label>
              <div className="space-y-3">
                {[
                  { id: 'job-consultancy', label: 'Job Consultancy Services', desc: 'Career guidance and job placements' },
                  { id: 'fraud-assistance', label: 'Cyber Crime Fraud Assistance', desc: 'Protection against cyber fraud' },
                  { id: 'web-development', label: 'Web & App Development', desc: 'Custom digital solutions' },
                  { id: 'digital-marketing', label: 'Digital Marketing', desc: 'Online marketing services' },
                  { id: 'training', label: 'Training & Certification', desc: 'Skill development programs' }
                ].map((service) => (
                  <motion.label
                    key={service.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-400 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interestedServices.includes(service.id)}
                      onChange={() => handleCheckboxChange(service.id)}
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{service.label}</div>
                      <div className="text-sm text-gray-600">{service.desc}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4"
            >
              <img 
                src="/company logo.png" 
                alt="Drave Capitals Logo" 
                className="w-16 h-16 object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Drave Digitals and unlock your career potential</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
            {renderStep()}

            {/* Status Message */}
            {submitStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl flex items-center space-x-3 ${
                  submitStatus === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="text-sm">{statusMessage}</span>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </motion.button>

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              )}
            </div>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <button 
              onClick={() => navigate('/login')}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Sign in here
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserRegistration;