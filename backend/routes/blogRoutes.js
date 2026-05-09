const express = require('express');
const blogController = require('../controllers/blogController');
const { validateBlog, handleValidationErrors } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', authMiddleware, validateBlog, handleValidationErrors, blogController.createBlog);
router.get('/user/my-blogs', authMiddleware, blogController.getUserBlogs);
router.put('/:id', authMiddleware, validateBlog, handleValidationErrors, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.post('/:id/like', authMiddleware, blogController.likeBlog);
router.post('/:id/comment', authMiddleware, blogController.addComment);

module.exports = router;