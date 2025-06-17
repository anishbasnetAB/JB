    import React, { useEffect, useState } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  companyName: yup.string().required('Company name is required'),
  pay: yup.string().nullable(),
  location: yup.string().nullable(),
  skills: yup.string().nullable(),
  description: yup.string().nullable(),
  deadline: yup.date().nullable(),
});

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get('/jobs/my-jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const job = res.data.find(j => j._id === id);
        if (!job) {
          enqueueSnackbar('Job not found', { variant: 'error' });
          navigate('/employer/my-jobs');
          return;
        }
        setValue('title', job.title);
        setValue('companyName', job.companyName);
        setValue('pay', job.pay);
        setValue('location', job.location);
        setValue('skills', job.skills?.join(', '));
        setValue('description', job.description);
        setValue('deadline', job.deadline ? job.deadline.slice(0,10) : '');
        setLoading(false);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Failed to load job', { variant: 'error' });
        navigate('/employer/my-jobs');
      }
    };

    fetchJob();
  }, [id, enqueueSnackbar, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      };

      await axios.put(`/jobs/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      enqueueSnackbar('Job updated', { variant: 'success' });
      navigate('/employer/my-jobs');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Update failed';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Edit Job
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {['title', 'companyName', 'pay', 'location', 'skills', 'description', 'deadline'].map((field, idx) => (
              <Grid item xs={field === 'description' ? 12 : 6} key={idx}>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: f }) => (
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      multiline={field === 'description'}
                      rows={field === 'description' ? 4 : 1}
                      type={field === 'deadline' ? 'date' : 'text'}
                      InputLabelProps={field === 'deadline' ? { shrink: true } : {}}
                      error={!!errors[field]}
                      helperText={errors[field]?.message}
                      fullWidth
                      {...f}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditJob;
