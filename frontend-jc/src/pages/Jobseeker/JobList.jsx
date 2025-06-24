import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { saveJob } from '../../api/jobSeeker';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs');
      const activeJobs = res.data.filter(job => job.isActive);
      setJobs(activeJobs);
      setFiltered(activeJobs);
    } catch (err) {
      console.error(err);
      alert('Failed to load jobs');
    }
  };

  useEffect(() => {
    let data = [...jobs];

    if (titleSearch) {
      data = data.filter(job =>
        job.title.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }

    if (locationSearch) {
      data = data.filter(job =>
        job.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    setFiltered(data);
  }, [titleSearch, locationSearch, jobs]);

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      alert('Job saved successfully!');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save job';
      alert(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Jobs for you</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by job title"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Search by location"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No jobs found</p>
        ) : (
          filtered.map((job) => (
            <div key={job._id} className="bg-white shadow rounded flex flex-col p-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-600 mb-1">{job.companyName}</p>
                <p className="text-sm text-gray-500">{job.location}</p>

                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {job.pay && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {job.pay}
                    </span>
                  )}
                  {job.contractType && (
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {job.contractType}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 truncate">{job.description}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="text-blue-500 text-sm hover:underline"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleSaveJob(job._id)}
                  className="border border-blue-500 text-blue-500 text-sm px-2 py-1 rounded hover:bg-blue-50"
                >
                  Save Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobList;
