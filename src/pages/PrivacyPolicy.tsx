import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, FileText, Users, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

// Icon mapping for dynamic content
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Shield,
  Eye,
  Lock,
  FileText,
  Users,
  Database
};

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [privacyData, setPrivacyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPrivacyPolicy();
      if (data && Object.keys(data).length > 0) {
        setPrivacyData(data);
      } else {
        // Fallback to default content if no data found
        setPrivacyData({
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          introduction: 'Drave Digitals ("Company," "we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you use our services — including Job Consultancy, Cybercrime & Digital Forensics, and App Development.\n\nBy using our website and services, you agree to the terms outlined in this Privacy Policy.',
          sections: [
            {
              title: "Information We Collect",
              content: [
                {
                  subtitle: "Personal Information (for job consultancy & client onboarding)",
                  items: [
                    "Full Name",
                    "Contact details (email, phone number, address)",
                    "Date of Birth, Gender",
                    "Resume/CV, qualifications, employment history",
                    "Identification documents (e.g., Aadhaar, PAN, Passport — only when legally required)"
                  ]
                },
                {
                  subtitle: "Cybercrime & Forensics Data",
                  items: [
                    "Digital evidence provided by clients (e.g., screenshots, logs, emails)",
                    "Technical information related to incidents",
                    "Any other data necessary for investigation"
                  ]
                },
                {
                  subtitle: "App Development Information",
                  items: [
                    "Project requirements and specifications",
                    "User analytics for apps we develop",
                    "Client feedback and communication history"
                  ]
                },
                {
                  subtitle: "Automatically Collected Data",
                  items: [
                    "IP address",
                    "Browser type & device information",
                    "Cookies & usage patterns"
                  ]
                }
              ]
            },
            {
              title: "How We Use Your Information",
              content: [
                {
                  subtitle: "",
                  items: [
                    "Job Consultancy: To match candidates with employers, verify credentials, and communicate hiring updates.",
                    "Cybercrime Services: To conduct legal investigations, gather evidence, and provide reports.",
                    "App Development: To deliver, maintain, and improve our applications.",
                    "Legal Compliance: To meet legal obligations under Indian law.",
                    "Customer Support: To respond to queries, complaints, or requests."
                  ]
                }
              ]
            },
            {
              title: "Data Sharing & Disclosure",
              content: [
                {
                  subtitle: "",
                  items: [
                    "We do not sell your personal data. We may share your information with:",
                    "Employers & Recruiters (job consultancy) — only with your consent.",
                    "Law Enforcement Agencies — in cases involving cybercrime or legal compliance.",
                    "Service Providers — for hosting, analytics, or technical support.",
                    "Legal Authorities — if required by court order or government directive."
                  ]
                }
              ]
            },
            {
              title: "Data Retention",
              content: [
                {
                  subtitle: "",
                  items: [
                    "Job consultancy data is retained for up to 2 years unless you request deletion earlier.",
                    "Cybercrime case data is retained as per legal requirements and then securely destroyed.",
                    "App development project data is retained for contract duration + 1 year for support purposes."
                  ]
                }
              ]
            },
            {
              title: "Security Measures",
              content: [
                {
                  subtitle: "",
                  items: [
                    "We implement reasonable security practices, including:",
                    "Encrypted data storage",
                    "Secure communication protocols (HTTPS, SSL)",
                    "Restricted employee access to sensitive data",
                    "Regular security audits",
                    "",
                    "However, no system is 100% secure, and we cannot guarantee absolute security of your data."
                  ]
                }
              ]
            },
            {
              title: "Your Rights",
              content: [
                {
                  subtitle: "",
                  items: [
                    "You have the right to:",
                    "Access and request a copy of your data",
                    "Correct inaccurate information",
                    "Request deletion of your personal data (subject to legal obligations)",
                    "Withdraw consent for data processing (where applicable)",
                    "",
                    "To exercise your rights, contact us using the details in Section 9"
                  ]
                }
              ]
            }
          ],
          contactInfo: {
            email: 'privacy@dravedigitals.com',
            phone: '+91 9876543210',
            address: 'Mumbai, Maharashtra, India'
          }
        });
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch privacy policy:', error);
      setError('Failed to load privacy policy');
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
        <p className="ml-4 text-gray-600">Loading privacy policy...</p>
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

  if (!privacyData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Privacy policy not found</p>
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
              {privacyData.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {privacyData.subtitle}
            </p>
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-white/90 whitespace-pre-line">
                {privacyData.introduction}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {privacyData.sections.map((section: any, index: number) => {
            // Use different icons for different sections
            const sectionIcons = [FileText, Eye, Users, Database, Lock, Shield];
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

          {/* Additional Static Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Eye className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Cookies & Tracking</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We use cookies to enhance user experience, track site usage, and improve services. You may disable cookies in your browser, but this may affect functionality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Third-Party Links</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our website or apps may contain links to third-party sites. We are not responsible for their privacy practices, and you should review their policies separately.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 border border-red-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {privacyData.contactInfo?.email || 'privacy@dravedigitals.com'}</p>
              <p><strong>Phone:</strong> {privacyData.contactInfo?.phone || '+91 9876543210'}</p>
              <p><strong>Address:</strong> {privacyData.contactInfo?.address || 'Mumbai, Maharashtra, India'}</p>
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
              Last updated: {privacyData.lastUpdated ? new Date(privacyData.lastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;