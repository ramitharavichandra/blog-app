const jwt = require('jsonwebtoken');
const MONGODB_OBJECTID_PATTERN = /^[0-9a-fA-F]{24}$/;

// Verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !MONGODB_OBJECTID_PATTERN.test(decoded.id)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[authMiddleware] Authenticated request', {
        path: req.path,
        method: req.method,
        userId: req.userId,
      });
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[authMiddleware] Token verification failed:', error.message);
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = authMiddleware;
