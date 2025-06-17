// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import Signup from './Pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import EmployerDashboard from './pages/Employer/Dashboard';
import JobseekerDashboard from './pages/Jobseeker/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import PostJob from './pages/Employer/PostJob';
import MyJobs from './pages/Employer/MyJobs';
import EditJob from './pages/Employer/EditJob';
import ViewApplicants from './pages/Employer/ViewApplicants';
import ApplyJob from './pages/Jobseeker/ApplyJob';
import JobDetail from './pages/Jobseeker/JobDetail';
import JobList from './pages/Jobseeker/JobList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/employer/my-jobs" element={
  <ProtectedRoute>
    <MyJobs />
  </ProtectedRoute>
} />

<Route
  path="/apply/:jobId"
  element={
    <ProtectedRoute>
      <ApplyJob />
    </ProtectedRoute>
  }
/>

<Route path="/jobs/:jobId" element={<JobDetail />} />
<Route path="/jobs" element={
  <ProtectedRoute>
    <JobList />
  </ProtectedRoute>
} />

<Route path="/employer/applicants/:jobId" element={
  <ProtectedRoute>
    <ViewApplicants />
  </ProtectedRoute>
} />

<Route path="/employer/edit-job/:id" element={
  <ProtectedRoute>
    <EditJob />
  </ProtectedRoute>
} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <JobseekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/employer/post-job" element={
  <ProtectedRoute>
    <PostJob />
  </ProtectedRoute>
} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
