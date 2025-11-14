// Event Routes
// Handles event management endpoints by proxying to Event Service

const express = require('express');
const router = express.Router();
const eventService = require('../services/eventService');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

// GET /api/events - List all events (public, but auth optional)
router.get('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const result = await eventService.getEvents(req.token);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to fetch events'
    });
  }
});

// POST /api/events - Create new event (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const result = await eventService.createEvent(req.token, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
});

// GET /api/events/:id - Get event by ID (public, but auth optional)
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const result = await eventService.getEventById(req.token, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to fetch event'
    });
  }
});

// PUT /api/events/:id - Update event (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await eventService.updateEvent(req.token, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to update event'
    });
  }
});

// DELETE /api/events/:id - Delete event (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await eventService.deleteEvent(req.token, req.params.id);
    // Event service returns 204, we should too
    if (result.success && result.message === 'Event deleted successfully') {
      return res.status(204).end();
    }
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to delete event'
    });
  }
});

module.exports = router;
