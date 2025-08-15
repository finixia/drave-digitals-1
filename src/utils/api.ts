// API Service for handling all HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  currentPosition?: string;
  experience?: string;
  skills?: string;
  education?: string;
  expectedSalary?: string;
  preferredLocation?: string;
  jobType?: string;
  workMode?: string;
  interestedServices?: string[];
  resume?: string;
  profileCompleted?: boolean;
  createdAt?: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Helper function to get auth headers for form data
const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// API Service
export const apiService = {
  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      // Fallback for demo purposes when backend is not available
      if (email === 'chaitanyapawar410@gmail.com' && password === 'password') {
        return {
          success: true,
          user: {
            _id: '688edd2ad86cba02281147c2',
            name: 'Chaitanya Pawar',
            email: 'chaitanyapawar410@gmail.com',
            phone: '9579279673',
            dateOfBirth: '2001-10-04',
            gender: 'male',
            address: 'fewfsdfgfs',
            city: 'Chhatrapati Sambhajinagar',
            state: 'Maharashtra',
            pincode: '431109',
            currentPosition: 'Software Developer',
            experience: '1-2',
            skills: 'DSA',
            education: 'bachelors',
            expectedSalary: '6',
            preferredLocation: 'Pune',
            jobType: 'full-time',
            workMode: 'office',
            interestedServices: ['job-consultancy'],
            resume: 'uploads/resume-1754133190283-787090974.pdf',
            profileCompleted: true,
            createdAt: '2025-08-03T03:53:14.300Z',
            role: 'user'
          }
        };
      }
      throw error;
    }
  },

  async register(userData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: userData, // FormData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async adminLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // User Profile
  async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      return data.data;
    } catch (error) {
      // Fallback for demo user
      if (userId === '688edd2ad86cba02281147c2') {
        return {
          _id: '688edd2ad86cba02281147c2',
          name: 'Chaitanya Pawar',
          email: 'chaitanyapawar410@gmail.com',
          phone: '9579279673',
          dateOfBirth: '2001-10-04',
          gender: 'male',
          address: 'fewfsdfgfs',
          city: 'Chhatrapati Sambhajinagar',
          state: 'Maharashtra',
          pincode: '431109',
          currentPosition: 'Software Developer',
          experience: '1-2',
          skills: 'DSA',
          education: 'bachelors',
          expectedSalary: '6',
          preferredLocation: 'Pune',
          jobType: 'full-time',
          workMode: 'office',
          interestedServices: ['job-consultancy'],
          resume: 'uploads/resume-1754133190283-787090974.pdf',
          profileCompleted: true,
          createdAt: '2025-08-03T03:53:14.300Z',
          role: 'user'
        };
      }
      throw error;
    }
  },

  async updateUserProfile(userId: string, formData: FormData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeadersForFormData(),
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user profile');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Contact Forms
  async submitContactForm(contactData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getContacts(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Testimonials
  async submitTestimonial(testimonialData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit testimonial');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getTestimonials(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'GET',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Terms of Service
  async getTermsOfService(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/terms-of-service`, {
        method: 'GET',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch terms of service');
      }

      return data.data.content;
    } catch (error) {
      throw error;
    }
  },

  async updateTermsOfService(content: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/terms-of-service`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update terms of service');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Privacy Policy
  async getPrivacyPolicy(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/privacy-policy`, {
        method: 'GET',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch privacy policy');
      }

      return data.data.content;
    } catch (error) {
      throw error;
    }
  },

  async updatePrivacyPolicy(content: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/privacy-policy`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update privacy policy');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};