import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name, age, country };
      const res = await axios.put('/auth/profile', data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
