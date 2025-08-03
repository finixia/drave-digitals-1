import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../../utils/api';

const Hero = () => {
  const [heroContent, setHeroContent] = React.useState({
    title: 'Your Professional Success Partner',
    subtitle: 'From landing your dream job to protecting against cyber fraud, we provide comprehensive career solutions and digital security services that empower your professional journey.',
    stats: [
      { label: 'Happy Clients', value: '5000+' },
      { label: 'Success Rate', value: '98%' },
      { label: 'Support', value: '24/7' }
    ]
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await apiService.getWebsiteContent();
        if (content.hero) {
          setHeroContent(content.hero);
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error);
      }
    };
    fetchContent();
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-red-50">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Review Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-32 right-8 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center hidden lg:block shadow-lg"
      >
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-red-400 fill-current" />
          ))}
        </div>
        <div className="text-gray-900 font-semibold text-lg">4.9</div>
        <div className="text-gray-600 text-sm">Client Rating</div>
        <div className="text-gray-500 text-xs">5000+ reviews</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-48 left-8 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center hidden lg:block shadow-lg"
      >
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-red-400 fill-current" />
          ))}
        </div>
        <div className="text-gray-900 font-semibold text-lg">98%</div>
        <div className="text-gray-600 text-sm">Success Rate</div>
        <div className="text-gray-500 text-xs">Job Placements</div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
        >
          {heroContent.title.split(' ').slice(0, 2).join(' ')}{' '}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            {heroContent.title.split(' ')[2]}
          </span>
          <br />
          <span className="text-4xl md:text-5xl font-light">
            {heroContent.title.split(' ').slice(3).join(' ')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToServices} 
            className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:border-red-400 transition-all inline-flex items-center space-x-2"
          >
            <Play size={20} />
            <span>Explore Services</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {heroContent.stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-red-400 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        onClick={scrollToServices}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer hover:border-red-400 transition-colors">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;