import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/apiService';

const CATEGORIES = ['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Other'];
const PAGE_SIZE = 9;

const readTime = (content) => {
  const words = content?.trim().split(/\s+/).length || 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 14 }} />
    <div className="skeleton" style={{ height: 22, width: '85%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 6 }} />
    <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 20 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <div className="skeleton" style={{ height: 12, width: '30%' }} />
      <div className="skeleton" style={{ height: 12, width: '20%' }} />
    </div>
    <div className="skeleton" style={{ height: 38, borderRadius: 8 }} />
  </div>
);

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await blogService.getAllBlogs({ search, category, page, limit: PAGE_SIZE });
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.pagination?.pages || 1);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Failed to fetch blogs');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, [search, category, page]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        borderRadius: 16,
        padding: '56px 40px',
        marginBottom: 40,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)',
        }} />
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 12, position: 'relative' }}>
          Discover Great Stories
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 28, position: 'relative' }}>
          Read, write, and share ideas with the world
        </p>
        <Link
          to="/register"
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: 'white',
            padding: '12px 28px',
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 15,
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          Start Writing →
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search blogs..."
          className="input-field"
          style={{ flex: 1, minWidth: 200 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
          style={{ width: 180 }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <button
          onClick={() => setCategory('')}
          style={{
            padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', border: '1.5px solid',
            background: category === '' ? '#0f172a' : 'transparent',
            color: category === '' ? 'white' : '#64748b',
            borderColor: category === '' ? '#0f172a' : '#e2e8f0',
          }}
        >All</button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid',
              background: category === c ? '#2563eb' : 'transparent',
              color: category === c ? 'white' : '#64748b',
              borderColor: category === c ? '#2563eb' : '#e2e8f0',
            }}
          >{c}</button>
        ))}
      </div>

      {/* Error */}
      {error && <p style={{ color: '#dc2626', textAlign: 'center', padding: '40px 0' }}>{error}</p>}

      {/* Blog grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
          : blogs.map((blog) => (
            <div key={blog._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge badge-blue">{blog.category}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{readTime(blog.content)}</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.35 }} className="line-clamp-2">
                {blog.title}
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, flex: 1, marginBottom: 16 }} className="line-clamp-3">
                {blog.description || blog.content.substring(0, 130) + '...'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#1e40af', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {blog.author?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{blog.author?.name}</span>
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
                <span>👁 {blog.views}</span>
                <span>❤ {blog.likes?.length || 0}</span>
                <span>💬 {blog.comments?.length || 0}</span>
              </div>
              <Link to={`/blog/${blog._id}`} className="btn-primary" style={{ textAlign: 'center', fontSize: 13 }}>
                Read More
              </Link>
            </div>
          ))
        }
      </div>

      {/* Empty state */}
      {!loading && !error && blogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ color: '#64748b', fontSize: 18, fontWeight: 500 }}>No blogs found</p>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>Try a different search or category</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary"
            style={{ padding: '8px 18px' }}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 36, height: 36, borderRadius: 8, border: '1.5px solid',
                cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: p === page ? '#0f172a' : 'white',
                color: p === page ? 'white' : '#475569',
                borderColor: p === page ? '#0f172a' : '#e2e8f0',
              }}
            >{p}</button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary"
            style={{ padding: '8px 18px' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
