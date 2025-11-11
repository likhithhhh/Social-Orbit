const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { textContent, imageUrl } = req.body;

  if (!textContent && !imageUrl) {
    return res.status(400).json({ message: 'Post must have text or an image' });
  }

  try {
    const newPost = new Post({
      textContent,
      imageUrl,
      user: req.user._id, 
    });
    const post = await newPost.save();
    const populatedPost = await Post.findById(post._id).populate({
      path: 'user',
      select: 'username'
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate({ 
      path: 'user', 
      select: 'username' 
    })
    .sort({ createdAt: -1 });
  res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(userId => !userId.equals(req.user._id));
    } else {
      post.likes.push(req.user._id); 
    }
    
    await post.save();
    res.json(post); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      username: req.user.username, 
    };

    post.comments.push(newComment); 
    await post.save();
    res.status(201).json(post); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};