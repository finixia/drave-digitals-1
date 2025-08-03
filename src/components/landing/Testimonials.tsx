import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Shield, Briefcase, Code } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    rating: 5,
    text: 'CareerGuard helped me land my dream job in just 2 weeks! Their resume building and interview preparation services are exceptional.',
    avatar: '👩‍💻',
    service: 'Job Consultancy'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    company: 'Kumar Enterprises',
    rating: 5,
    text: 'When I faced cyber fraud, CareerGuard guided me through the entire process. They helped me file the FIR and recover my money.',
    avatar: '👨‍💼',
    service: 'Fraud Assistance'
  },
  {
    name: 'Anita Patel',
    role: 'Digital Marketer',
    company: 'Creative Agency',
    rating: 5,
    text: 'The digital marketing training program transformed my career. Now I run successful campaigns for multiple clients.',
    avatar: '👩‍🎨',
    service: 'Training'
  },
  {
    name: 'Vikram Singh',
    role: 'Startup Founder',
    company: 'InnovateTech',
    rating: 5,
    text: 'Their web development team created an amazing e-commerce platform for my business. Professional and timely delivery!',
    avatar: '👨‍💻',
    service: 'Development'
  },
  {
    name: 'Meera Joshi',
    role: 'HR Manager',
    company: 'Global Corp',
    rating: 5,
    text: 'CareerGuard provided excellent candidates for our IT positions. Their screening process is thorough and reliable.',
    avatar: '👩‍💼',
    service: 'Recruitment'
  },
  {
    name: 'Arjun Reddy',
    role: 'Freelancer',
    company: 'Independent',
    rating: 5,
    text: 'The freelancing skills program helped me build a successful remote career. Earning 6 figures now working from home!',
    avatar: '👨‍🎯',
    service: 'Training'
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full px-4 py-2 text-red-400 text-sm font-medium mb-6"
          >
            <Star size={16} />
            <span>Testimonials</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
           <span className="text-gray-900">Success</span>{' '}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our clients say about 
            their experience with Drave Digitals.
          </p>
        </motion.div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex space-x-6"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-96 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                <Quote className="text-gray-400 mb-4" size={24} />

                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="text-gray-900 font-semibold text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 text-xs font-medium bg-red-400/10 px-2 py-1 rounded-full">
                      {testimonial.service}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-6 bg-white backdrop-blur-xl border border-gray-200 rounded-full px-8 py-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-900 font-semibold">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="text-slate-400">
              Based on 5000+ reviews
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;