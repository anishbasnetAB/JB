import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my'); // Token auto-attached via interceptor
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const validApplications = applications.filter(app => app.job);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      {validApplications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validApplications.map(app => (
            <div key={app._id} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{app.job.title}</h2>
                <p className="text-sm text-gray-700">{app.job.companyName}</p>
                <p className="text-sm text-gray-600">{app.job.location}</p>
                <p className="text-sm text-gray-600 mt-1">Status: {app.status}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => window.open(`/jobs/${app.job._id}`, '_blank')}
                  className="w-full border border-blue-500 text-blue-500 py-1 rounded hover:bg-blue-50 text-sm"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
