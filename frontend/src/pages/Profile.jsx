import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name, age, country };
      const res = await axios.put('/auth/profile', data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            fullWidth
          >
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
