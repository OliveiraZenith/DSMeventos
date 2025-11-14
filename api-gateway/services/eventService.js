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
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch events'
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
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to create event'
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
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch event'
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
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to update event'
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
        return { success: true, message: 'Event deleted successfully' };
      }
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to delete event'
      };
    }
  }
};

module.exports = eventService;
