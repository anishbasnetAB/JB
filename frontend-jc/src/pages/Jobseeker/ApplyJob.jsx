import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load job details');
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('experience', experience);
      if (cv) formData.append('cv', cv);

      await axios.post(`/applications/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Application submitted successfully!');
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to apply';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow rounded p-6">
      {job ? (
        <>
          <h1 className="text-xl font-bold mb-2">Apply to {job.title}</h1>
          <h2 className="text-sm text-gray-600 mb-2">{job.companyName}</h2>
          <p className="text-sm text-gray-700 mb-4">{job.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Experience (e.g. 3 years)</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload CV (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files[0])}
                className="block w-full text-sm"
              />
              {cv && <p className="text-xs text-gray-500 mt-1">{cv.name}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

export default ApplyJob;
