import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const readTime = (content) => {
  const words = content?.trim().split(/\s+/).length || 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogService.getBlogById(id);
        const data = response.data.blog;
        setBlog(data);
        setLikeCount(Array.isArray(data.likes) ? data.likes.length : data.likes || 0);
        if (user && Array.isArray(data.likes)) {
          setHasLiked(data.likes.some((likeId) => likeId === user._id || likeId?._id === user._id));
        }
      } catch {
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      showToast('Login to like this post', 'info');
      return navigate('/login');
    }
    const prev = hasLiked;
    setHasLiked(!prev);
    setLikeCount((c) => (prev ? c - 1 : c + 1));
    try {
      const response = await blogService.likeBlog(id);
      setLikeCount(response.data.likes);
    } catch {
      setHasLiked(prev);
      setLikeCount((c) => (prev ? c + 1 : c - 1));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Login to comment', 'info');
      return navigate('/login');
    }
    if (!comment.trim()) return;
    try {
      setSubmittingComment(true);
      const response = await blogService.addComment(id, comment);
      setBlog((prev) => ({ ...prev, comments: response.data.comments }));
      setComment('');
      showToast('Comment posted!', 'success');
    } catch {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog permanently?')) return;
    try {
      await blogService.deleteBlog(id);
      showToast('Blog deleted', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to delete blog', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <div className="skeleton" style={{ height: 14, width: '20%', marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 36, width: '80%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 32 }} />
        {[100, 90, 95, 85, 92].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10 }} />
        ))}
      </div>
    );
  }

  if (error) return <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', color: '#dc2626' }}>{error}</div>;
  if (!blog) return null;

  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
        ← Back to Home
      </Link>

      <article style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: '40px', marginTop: 20 }}>
        {/* Category + read time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span className="badge badge-blue">{blog.category}</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>{readTime(blog.content)}</span>
        </div>

        <h1 style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20 }}>
          {blog.title}
        </h1>

        {/* Author row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, borderBottom: '1px solid #f1f5f9', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, flexShrink: 0,
            }}>
              {blog.author?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>{blog.author?.name}</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          {isAuthor && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/edit/${blog._id}`} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>Edit</Link>
              <button onClick={handleDelete} className="btn-danger" style={{ padding: '6px 14px', fontSize: 13 }}>Delete</button>
            </div>
          )}
        </div>

        {/* Description */}
        {blog.description && (
          <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 24, paddingLeft: 16, borderLeft: '3px solid #3b82f6' }}>
            {blog.description}
          </p>
        )}

        {/* Content */}
        <div style={{ fontSize: 16, color: '#1e293b', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 32 }}>
          {blog.content}
        </div>

        {/* Stats + Like */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handleLike}
            className={`btn-like ${hasLiked ? 'liked' : ''}`}
          >
            <span style={{ fontSize: 17 }}>{hasLiked ? '❤️' : '🤍'}</span>
            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </button>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>👁 {blog.views} views</span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>💬 {blog.comments?.length || 0} comments</span>
        </div>
      </article>

      {/* Comments section */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: '32px', marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
          Comments ({blog.comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: '#1e40af',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 4,
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field"
                placeholder="Write a comment..."
              />
              <button type="submit" disabled={submittingComment || !comment.trim()} className="btn-primary" style={{ flexShrink: 0, padding: '11px 20px' }}>
                {submittingComment ? '...' : 'Post'}
              </button>
            </div>
          </form>
        ) : (
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login</Link> to join the conversation.
          </p>
        )}

        {blog.comments?.length === 0 && (
          <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>No comments yet. Be the first!</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {blog.comments?.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `hsl(${(c.user?.name?.charCodeAt(0) || 0) * 137 % 360}, 60%, 45%)`,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>
                {c.user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{c.user?.name}</p>
                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.5 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
