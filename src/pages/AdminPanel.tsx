import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route 
        path="/dashboard" 
        element={
          user && user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminPanel;