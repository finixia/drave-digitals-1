const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  // User profile endpoints
  getUserProfile: async (userId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user profile');
    }
    
    return response.json();
  },

  updateUserProfile: async (userId: string, formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    
    return response.json();
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard-stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return response.json();
  },

  // Admin endpoints
  adminLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Admin login failed');
    }
    
    return response.json();
  },

  // Contact form
  submitContact: async (contactData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit contact form');
    }
    
    return response.json();
  },

  // Testimonials
  getTestimonials: async () => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    
    return response.json();
  },

  submitTestimonial: async (testimonialData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit testimonial');
    }
    
    return response.json();
  },

  // Terms of Service
  getTermsOfService: async () => {
    const response = await fetch(`${API_BASE_URL}/api/terms-of-service`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch terms of service');
    }
    
    return response.json();
  },

  // Privacy Policy
  getPrivacyPolicy: async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch privacy policy');
    }
    
    return response.json();
  },
};