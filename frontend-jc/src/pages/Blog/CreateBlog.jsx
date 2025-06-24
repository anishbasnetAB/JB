import React, { useState } from 'react';
import axios from '../../api/axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      for (let img of images) {
        formData.append('images', img);
      }

      await axios.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Blog created!');
      setTitle('');
      setContent('');
      setImages([]);
    } catch (err) {
      console.error(err);
      alert('Failed to create blog');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="block"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
