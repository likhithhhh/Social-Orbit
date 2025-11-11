import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      await signup(formData);
      // Navigation happens in App.js
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up.');
      setLoading(false);
    }
  };

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Sign Up
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disableElevation
                  sx={{ mt: 3, mb: 2, borderRadius: 2, padding: 1.5, fontWeight: 'bold' }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                </Button>
              </motion.div>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  {'Already have an account? Sign In'}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default SignupPage;