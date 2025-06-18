import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { saveJob } from '../../api/jobSeeker';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs');
      const activeJobs = res.data.filter(job => job.isActive);
      setJobs(activeJobs);
      setFiltered(activeJobs);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load jobs', { variant: 'error' });
    }
  };

  useEffect(() => {
    let data = [...jobs];

    if (titleSearch) {
      data = data.filter(job =>
        job.title.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }

    if (locationSearch) {
      data = data.filter(job =>
        job.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    setFiltered(data);
  }, [titleSearch, locationSearch, jobs]);

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      enqueueSnackbar('Job saved successfully!', { variant: 'success' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save job';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Jobs for you
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by job title"
              fullWidth
              size="small"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by location"
              fullWidth
              size="small"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filtered.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No jobs found</Typography>
          </Grid>
        ) : (
          filtered.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="subtitle2" gutterBottom>{job.companyName}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.location}</Typography>

                  <Box mt={1} mb={1}>
                    <Chip label={job.pay} color="success" size="small" sx={{ mr: 1 }} />
                    {job.contractType && <Chip label={job.contractType} size="small" />}
                  </Box>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {job.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ mt: 'auto' }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSaveJob(job._id)}
                  >
                    Save Job
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default JobList;
