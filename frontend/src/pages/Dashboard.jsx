import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { blogService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getUserBlogs();
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this blog permanently?')) return;
    try {
      await blogService.deleteBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      showToast('Blog deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <button onClick={() => navigate('/create')} className="btn-primary">
          + New Blog
        </button>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-number">{blogs.length}</div>
            <div className="stat-label">Total Blogs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalViews.toLocaleString()}</div>
            <div className="stat-label">Total Views</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {blogs.filter((b) => b.status === 'published').length}
            </div>
            <div className="stat-label">Published</div>
          </div>
        </div>
      )}

      {error && <p style={{ color: '#dc2626', marginBottom: 16, padding: '12px 16px', background: '#fef2f2', borderRadius: 8 }}>{error}</p>}

      {/* Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 18, width: '50%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '30%' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="skeleton" style={{ height: 34, width: 60, borderRadius: 8 }} />
                <div className="skeleton" style={{ height: 34, width: 60, borderRadius: 8 }} />
                <div className="skeleton" style={{ height: 34, width: 70, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && blogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
          <p style={{ color: '#475569', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No blogs yet</p>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Share your first idea with the world</p>
          <button onClick={() => navigate('/create')} className="btn-primary">Write Your First Blog</button>
        </div>
      )}

      {/* Blog list */}
      {!loading && blogs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {blogs.map((blog) => (
            <div key={blog._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 24px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {blog.title}
                  </h3>
                  <span className={`badge ${blog.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                    {blog.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#94a3b8' }}>
                  <span className="badge badge-gray" style={{ fontWeight: 500, letterSpacing: 0 }}>{blog.category}</span>
                  <span>👁 {blog.views}</span>
                  <span>❤ {blog.likes?.length || 0}</span>
                  <span>💬 {blog.comments?.length || 0}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Link to={`/blog/${blog._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>View</Link>
                <Link to={`/edit/${blog._id}`} className="btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}>Edit</Link>
                <button onClick={() => handleDelete(blog._id)} className="btn-danger" style={{ padding: '6px 14px', fontSize: 13 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
