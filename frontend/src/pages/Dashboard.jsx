import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const response = await blogService.getUserBlogs();
      setBlogs(response.data.blogs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        fetchUserBlogs();
      } catch (err) {
        setError('Failed to delete blog');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.name}!</p>

      <Link to="/create" className="btn-primary mb-8 inline-block">
        ✍️ Write New Blog
      </Link>

      {error && <p className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</p>}

      {loading ? (
        <p>Loading your blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-600">No blogs yet. Start writing!</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="card flex justify-between items-center">
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()} • {blog.status.toUpperCase()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/blog/${blog._id}`} className="btn-primary text-sm">
                  View
                </Link>
                <Link to={`/edit/${blog._id}`} className="btn-secondary text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;