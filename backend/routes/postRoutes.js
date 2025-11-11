const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, likePost, commentOnPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// public route
router.get('/', getAllPosts); // This is the feed [cite: 43]

// protected routes (user must be logged in)
router.post('/', protect, createPost); // [cite: 39]
router.put('/:id/like', protect, likePost); // [cite: 46]
router.post('/:id/comment', protect, commentOnPost); // [cite: 46]

module.exports = router;