// Authentication Middleware
// Validates JWT tokens using the shared secret with Auth Service

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to validate JWT tokens
 * Extracts token from Authorization header and verifies it
 * Attaches userId and token to request object for downstream use
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    // Verify token with the same secret as Auth Service
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Attach user info and token to request for use in routes
    req.userId = decoded.userId || decoded.id || decoded.sub;
    req.token = token;
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional auth middleware
 * Validates token if present, but allows request to proceed if not
 * Useful for routes that work with or without authentication
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, but that's ok for optional auth
      return next();
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret);
    
    req.userId = decoded.userId || decoded.id || decoded.sub;
    req.token = token;
    
    next();
  } catch (error) {
    // Token is invalid, but we allow the request to proceed
    // The route handler can decide what to do
    next();
  }
};

module.exports = { authMiddleware, optionalAuthMiddleware };
