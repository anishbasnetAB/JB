import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Container, Typography, Card, CardContent, CardActions,
  Button, Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my');  // Token auto-attached via interceptor
      setApplications(res.data);
    } catch (err) {
      enqueueSnackbar('Failed to load applications', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Applications</Typography>
      <Grid container spacing={2}>
        {applications.filter(app => app.job).length === 0 ? (
          <Typography>No applications found.</Typography>
        ) : (
          applications
            .filter(app => app.job)  // Skip applications with missing job
            .map(app => (
              <Grid item xs={12} md={6} key={app._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{app.job.title}</Typography>
                    <Typography variant="body2">{app.job.companyName}</Typography>
                    <Typography variant="body2">{app.job.location}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Status: {app.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(`/jobs/${app.job._id}`, '_blank')}
                    >
                      View Job
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
        )}
      </Grid>
    </Container>
  );
};

export default MyApplications;
