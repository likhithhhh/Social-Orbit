const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  const { textContent, imageUrl } = req.body;

  // Check that at least one field is present [cite: 42]
  if (!textContent && !imageUrl) {
    return res.status(400).json({ message: 'Post must have text or an image' });
  }

  try {
    const newPost = new Post({
      textContent,
      imageUrl,
      user: req.user._id, // from authMiddleware
    });
    const post = await newPost.save();
    // We must populate the user field *before* sending it back
    const populatedPost = await Post.findById(post._id).populate({
      path: 'user',
      select: 'username'
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (the feed)
// @route   GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    // Use this object-based populate, it's more explicit
    .populate({ 
      path: 'user', 
      select: 'username' // Make sure we ONLY get the username
    })
    .sort({ createdAt: -1 });
  res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user._id)) {
      // User has already liked, so remove the like (unlike)
      post.likes = post.likes.filter(userId => !userId.equals(req.user._id));
    } else {
      // User has not liked, so add the like
      post.likes.push(req.user._id); // [cite: 46]
    }
    
    await post.save();
    res.json(post); // Send back the updated post
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
exports.commentOnPost = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: text,
      user: req.user._id,
      username: req.user.username, // [cite: 48]
    };

    post.comments.push(newComment); // [cite: 46]
    await post.save();
    res.status(201).json(post); // Send back the updated post
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};