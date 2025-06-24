import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <p className="text-lg text-red-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <h2 className="text-lg text-gray-700 mb-2">{job.companyName}</h2>
      <p className="text-sm text-gray-600 mb-1">Location: {job.location || 'N/A'}</p>
      <p className="text-sm text-gray-600 mb-1">Pay: {job.pay || 'N/A'}</p>
      <p className="text-sm text-gray-600 mb-3">
        Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills && job.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-700 mb-4">{job.description}</p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-1">Requirements</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-1">Responsibilities</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate(`/apply/${job._id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobDetail;
