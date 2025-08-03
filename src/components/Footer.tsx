import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';

const Logo = () => (
  <div className="w-10 h-10">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4.5M3 10h18m-5 9h6m-3-3l3 3l-3 3M7.005 15h.005M11 15h2"/>
    </svg>
  </div>
);

const Footer = () => {
  const footerLinks = {
    'Send money': [
      'Send money online',
      'Send money to India',
      'Send money to Philippines',
      'Send money to Mexico',
      'Send money to Pakistan'
    ],
    'Receive money': [
      'Receive money online',
      'Get account details',
      'Multi-currency account',
      'Large amount transfers',
      'International wire'
    ],
    'FlowPay card': [
      'Debit card',
      'Card for travel',
      'Card for business',
      'ATM withdrawals',
      'Card fees'
    ],
    'Company': [
      'About us',
      'Careers',
      'News',
      'Mission',
      'Investor relations'
    ]
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Logo />
              <span className="text-white font-semibold text-xl">FlowPay</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Making money without borders the new normal. 
              We're building the best way to move and manage 
              the world's money.
            </p>
            <div className="flex items-center space-x-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-lime-400 hover:bg-slate-700 transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-slate-400">
                <Globe size={16} />
                <select className="bg-transparent text-slate-400 text-sm focus:outline-none">
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </div>
              <div className="text-slate-400 text-sm">
                © 2024 FlowPay
              </div>
            </div>

            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of use
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;