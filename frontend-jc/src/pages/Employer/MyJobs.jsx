import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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
      alert('Failed to load jobs');
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
      alert('Job deleted');
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleStop = async (id) => {
    try {
      await axios.patch(`/jobs/${id}/stop`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Applications stopped');
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-center mb-4">My Job Posts</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs posted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-2 text-left">Title</th>
                <th className="border-b p-2 text-left">Location</th>
                <th className="border-b p-2 text-left">Status</th>
                <th className="border-b p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{job.title}</td>
                  <td className="border-b p-2">{job.location || '-'}</td>
                  <td className="border-b p-2">{job.isActive ? 'Active' : 'Closed'}</td>
                  <td className="border-b p-2 flex flex-wrap gap-1">
                    <button
                      onClick={() => navigate(`/employer/applicants/${job._id}`)}
                      className="text-blue-500 hover:underline"
                      title="View Applicants"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStop(job._id)}
                      disabled={!job.isActive}
                      className={`text-yellow-500 hover:underline ${!job.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Stop Applications"
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                      className="text-green-500 hover:underline"
                      title="Edit Job"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-500 hover:underline"
                      title="Delete Job"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyJobs;
