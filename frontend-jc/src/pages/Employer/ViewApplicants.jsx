import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';

function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('experience');

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/applications/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplicants(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  useEffect(() => {
    let data = [...applicants];

    if (filterRole) {
      data = data.filter(app =>
        app.role?.toLowerCase().includes(filterRole.toLowerCase())
      );
    }

    if (filterStatus) {
      data = data.filter(app => app.status === filterStatus);
    }

    if (sortBy === 'name') {
      data.sort((a, b) => (a.applicant?.name || '').localeCompare(b.applicant?.name || ''));
    } else if (sortBy === 'date') {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'experience') {
      data.sort((a, b) => {
        const numA = parseExperience(a.experience);
        const numB = parseExperience(b.experience);
        return numB - numA;
      });
    }

    setFiltered(data);
  }, [filterRole, filterStatus, sortBy, applicants]);

  const parseExperience = (exp) => {
    if (!exp) return 0;
    const match = exp.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(`/applications/status/${appId}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Status updated');
      fetchApplicants();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const updateNote = async (appId, note) => {
    try {
      await axios.patch(`/applications/note/${appId}`, { note }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Note saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save note');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Applicants</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          placeholder="Filter by Role"
          className="border border-gray-300 rounded p-2 text-sm w-full"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm w-full"
        >
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm w-full"
        >
          <option value="experience">Sort by Experience</option>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date Applied</option>
          <option value="">None</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600">No applicants match the criteria.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {['Name', 'Email', 'Role', 'Experience', 'Status', 'CV', 'Date Applied', 'Actions'].map((head) => (
                  <th key={head} className="p-2 border-b font-semibold text-left">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{app.applicant?.name}</td>
                  <td className="p-2 border-b">{app.applicant?.email}</td>
                  <td className="p-2 border-b">{app.role}</td>
                  <td className="p-2 border-b">{app.experience}</td>
                  <td className="p-2 border-b">{app.status}</td>
                  <td className="p-2 border-b">
                    {app.cv ? (
                      <a
                        href={`http://localhost:5000/uploads/${app.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View CV
                      </a>
                    ) : (
                      'No CV'
                    )}
                  </td>
                  <td className="p-2 border-b">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border-b">
                    <div className="space-y-1">
                      <button
                        onClick={() => updateStatus(app._id, 'shortlisted')}
                        className={`w-full text-xs rounded py-1 ${app.status === 'shortlisted' ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500 hover:bg-blue-100'}`}
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, 'rejected')}
                        className={`w-full text-xs rounded py-1 ${app.status === 'rejected' ? 'bg-red-500 text-white' : 'border border-red-500 text-red-500 hover:bg-red-100'}`}
                      >
                        Reject
                      </button>
                      <input
                        type="text"
                        defaultValue={app.note}
                        placeholder="Add note"
                        onBlur={(e) => updateNote(app._id, e.target.value)}
                        className="w-full border border-gray-300 rounded p-1 text-xs"
                      />
                    </div>
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

export default ViewApplicants;
