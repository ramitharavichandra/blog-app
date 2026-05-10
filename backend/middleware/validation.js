const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateBlog = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('description').optional().trim(),
  body('category')
    .optional()
    .isIn(['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Other'])
    .withMessage('Invalid category'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

module.exports = { validateRegister, validateLogin, validateBlog, handleValidationErrors };
