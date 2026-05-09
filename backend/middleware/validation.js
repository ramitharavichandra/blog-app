const { body, validationResult } = require('express-validator');

// Validation rules for registration
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation rules for login
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for blog
const validateBlog = [
  body('title').trim().notEmpty().withMessage('Blog title is required'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('description').optional().trim(),
  body('category').isIn(['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Other']),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateBlog,
  handleValidationErrors,
};