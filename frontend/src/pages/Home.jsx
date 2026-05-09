import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/apiService';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [search, category]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({ search, category });
      setBlogs(response.data.blogs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BlogHub</h1>
        <p className="text-xl mb-6">Share your thoughts and ideas with the world</p>
        <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
          Get Started
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="mb-12 space-y-4">
        <input
          type="text"
          placeholder="Search blogs..."
          className="input-field w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-full"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-600">Loading blogs...</p>}

      {/* Error */}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Blogs Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="card">
              <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
              <p className="text-sm text-blue-600 mb-2">{blog.category}</p>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.description || blog.content}</p>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>By {blog.author?.name}</span>
                <span>👁 {blog.views}</span>
              </div>

              <div className="flex gap-2 text-sm text-gray-600 mb-4">
                <span>❤️ {blog.likes?.length || 0}</span>
                <span>💬 {blog.comments?.length || 0}</span>
              </div>

              <Link to={`/blog/${blog._id}`} className="btn-primary w-full text-center">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-center text-gray-600 py-12">No blogs yet. Be the first to write!</p>
      )}
    </div>
  );
};

export default Home;