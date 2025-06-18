import React, { useEffect, useState } from 'react';
import { getSavedJobs, unsaveJob } from '../../api/jobSeeker';
import {
  Container, Typography, Card, CardContent, CardActions,
  Button, Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      const res = await getSavedJobs();
      setJobs(res.data);
    } catch (err) {
      enqueueSnackbar('Failed to load saved jobs', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      enqueueSnackbar('Job removed from saved', { variant: 'success' });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      enqueueSnackbar('Failed to unsave job', { variant: 'error' });
    }
  };

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}`);  // Navigate to job detail or apply page
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Saved Jobs</Typography>
      <Grid container spacing={2}>
        {jobs.map(job => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.companyName}</Typography>
                <Typography variant="body2">{job.location}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {job.description?.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() => handleUnsave(job._id)}
                >
                  Unsave
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApply(job._id)}
                >
                  Apply
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {jobs.length === 0 && (
          <Typography variant="body1">No saved jobs found.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default SavedJobs;
