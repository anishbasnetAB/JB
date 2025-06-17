import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [job, setJob] = useState(null);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load job details', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('experience', experience);
      if (cv) formData.append('cv', cv);

      await axios.post(`/applications/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      enqueueSnackbar('Application submitted successfully!', { variant: 'success' });
      navigate('/jobs');  // or your job list route
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to apply';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {job ? (
          <>
            <Typography variant="h5" gutterBottom>
              Apply to {job.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {job.companyName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {job.description}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
              <TextField
                label="Your Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Your Experience (e.g. 3 years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
              >
                {cv ? cv.name : 'Upload CV (PDF/DOC)'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files[0])}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Box>
          </>
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ApplyJob;
