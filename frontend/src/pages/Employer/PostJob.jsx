import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../api/axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  companyName: yup.string().required('Company name is required'),
  pay: yup.string().nullable(),
  location: yup.string().nullable(),
  skills: yup.string().nullable(),
  description: yup.string().nullable(),
  deadline: yup.date().nullable(),
});

function PostJob() {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      };

      const res = await axios.post('/jobs', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      enqueueSnackbar(res.data.message || 'Job posted successfully', { variant: 'success' });
      reset();
      navigate('/employer/my-jobs');

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Job post failed';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Post a New Job
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField label="Job Title" error={!!errors.title} helperText={errors.title?.message} fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField label="Company Name" error={!!errors.companyName} helperText={errors.companyName?.message} fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="pay"
                control={control}
                render={({ field }) => (
                  <TextField label="Pay (e.g. $60k-$80k)" fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField label="Location" fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <TextField label="Skills (comma separated)" fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField label="Job Description" multiline rows={4} fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <TextField label="Application Deadline" type="date" InputLabelProps={{ shrink: true }} fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default PostJob;
