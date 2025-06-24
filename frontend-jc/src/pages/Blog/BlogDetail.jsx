import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${blogId}`);
      setBlog(res.data);
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/blogs/${blogId}/like`);
      fetchBlog();
    } catch (err) {
      console.error('Failed to like blog:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/blogs/${blogId}/comment`, { text: commentText });
      setCommentText('');
      fetchBlog();
    } catch (err) {
      console.error('Failed to comment:', err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  if (!blog) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-sm text-gray-500 mt-1">By {blog.employer?.name || 'Unknown'}</p>
        <p className="mt-4 text-gray-700">{blog.content}</p>

        <div className="mt-4 space-y-2">
          {blog.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000/uploads/${img}`}
              alt={`Blog image ${idx + 1}`}
              className="max-w-full rounded"
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block bg-gray-200 text-sm text-gray-700 px-2 py-1 rounded">
            {blog.likes.length} Likes
          </span>
          <button
            onClick={handleLike}
            className="border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            Like
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="space-y-2">
            {blog.comments.map((c) => (
              <div key={c._id} className="border-b border-gray-200 pb-1">
                <p className="text-sm">
                  <strong>{c.commenter?.name || 'Anonymous'}:</strong> {c.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment"
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
