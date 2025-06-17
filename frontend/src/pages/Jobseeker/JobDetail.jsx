import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import {
  Container, Paper, Typography, Button, Chip, Box, CircularProgress
} from '@mui/material';

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading job details...</Typography>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Job not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        <Typography variant="h6" gutterBottom>{job.companyName}</Typography>
        <Typography variant="body1" gutterBottom>Location: {job.location || 'N/A'}</Typography>
        <Typography variant="body1" gutterBottom>Pay: {job.pay || 'N/A'}</Typography>
        <Typography variant="body1" gutterBottom>
          Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
        </Typography>

        <Box sx={{ mt: 2, mb: 2 }}>
          {job.skills && job.skills.map((skill, index) => (
            <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Typography variant="body1" gutterBottom>{job.description}</Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate(`/apply/${job._id}`)}
        >
          Apply Now
        </Button>
      </Paper>
    </Container>
  );
}

export default JobDetail;
