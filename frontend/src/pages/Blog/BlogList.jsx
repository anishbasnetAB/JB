import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Blogs</Typography>
      <Grid container spacing={2}>
        {blogs.map(blog => (
          <Grid item xs={12} md={6} key={blog._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">By {blog.employer.name}</Typography>
                <Typography variant="body2">{blog.content.substring(0, 100)}...</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/blogs/${blog._id}`)}>View</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogList;
