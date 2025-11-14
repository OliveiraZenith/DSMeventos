// Event Service Integration
// Proxies event management requests to the Event Service

const config = require('../config');
const axios = require('axios');

const EVENT_SERVICE_BASE = config.services.events;

const eventService = {
  // GET /events - List all events
  getEvents: async (token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${EVENT_SERVICE_BASE}/events`, { headers });
      return response.data;
    } catch (error) {
      // Check if it's a network/connection error (no response from service)
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de eventos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao conectar com a API de eventos'
      };
    }
  },
  
  // POST /events - Create new event
  createEvent: async (token, eventData) => {
    try {
      const response = await axios.post(`${EVENT_SERVICE_BASE}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de eventos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao criar evento'
      };
    }
  },
  
  // GET /events/:id - Get event by ID
  getEventById: async (token, eventId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${EVENT_SERVICE_BASE}/events/${eventId}`, { headers });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de eventos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao buscar evento'
      };
    }
  },
  
  // PUT /events/:id - Update event
  updateEvent: async (token, eventId, eventData) => {
    try {
      const response = await axios.put(`${EVENT_SERVICE_BASE}/events/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de eventos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao atualizar evento'
      };
    }
  },
  
  // DELETE /events/:id - Delete event
  deleteEvent: async (token, eventId) => {
    try {
      const response = await axios.delete(`${EVENT_SERVICE_BASE}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Event service returns 204 No Content on successful delete
      if (response.status === 204) {
        return { success: true, message: 'Evento excluído com sucesso' };
      }
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de eventos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao excluir evento'
      };
    }
  }
};

module.exports = eventService;
