import React, { useState } from 'react';
import axios from '../../api/axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      for (let img of images) {
        formData.append('images', img);
      }

      await axios.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      enqueueSnackbar('Blog created!', { variant: 'success' });
      setTitle('');
      setContent('');
      setImages([]);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to create blog', { variant: 'error' });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Create Blog</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Content"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button variant="outlined" component="label">
          Upload Images
          <input hidden multiple type="file" onChange={(e) => setImages([...e.target.files])} />
        </Button>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">Create</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateBlog;
