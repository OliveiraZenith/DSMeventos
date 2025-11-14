// Orders Routes (using mocks)
// Handles event subscription/registration endpoints
// Currently using mocks until real Orders Service is configured

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const ordersServiceMock = require('../mocks/services/ordersService');

// Apply auth middleware to all order routes
router.use(authMiddleware);

// POST /api/orders/subscribe - Subscribe to an event
router.post('/subscribe', async (req, res) => {
  try {
    console.log('[MOCK] Using mock data for orders service');
    const { eventId } = req.body;
    const result = ordersServiceMock.subscribeToEvent(req.userId, eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to event'
    });
  }
});

// DELETE /api/orders/subscribe/:id - Unsubscribe from an event
router.delete('/subscribe/:id', async (req, res) => {
  try {
    console.log('[MOCK] Using mock data for orders service');
    const result = ordersServiceMock.unsubscribeFromEvent(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from event'
    });
  }
});

// GET /api/orders/my-subscriptions - Get user's subscriptions
router.get('/my-subscriptions', async (req, res) => {
  try {
    console.log('[MOCK] Using mock data for orders service');
    const result = ordersServiceMock.getUserSubscriptions(req.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
});

// GET /api/orders/event/:eventId/attendees - Get event attendees
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
