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
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de autenticação. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao registrar usuário'
      };
    }
  },
  
  // POST /auth/login - Login and get JWT token
  login: async (credentials) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_BASE}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de autenticação. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao fazer login'
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
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de autenticação. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao buscar perfil'
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
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de autenticação. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao atualizar perfil'
      };
    }
  }
};

module.exports = authService;
