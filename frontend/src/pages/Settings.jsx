import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';

const Settings = () => {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Settings Page</h1>
      <Button variant="contained" color="primary" onClick={logout}> Logout</Button>
    </div>
  );
};

export default Settings;
