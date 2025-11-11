import React, { useState, useEffect } from 'react';
import * as api from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const feedVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 
    }
  }
};

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.fetchPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load the feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handlePostCreated = () => {
    fetchAllPosts();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <CreatePost onPostCreated={handlePostCreated} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <motion.div
        variants={feedVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div key={post._id} variants={postVariants} layout>
              <PostCard 
                post={post} 
                setPosts={setPosts} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!loading && posts.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 5 }}>
          The feed is empty. Be the first to post!
        </Typography>
      )}
    </Box>
  );
};

export default FeedPage;