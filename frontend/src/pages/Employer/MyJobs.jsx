import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';
import { Edit, Delete, Block, Group } from '@mui/icons-material';
import axios from '../../api/axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/jobs/my-jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load jobs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Job deleted', { variant: 'success' });
      fetchJobs();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  const handleStop = async (id) => {
    try {
      await axios.patch(`/jobs/${id}/stop`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Applications stopped', { variant: 'success' });
      fetchJobs();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Action failed', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Job Posts
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : jobs.length === 0 ? (
          <Typography align="center">No jobs posted yet.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location || '-'}</TableCell>
                  <TableCell>{job.isActive ? 'Active' : 'Closed'}</TableCell>
                  <TableCell>
                    <IconButton
  onClick={() => navigate(`/employer/applicants/${job._id}`)}
  title="View Applicants"
>
  <Group />
</IconButton>
                    <IconButton
                      onClick={() => handleStop(job._id)}
                      disabled={!job.isActive}
                      title="Stop Applications"
                    >
                      <Block />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                      title="Edit Job"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(job._id)}
                      title="Delete Job"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default MyJobs;
