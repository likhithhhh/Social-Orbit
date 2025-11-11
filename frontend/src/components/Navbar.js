import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Use 'elevation={0}' for a modern, flat look
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }} elevation={0}> 
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Social App
        </Typography>

        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1 }}>
              {user.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Hi, {user.username}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="contained" 
                color="primary" 
                disableElevation 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;