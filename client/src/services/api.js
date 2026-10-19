import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vm_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for handling 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('vm_admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const portfolioAPI = {
  // Public Data
  getProfile: () => api.get('/profile'),
  getSkills: (category) => api.get('/skills', { params: { category } }),
  getServices: () => api.get('/services'),
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),
  getProjects: (params) => api.get('/projects', { params }),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),
  getTemplates: (params) => api.get('/templates', { params }),
  getTemplateBySlug: (slug) => api.get(`/templates/${slug}`),
  getTestimonials: () => api.get('/testimonials'),
  submitTestimonial: (data) => api.post('/testimonials', data),
  submitEnquiry: (data) => api.post('/enquiries', data),
  sendOtp: (data) => api.post('/enquiries/send-otp', data),
  verifyOtp: (data) => api.post('/enquiries/verify-otp', data),

  // Admin Auth
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  setupAdmin: (data) => api.post('/auth/setup-admin', data),

  // Admin Profile & Settings
  updateProfile: (data) => api.put('/profile', data),
  updateSettings: (data) => api.put('/profile/settings', data),

  // Admin Services
  getServicesAdmin: () => api.get('/services/admin/all'),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Admin Projects
  getProjectsAdmin: () => api.get('/projects/admin/all'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Admin Templates
  getTemplatesAdmin: () => api.get('/templates/admin/all'),
  createTemplate: (data) => api.post('/templates', data),
  updateTemplate: (id, data) => api.put(`/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/templates/${id}`),

  // Admin Skills
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  // Admin Testimonials
  getTestimonialsAdmin: () => api.get('/testimonials/admin/all'),
  createTestimonialAdmin: (data) => api.post('/testimonials/admin/create', data),
  toggleTestimonialApproval: (id) => api.patch(`/testimonials/${id}/toggle-approval`),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Admin Enquiries
  getEnquiries: (params) => api.get('/enquiries', { params }),
  getEnquiryStats: () => api.get('/enquiries/stats'),
  getEnquiryById: (id) => api.get(`/enquiries/${id}`),
  updateEnquiryStatus: (id, data) => api.patch(`/enquiries/${id}/status`, data),
  deleteEnquiry: (id) => api.delete(`/enquiries/${id}`),

  // Upload
  uploadMedia: (formData) => api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
