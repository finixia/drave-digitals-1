import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, Shield, Users, AlertTriangle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

const TermsOfService = () => {
  const navigate = useNavigate();
  const [termsData, setTermsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTermsOfService();
  }, []);

  const fetchTermsOfService = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTermsOfService();
      if (data && Object.keys(data).length > 0) {
        setTermsData(data);
      } else {
        // Fallback to default content if no data found
        setTermsData({
          title: 'Terms of Service',
          subtitle: 'Legal Terms and Conditions',
          introduction: 'Welcome to Drave Digitals. By accessing or using our website, products, and services, you agree to comply with and be bound by these Terms and Conditions.',
          sections: [
            {
              title: "Scope of Services",
              content: [
                {
                  subtitle: "Job Consultancy Services",
                  items: [
                    "We assist candidates in connecting with potential employers.",
                    "We do not guarantee employment; final hiring decisions are made solely by the employer.",
                    "Candidates are responsible for providing accurate and truthful information."
                  ]
                },
                {
                  subtitle: "Cybercrime & Digital Forensics",
                  items: [
                    "We provide digital investigation and cybercrime consultation services.",
                    "All investigations are conducted with proper client consent and in compliance with applicable laws.",
                    "We do not engage in illegal hacking or unauthorized access."
                  ]
                }
              ]
            },
            {
              title: "User Responsibilities",
              content: [
                {
                  subtitle: "",
                  items: [
                    "Provide accurate, complete, and updated information when requested.",
                    "Use our services only for lawful purposes.",
                    "Avoid engaging in fraud, misrepresentation, or harassment."
                  ]
                }
              ]
            },
            {
              title: "Payments & Fees",
              content: [
                {
                  subtitle: "",
                  items: [
                    "Service fees are communicated before commencement of work.",
                    "All payments are non-refundable unless otherwise stated in writing.",
                    "Fees do not constitute a placement guarantee."
                  ]
                }
              ]
            }
          ],
          contactInfo: {
            email: 'legal@dravedigitals.com',
            phone: '+91 9876543210',
            address: 'Mumbai, Maharashtra, India'
          }
        });
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch terms of service:', error);
      setError('Failed to load terms of service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600">Loading terms of service...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!termsData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Terms of service not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const sectionIcons = [FileText, Users, Shield, Scale, Lock, Shield, AlertTriangle, AlertTriangle, Scale, Scale, FileText];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {termsData.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {termsData.subtitle}
            </p>
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-white/90 whitespace-pre-line">
                {termsData.introduction}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {termsData.sections.map((section: any, index: number) => {
            const IconComponent = sectionIcons[index % sectionIcons.length];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {index + 1}. {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((subsection: any, subIndex: number) => (
                    <div key={subIndex}>
                      {subsection.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {subsection.subtitle}
                        </h3>
                      )}
                      <ul className="space-y-2">
                        {subsection.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            {item.trim() && (
                              <>
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                              </>
                            )}
                            {!item.trim() && <div className="h-2" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border border-red-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For any queries, complaints, or clarifications regarding these Terms, contact:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {termsData.contactInfo?.email || 'legal@dravedigitals.com'}</p>
              <p><strong>Phone:</strong> {termsData.contactInfo?.phone || '+91 9876543210'}</p>
              <p><strong>Address:</strong> {termsData.contactInfo?.address || 'Mumbai, Maharashtra, India'}</p>
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500 text-sm">
              Last updated: {termsData.lastUpdated ? new Date(termsData.lastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;