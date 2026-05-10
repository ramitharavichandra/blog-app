import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Other'];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ title: '', content: '', description: '', category: 'Technology' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogService.getBlogById(id);
        const blog = response.data.blog;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          description: blog.description || '',
          category: blog.category || 'Technology',
        });
      } catch {
        showToast('Failed to load blog', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await blogService.updateBlog(id, formData);
      showToast('Blog updated!', 'success');
      navigate(`/blog/${id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update blog', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px' }}>
        <div className="skeleton" style={{ height: 32, width: '30%', marginBottom: 32 }} />
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: 32 }}>
          <div className="skeleton" style={{ height: 48, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 48, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 280 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Edit Blog</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>Update your post</p>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Blog title"
              required
              style={{ fontSize: 18, fontWeight: 600 }}
            />
            <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              {formData.title.length} / 200
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Brief summary (optional)"
                maxLength="500"
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Content *</label>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8' }}>
                <span>{wordCount} words</span>
                <span>{readTime} min read</span>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input-field"
              style={{ height: 280, fontSize: 15, lineHeight: 1.7 }}
              placeholder="Write your blog content..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
