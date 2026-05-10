const jwt = require('jsonwebtoken');

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
    req.userId = decoded.id || decoded.userId || decoded._id;
    req.userEmail = decoded.email;

    console.log('[authMiddleware] Authenticated request', {
      path: req.path,
      method: req.method,
      userId: req.userId,
    });

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    next();
  } catch (error) {
    console.error('[authMiddleware] Token verification failed:', error.message);
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
