import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Container, Grid, Paper, Typography, CircularProgress, Box
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/employer/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* First Row: Summary cards */}
        {[
          { label: 'Total Jobs', value: stats.jobs.total },
          { label: 'Active Jobs', value: stats.jobs.active },
          { label: 'Total Applicants', value: stats.applicants.total },
          { label: 'Total Blogs', value: stats.blogs.total }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">{item.label}</Typography>
              <Typography variant="h5">{item.value}</Typography>
            </Paper>
          </Grid>
        ))}

        {/* Second Row: Charts */}
        

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 350 }}>
            <Typography variant="subtitle1" gutterBottom>Applicants per Job</Typography>
            <ResponsiveContainer>
              <BarChart data={stats.applicants.perJob}>
                <XAxis dataKey="jobTitle" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Third Row: Jobs by Country and Blog Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Jobs by Country</Typography>
            {Object.entries(stats.jobs.byCountry).map(([country, count]) => (
              <Typography key={country}>{country}: {count}</Typography>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Blog Summary</Typography>
            <Typography>Total Likes: {stats.blogs.likes}</Typography>
            <Typography>Total Comments: {stats.blogs.comments}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployerDashboard;
