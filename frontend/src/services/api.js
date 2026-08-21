import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roomease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const propertyAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getOwnerProperties: () => api.get('/properties/my-properties'),
};

export const roomAPI = {
  addRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

export const applicationAPI = {
  createApplication: (data) => api.post('/applications', data),
  getApplications: () => api.get('/applications'),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export const favoriteAPI = {
  toggleFavorite: (propertyId) => api.post('/favorites', { propertyId }),
  getFavorites: () => api.get('/favorites'),
};

export const reviewAPI = {
  addReview: (data) => api.post('/reviews', data),
  getPropertyReviews: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  verifyProperty: (id, data) => api.put(`/admin/properties/${id}/verify`, data),
};

export const reportAPI = {
  reportProperty: (data) => api.post('/reports', data),
  getReports: () => api.get('/reports'),
  resolveReport: (id) => api.put(`/reports/${id}/resolve`),
};

export const verificationAPI = {
  submitVerification: (data) => api.post('/verifications', data),
  getVerifications: () => api.get('/verifications'),
  handleVerification: (id, status) => api.put(`/verifications/${id}`, { status }),
};

// AI Microservice Calls
export const aiAPI = {
  getRecommendations: (userPreferences, properties) =>
    axios.post(`${AI_SERVICE_URL}/recommend`, { userPreferences, properties }),
  parseNaturalSearch: (query) =>
    axios.post(`${AI_SERVICE_URL}/parse-search`, { query }),
};

export default api;
