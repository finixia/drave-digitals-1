const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Helper function to create headers with auth
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for FormData requests
const getAuthHeadersForFormData = () => {
  const token = getAuthToken();
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface TestimonialData {
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
  service: string;
  featured?: boolean;
  approved?: boolean;
}

export interface ServiceData {
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  active: boolean;
  order: number;
}

export interface AboutContentData {
  title: string;
  subtitle: string;
  description: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  commitments: string[];
  active: boolean;
}

export interface ContactInfoData {
  phone: string[];
  email: string[];
  address: string[];
  workingHours: string[];
}

export interface PrivacyPolicyData {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: Array<{
      subtitle?: string;
      items: string[];
    }>;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  active: boolean;
}

export interface TermsOfServiceData {
  title: string;
  subtitle: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: Array<{
      subtitle?: string;
      items: string[];
    }>;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  active: boolean;
}

export const apiService = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in user data
    if (data.token) {
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('user', JSON.stringify(userWithToken));
    }
    
    return data;
  },

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  async registerWithDetails(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const data = await response.json();
    
    // Store token in user data
    if (data.token) {
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem('user', JSON.stringify(userWithToken));
    }
    
    return data;
  },

  // User Profile
  async getUserProfile(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user profile');
    }
    
    return response.json();
  },

  async updateUserProfile(userId: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeadersForFormData(),
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user profile');
    }
    
    return response.json();
  },

  // Users (Admin)
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    
    return response.json();
  },

  // Contact
  async submitContact(contactData: ContactFormData) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit contact form');
    }
    
    return response.json();
  },

  async getContacts() {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch contacts');
    }
    
    return response.json();
  },

  // Newsletter
  async subscribeNewsletter(email: string) {
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe to newsletter');
    }
    
    return response.json();
  },

  // Testimonials
  async getTestimonials() {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch testimonials');
    }
    
    return response.json();
  },

  async submitTestimonial(testimonialData: TestimonialData) {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonialData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit testimonial');
    }
    
    return response.json();
  },

  async getTestimonialsAdmin() {
    const response = await fetch(`${API_BASE_URL}/testimonials/admin`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch testimonials');
    }
    
    return response.json();
  },

  async createTestimonial(testimonialData: TestimonialData) {
    const response = await fetch(`${API_BASE_URL}/testimonials/admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(testimonialData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create testimonial');
    }
    
    return response.json();
  },

  async updateTestimonial(id: string, testimonialData: TestimonialData) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(testimonialData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update testimonial');
    }
    
    return response.json();
  },

  async deleteTestimonial(id: string) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete testimonial');
    }
    
    return response.json();
  },

  // Services
  async getServices() {
    const response = await fetch(`${API_BASE_URL}/services`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch services');
    }
    
    return response.json();
  },

  async getServicesAdmin() {
    const response = await fetch(`${API_BASE_URL}/services/admin`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch services');
    }
    
    return response.json();
  },

  async createService(serviceData: ServiceData) {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(serviceData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create service');
    }
    
    return response.json();
  },

  async updateService(id: string, serviceData: ServiceData) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(serviceData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update service');
    }
    
    return response.json();
  },

  async deleteService(id: string) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete service');
    }
    
    return response.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
    
    return response.json();
  },

  async getDashboardStatsData() {
    const response = await fetch(`${API_BASE_URL}/dashboard-stats`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch dashboard stats data');
    }
    
    return response.json();
  },

  async updateDashboardStats(statsData: any) {
    const response = await fetch(`${API_BASE_URL}/dashboard-stats`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statsData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update dashboard stats');
    }
    
    return response.json();
  },

  // About Content
  async getAboutContent() {
    const response = await fetch(`${API_BASE_URL}/about-content`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch about content');
    }
    
    return response.json();
  },

  async updateAboutContent(aboutData: AboutContentData) {
    const response = await fetch(`${API_BASE_URL}/about-content`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(aboutData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update about content');
    }
    
    return response.json();
  },

  // Contact Info
  async getContactInfo() {
    const response = await fetch(`${API_BASE_URL}/contact-info`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch contact info');
    }
    
    return response.json();
  },

  async updateContactInfo(contactData: ContactInfoData) {
    const response = await fetch(`${API_BASE_URL}/contact-info`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update contact info');
    }
    
    return response.json();
  },

  // Privacy Policy
  async getPrivacyPolicy() {
    const response = await fetch(`${API_BASE_URL}/privacy-policy`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch privacy policy');
    }
    
    return response.json();
  },

  async updatePrivacyPolicy(privacyData: PrivacyPolicyData) {
    const response = await fetch(`${API_BASE_URL}/privacy-policy`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(privacyData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update privacy policy');
    }
    
    return response.json();
  },

  // Terms of Service
  async getTermsOfService() {
    const response = await fetch(`${API_BASE_URL}/terms-of-service`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch terms of service');
    }
    
    return response.json();
  },

  async updateTermsOfService(termsData: TermsOfServiceData) {
    const response = await fetch(`${API_BASE_URL}/terms-of-service`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(termsData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update terms of service');
    }
    
    return response.json();
  }
};