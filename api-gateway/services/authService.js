// Auth Service Integration
// Proxies authentication requests to the Auth Service

const config = require('../config');
const axios = require('axios');

const AUTH_SERVICE_BASE = config.services.auth;

const authService = {
  // POST /auth/register - Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_BASE}/auth/register`, userData);
      return response.data;
    } catch (error) {
      // Re-throw with proper error structure
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      };
    }
  },
  
  // POST /auth/login - Login and get JWT token
  login: async (credentials) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_BASE}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Login failed'
      };
    }
  },
  
  // GET /users/me - Get user profile (requires token)
  getProfile: async (token) => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch profile'
      };
    }
  },
  
  // PUT /users/me - Update user profile (requires token)
  updateProfile: async (token, userData) => {
    try {
      const response = await axios.put(`${AUTH_SERVICE_BASE}/users/me`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to update profile'
      };
    }
  }
};

module.exports = authService;
