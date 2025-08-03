import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setSubmitStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await apiService.subscribeNewsletter(email);
      setSubmitStatus('success');
      setStatusMessage("Thank you for subscribing! We'll keep you updated with the latest opportunities.");
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = {
    'Services': [
      'Cyber Crime Fraud Assistance',
      'Job Consultancy Services',
      'Web & App Development',
      'Digital Marketing',
      'Training & Certification'
    ],
    'Quick Links': [
      'About Us',
      'Our Team',
      'Success Stories',
      'Blog',
      'Career Opportunities'
    ],
    'Support': [
      'Help Center',
      'Contact Support',
      'Privacy Policy',
      'Terms of Service',
      'FAQ'
    ],
    'Resources': [
      'Job Portal',
      'Fraud Awareness',
      'Career Guide',
      'Skill Assessment',
      'Industry Reports'
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-500' },
    { icon: Youtube, href: '#', color: 'hover:text-red-400' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px">
        {/* Logo at the Top */}
        <div className="flex justify-start mb-10">

          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src="/company logo.png"
              alt="Drave Capitals Logo"
              className="w-28 h-28 object-contain"
            />
          </motion.div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your trusted partner for career growth and digital protection.
              We provide comprehensive solutions from job placements to
              cybersecurity awareness.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">info@careerguard.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">Mumbai, Maharashtra</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-gray-900 font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-gray-600 hover:text-red-600 transition-all text-sm"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-12"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Career Opportunities
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest job openings,
              fraud alerts, and career tips.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-400 focus:outline-none"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className={`bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
              </form>
            </div>

            {submitStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl flex items-center justify-center space-x-3 max-w-md mx-auto ${
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
                <span className="text-sm text-center">{statusMessage}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 Drave Digitals. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-gray-600 text-sm">
              <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-red-600 transition-all">
                Privacy Policy
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-red-600 transition-all">
                Terms of Service
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }} className="hover:text-red-600 transition-all">
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
