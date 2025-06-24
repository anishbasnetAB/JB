import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-500">By {blog.employer?.name || 'Unknown'}</p>
              <p className="text-sm text-gray-700 mt-2">{blog.content.substring(0, 100)}...</p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="text-blue-500 hover:underline text-sm"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
