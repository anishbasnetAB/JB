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
  CircularProgress,
  Box,
  Link as MuiLink,
  TextField,
  MenuItem,
  Grid,
  Button,
  Stack
} from '@mui/material';
import axios from '../../api/axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

function ViewApplicants() {
  const { jobId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('experience');

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/applications/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplicants(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load applicants', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  useEffect(() => {
    let data = [...applicants];

    if (filterRole) {
      data = data.filter(app =>
        app.role?.toLowerCase().includes(filterRole.toLowerCase())
      );
    }

    if (filterStatus) {
      data = data.filter(app => app.status === filterStatus);
    }

    if (sortBy === 'name') {
      data.sort((a, b) => (a.applicant?.name || '').localeCompare(b.applicant?.name || ''));
    } else if (sortBy === 'date') {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'experience') {
      data.sort((a, b) => {
        const numA = parseExperience(a.experience);
        const numB = parseExperience(b.experience);
        return numB - numA;
      });
    }

    setFiltered(data);
  }, [filterRole, filterStatus, sortBy, applicants]);

  const parseExperience = (exp) => {
    if (!exp) return 0;
    const match = exp.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(`/applications/status/${appId}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Status updated', { variant: 'success' });
      fetchApplicants();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const updateNote = async (appId, note) => {
    try {
      await axios.patch(`/applications/note/${appId}`, { note }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Note saved', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to save note', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Applicants
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Filter by Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              select
              fullWidth
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="applied">Applied</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              select
              fullWidth
              size="small"
            >
              <MenuItem value="experience">Experience</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="date">Date Applied</MenuItem>
              <MenuItem value="">None</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography align="center">No applicants match the criteria.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000, border: '1px solid #ddd' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {['Name', 'Email', 'Role', 'Experience', 'Status', 'CV', 'Date Applied', 'Actions'].map((head) => (
                    <TableCell key={head} sx={{ fontWeight: 'bold' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.applicant?.name}</TableCell>
                    <TableCell>{app.applicant?.email}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>{app.experience}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>
                      {app.cv ? (
                        <MuiLink
                          href={`http://localhost:5000/uploads/${app.cv}`}
                          target="_blank"
                          rel="noopener"
                        >
                          View CV
                        </MuiLink>
                      ) : (
                        'No CV'
                      )}
                    </TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={1}>
                        <Button
                          size="small"
                          variant={app.status === 'shortlisted' ? 'contained' : 'outlined'}
                          onClick={() => updateStatus(app._id, 'shortlisted')}
                          fullWidth
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant={app.status === 'rejected' ? 'contained' : 'outlined'}
                          onClick={() => updateStatus(app._id, 'rejected')}
                          fullWidth
                        >
                          Reject
                        </Button>
                        <TextField
                          size="small"
                          placeholder="Add note"
                          defaultValue={app.note}
                          onBlur={(e) => updateNote(app._id, e.target.value)}
                          fullWidth
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ViewApplicants;
