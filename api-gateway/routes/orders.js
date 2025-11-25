// Orders Routes
// Handles event subscription/registration endpoints

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const config = require('../config');
const ordersService = require('../services/ordersService');
const ordersServiceMock = require('../mocks/services/ordersService');

// Apply auth middleware to all order routes
router.use(authMiddleware);

// POST /api/orders/subscribe - Subscribe to an event
router.post('/subscribe', async (req, res) => {
  try {
    // Use mocks if orders service is not configured
    if (!config.services.orders || config.useMocks) {
      console.log('[MOCK] Using mock data for orders service');
      const { eventId } = req.body;
      const result = ordersServiceMock.subscribeToEvent(req.userId, eventId);
      return res.json(result);
    }

    const { eventId } = req.body;
    const result = await ordersService.subscribeToEvent(req.token, eventId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to subscribe to event'
    });
  }
});

// DELETE /api/orders/:eventId - Unsubscribe from an event
router.delete('/:eventId', async (req, res) => {
  try {
    // Use mocks if orders service is not configured
    if (!config.services.orders || config.useMocks) {
      console.log('[MOCK] Using mock data for orders service');
      const result = ordersServiceMock.unsubscribeFromEvent(req.params.eventId);
      return res.json(result);
    }

    const result = await ordersService.unsubscribeFromEvent(req.token, req.params.eventId);
    // Orders service returns 204, we should too
    if (result.success && result.message === 'Inscrição cancelada com sucesso') {
      return res.status(204).end();
    }
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to unsubscribe from event'
    });
  }
});

// GET /api/orders/my-subscriptions - Get user's subscriptions
router.get('/my-subscriptions', async (req, res) => {
  try {
    // Use mocks if orders service is not configured
    if (!config.services.orders || config.useMocks) {
      console.log('[MOCK] Using mock data for orders service');
      const result = ordersServiceMock.getUserSubscriptions(req.userId);
      return res.json(result);
    }

    const result = await ordersService.getUserSubscriptions(req.token);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to fetch subscriptions'
    });
  }
});

// GET /api/orders/event/:eventId/attendees - Get event attendees (MOCK ONLY)
router.get('/event/:eventId/attendees', async (req, res) => {
  try {
    console.log('[MOCK] Using mock data for orders service');
    const result = ordersServiceMock.getEventAttendees(req.params.eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendees'
    });
  }
});

module.exports = router;
