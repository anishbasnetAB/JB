import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Container, Typography, Card, CardContent, Button, TextField, Box, Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${blogId}`);
      setBlog(res.data);
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/blogs/${blogId}/like`);
      fetchBlog();
    } catch (err) {
      console.error('Failed to like blog:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/blogs/${blogId}/comment`, { text: commentText });
      setCommentText('');
      fetchBlog();
    } catch (err) {
      console.error('Failed to comment:', err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  if (!blog) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4">{blog.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">By {blog.employer?.name || 'Unknown'}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{blog.content}</Typography>

          <Box sx={{ mt: 2 }}>
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000/uploads/${img}`}
                alt={`Blog image ${idx + 1}`}
                style={{ maxWidth: '100%', marginBottom: 8 }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip label={`${blog.likes.length} Likes`} sx={{ mr: 1 }} />
            <Button variant="outlined" onClick={handleLike}>Like</Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Comments</Typography>
            {blog.comments.map((c) => (
              <Box key={c._id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{c.commenter?.name || 'Anonymous'}:</strong> {c.text}
                </Typography>
              </Box>
            ))}

            <Box sx={{ mt: 2 }}>
              <TextField
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                label="Add a comment"
                fullWidth
                multiline
                size="small"
              />
              <Button sx={{ mt: 1 }} variant="contained" onClick={handleComment}>Post</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogDetail;
