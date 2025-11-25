// Orders Service Integration
// Proxies subscription/orders requests to the Orders Service

const config = require('../config');
const axios = require('axios');

const ORDERS_SERVICE_BASE = config.services.orders;

const ordersService = {
  // POST /api/development/orders/subscribe - Subscribe to an event
  subscribeToEvent: async (token, eventId) => {
    try {
      const response = await axios.post(
        `${ORDERS_SERVICE_BASE}/api/development/orders/subscribe`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de pedidos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao se inscrever no evento'
      };
    }
  },

  // DELETE /api/development/orders/:eventId - Unsubscribe from an event
  unsubscribeFromEvent: async (token, eventId) => {
    try {
      const response = await axios.delete(
        `${ORDERS_SERVICE_BASE}/api/development/orders/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Handle 204 No Content response
      if (response.status === 204) {
        return { success: true, message: 'Inscrição cancelada com sucesso' };
      }
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de pedidos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao cancelar inscrição'
      };
    }
  },

  // GET /api/development/orders/my-subscriptions - Get user's subscriptions
  getUserSubscriptions: async (token) => {
    try {
      const response = await axios.get(
        `${ORDERS_SERVICE_BASE}/api/development/orders/my-subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw {
          status: 503,
          message: 'Falha ao conectar com a API de pedidos. Tente novamente mais tarde.'
        };
      }
      throw {
        status: error.response.status || 500,
        message: error.response.data?.message || error.response.data?.error || 'Falha ao buscar inscrições'
      };
    }
  }
};

module.exports = ordersService;
