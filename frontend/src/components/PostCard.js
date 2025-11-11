import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  Collapse,
  InputAdornment // NEW: For the copy button icon
} from '@mui/material';
import {
  Favorite as FavoriteIcon, // The filled-in heart
  FavoriteBorder as FavoriteBorderIcon, // The outline heart
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Link as LinkIcon // NEW: Icon for the text field
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const PostCard = ({ post, setPosts }) => {
  const { user } = useAuth(); // Get the current logged-in user
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false); // To show/hide comment box
  const [commentLoading, setCommentLoading] = useState(false);
  
  // --- NEW STATE FOR COPYING ---
  const [showCopy, setShowCopy] = useState(false); // Toggles the copy UI
  const [copied, setCopied] = useState(false); // Gives user "Copied!" feedback
  // ------------------------------

  // Check if the current user has already liked this post
  const isLiked = post.likes.includes(user._id);

  // --- Instant Like/Unlike ---
  const handleLike = async () => {
    // 1. Optimistic UI Update (Instant)
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== user._id) // Unlike
                : [...p.likes, user._id], // Like
            }
          : p
      )
    );

    // 2. API Call (in background)
    try {
      await api.likePost(post._id);
    } catch (err) {
      console.error('Failed to like post:', err);
      // If API fails, roll back the UI change
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === post._id ? post : p))
      );
    }
  };

  // --- Handle Comment ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      // Call the API
      const { data: updatedPost } = await api.commentOnPost(post._id, {
        text: commentText,
      });

      // Update the state with the new post data from the API
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === post._id ? updatedPost : p))
      );
      
      // Clear the input
      setCommentText('');
      setIsCommenting(true); // Keep comment section open
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };
  
  // --- NEW FUNCTION TO HANDLE COPY ---
  const handleCopy = () => {
    if (!post.imageUrl) return; // Don't do anything if there's no image

    // Create a temporary textarea element to copy from
    const textArea = document.createElement('textarea');
    textArea.value = post.imageUrl;
    textArea.style.position = 'fixed'; // Make it invisible
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select(); // Select the text
    
    try {
      // Execute the copy command
      document.execCommand('copy');
      setCopied(true); // Set feedback to "Copied!"
      
      // Reset the feedback after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {
      console.error('Failed to copy image URL:', err);
    }
    
    // Remove the temporary element
    document.body.removeChild(textArea);
  };
  // ---------------------------------

  return (
    <motion.div
      whileHover={{ scale: 1.015, zIndex: 1, boxShadow: "0px 10px 20px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.2 }}
    >
      <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }} elevation={2}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {post.user?.username ? post.user.username[0].toUpperCase() : '?'}
            </Avatar>
          }
          title={<Typography variant="h6" sx={{fontWeight: 'bold'}}>{post.user?.username || 'Unknown User'}</Typography>}
          subheader={new Date(post.createdAt).toLocaleString()}
        />

        {/* This handles posts with no image, like in your screenshot */}
        {post.textContent && (
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              {post.textContent}
            </Typography>
          </CardContent>
        )}

        {/* This handles posts *with* an image */}
        {post.imageUrl && (
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt="Post image"
            sx={{ maxHeight: 500, objectFit: 'cover' }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, pb: 0 }}>
          <Typography variant="body2" color="textSecondary">
            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, mt: 1 }} />

        <CardActions sx={{ justifyContent: 'space-around', p: 1 }}>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              size="large"
              startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleLike}
              color={isLiked ? "error" : "inherit"}
              sx={{ borderRadius: 2, flex: 1, color: isLiked ? 'red' : 'inherit' }}
            >
              Like
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              size="large"
              startIcon={<CommentIcon />}
              onClick={() => setIsCommenting(!isCommenting)}
              sx={{ borderRadius: 2, flex: 1 }}
            >
              Comment
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.9 }}>
            {/* NEW: Updated onClick handler for the Share button */}
            <Button 
              size="large" 
              startIcon={<ShareIcon />} 
              sx={{ borderRadius: 2, flex: 1 }}
              onClick={() => setShowCopy(!showCopy)} // Toggles the copy UI
            >
              Share
            </Button>
          </motion.div>
        </CardActions>
        
        {/* --- NEW COLLAPSE BLOCK FOR COPYING --- */}
        <Collapse in={showCopy} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2, pt: 0 }}>
            <TextField
              fullWidth
              disabled={!post.imageUrl} // Disable if no image
              label="Image Link"
              value={post.imageUrl || "This post has no image to copy."}
              size="small"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleCopy}
                      disabled={!post.imageUrl} // Disable button if no image
                      size="small"
                      variant="contained"
                      disableElevation
                      color={copied ? "success" : "primary"} // Change color on copy
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Collapse>
        {/* ------------------------------------- */}


        <Collapse in={isCommenting} timeout="auto" unmountOnExit>
          <Divider sx={{ mx: 2 }} />
          <Box sx={{ p: 2 }}>
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ ml: 1 }} disabled={commentLoading}>
                {commentLoading ? <CircularProgress size={20} /> : 'Post'}
              </Button>
            </Box>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {/* Added a check for comment._id, using Math.random() as a fallback key */}
              {post.comments.slice(0).reverse().map((comment) => ( 
                <Box key={comment._id || Math.random()} sx={{ mb: 1, p: 1, bgcolor: '#f4f6f8', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default PostCard;