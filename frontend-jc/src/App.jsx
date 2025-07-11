// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import Signup from './Pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import EmployerDashboard from './pages/Employer/Dashboard';
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
import SavedJobs from './pages/Jobseeker/SavedJobs';
import MyApplications from './pages/Jobseeker/MyApplications';
import BlogList from './pages/Blog/BlogList';
import BlogDetail from './pages/Blog/BlogDetail';
import CreateBlog from './pages/Blog/CreateBlog';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import AdminEmployers from './pages/Admin/AdminEmployers';
import AdminBlogs from './pages/Admin/AdminBlogs';
import AdminJobs from './pages/Admin/AdminJobs';

function App() {
  const { user } = useAuth();

  return (
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
      <Route
        path="/employer/my-jobs"
        element={
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply/:jobId"
        element={
          <ProtectedRoute>
            <ApplyJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applicants/:jobId"
        element={
          <ProtectedRoute>
            <ViewApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/edit-job/:id"
        element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        }
      />
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/blogs/:blogId" element={<BlogDetail />} />
      <Route path="/blogs/create" element={<CreateBlog />} />
              <Route path="/admin/employers" element={<AdminEmployers />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.userType === 'employer' ? <EmployerDashboard /> : <JobList />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
