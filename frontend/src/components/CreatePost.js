import React, { useState } from 'react';
import * as api from '../api';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Avatar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Send as SendIcon } from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textContent && !imageUrl) {
      setError('Please add some text or an image URL.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.createPost({ textContent, imageUrl });
      setTextContent('');
      setImageUrl('');
      onPostCreated(); 
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={2}>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {user?.username[0].toUpperCase()}
          </Avatar>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder={`What's on your mind, ${user?.username}?`}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
           <ImageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            fullWidth
            size="small"
            variant="standard"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              disabled={loading || (!textContent && !imageUrl)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Post
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;