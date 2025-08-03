import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Shield, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleGetStarted = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <img
              src="/company logo.png"
              alt="Drave Capitals Logo"
              className="w-28 h-28 object-contain"
            />
          </motion.div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/login')}
              className="text-gray-700 hover:text-red-600 transition-colors text-sm font-medium"
            >
              Admin Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block py-2 text-gray-700 hover:text-red-600 transition-colors text-left w-full"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/admin/login');
              }}
              className="w-full mt-2 text-gray-700 hover:text-red-600 py-2 text-left"
            >
              Admin Login
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                handleGetStarted();
              }}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-full text-sm font-medium"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;