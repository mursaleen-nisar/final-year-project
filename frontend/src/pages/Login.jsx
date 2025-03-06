import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Button, TextField, Typography, Container, Paper, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const authContext = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authContext.login(credentials.email, credentials.password);
      console.log('Login successful:', response);
      toast.success('Login successful! Redirecting...', {
        theme: darkMode ? 'dark' : 'light'
      });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.', {
        theme: darkMode ? 'dark' : 'light'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#333',
          borderRadius: 2,
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={darkMode ? "primary" : "action"} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : 'inherit',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#aaa' : 'inherit',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? '#555' : 'inherit',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#777' : 'primary.main',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={darkMode ? "primary" : "action"} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    color={darkMode ? "primary" : "default"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : 'inherit',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#aaa' : 'inherit',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? '#555' : 'inherit',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#777' : 'primary.main',
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" color={darkMode ? "#ccc" : "textSecondary"}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
