import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Shield,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Star,
  Eye,
  EyeOff,
  Save,
  X,
  LogOut,
  BarChart3,
  MessageSquare,
  Settings,
  Award,
  Code,
  FileText,
  Download,
  ExternalLink,
  Edit2,
  Heart,
  Target
} from 'lucide-react';
import { apiService } from '../../utils/api';

interface DashboardStats {
  totalContacts: number;
  totalApplications: number;
  totalFraudCases: number;
  placedJobs: number;
  resolvedFraudCases: number;
  totalUsers: number;
  newsletterSubscribers: number;
  totalTestimonials: number;
  successRate: number;
  happyClients: number;
  growthRate: string;
}

interface EditableStats {
  happyClients: string;
  successRate: string;
  growthRate: string;
}

const OverviewTab = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [editableStats, setEditableStats] = useState<EditableStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStats, setEditingStats] = useState<{[key: string]: boolean}>({});
  const [tempStats, setTempStats] = useState<{[key: string]: string}>({});
  const [savingStats, setSavingStats] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchEditableStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await apiService.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditableStats = async () => {
    try {
      const statsData = await apiService.getDashboardStatsData();
      if (statsData && Object.keys(statsData).length > 0) {
        setEditableStats({
          happyClients: statsData.happyClients || '5000+',
          successRate: statsData.successRate || '98%',
          growthRate: statsData.growthRate || '150%'
        });
      }
    } catch (error) {
      console.error('Failed to fetch editable stats:', error);
      // Set default values
      setEditableStats({
        happyClients: '5000+',
        successRate: '98%',
        growthRate: '150%'
      });
    }
  };

  const handleEditStat = (key: string) => {
    setEditingStats(prev => ({ ...prev, [key]: true }));
    if (editableStats) {
      setTempStats(prev => ({ ...prev, [key]: editableStats[key as keyof EditableStats] }));
    }
  };

  const handleSaveStat = async (key: string) => {
    try {
      setSavingStats(true);
      const updatedStats = {
        ...editableStats,
        [key]: tempStats[key]
      };
      
      await apiService.updateDashboardStats(updatedStats);
      setEditableStats(updatedStats);
      setEditingStats(prev => ({ ...prev, [key]: false }));
      
      // Clear temp stats
      setTempStats(prev => {
        const newStats = { ...prev };
        delete newStats[key];
        return newStats;
      });
    } catch (error) {
      console.error('Failed to update stat:', error);
      alert('Failed to update statistic. Please try again.');
    } finally {
      setSavingStats(false);
    }
  };

  const handleCancelEdit = (key: string) => {
    setEditingStats(prev => ({ ...prev, [key]: false }));
    setTempStats(prev => {
      const newStats = { ...prev };
      delete newStats[key];
      return newStats;
    });
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

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Contacts', value: stats.totalContacts, icon: Mail, color: 'text-blue-400', key: 'totalContacts', editable: false },
          { label: 'Job Applications', value: stats.totalApplications, icon: Briefcase, color: 'text-green-400', key: 'totalApplications', editable: false },
          { label: 'Fraud Cases', value: stats.totalFraudCases, icon: Shield, color: 'text-red-400', key: 'totalFraudCases', editable: false },
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', key: 'totalUsers', editable: false },
          { label: 'Happy Clients', value: editableStats?.happyClients || '5000+', icon: Heart, color: 'text-green-400', key: 'happyClients', editable: true },
          { label: 'Success Rate', value: editableStats?.successRate || '98%', icon: TrendingUp, color: 'text-purple-400', key: 'successRate', editable: true },
          { label: 'Growth Rate', value: editableStats?.growthRate || '150%', icon: Award, color: 'text-orange-400', key: 'growthRate', editable: true }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4 relative">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
              <stat.icon className={stat.color} size={32} />
              {stat.editable && (
                <Edit 
                  className="text-gray-400 cursor-pointer hover:text-gray-600" 
                  size={16}
                  onClick={() => handleEditStat(stat.key)}
                />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {editingStats[stat.key] ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempStats[stat.key] || ''}
                    onChange={(e) => setTempStats(prev => ({ ...prev, [stat.key]: e.target.value }))}
                    className="text-lg border border-gray-300 rounded px-2 py-1 w-24"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveStat(stat.key)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleCancelEdit(stat.key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                stat.value
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;