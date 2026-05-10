import React, { useState, useEffect } from 'react';
import { authService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const data = response.data.user;
        setProfile(data);
        setForm({ name: data.name || '', bio: data.bio || '', avatar: data.avatar || '' });
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await authService.updateProfile(form);
      const updated = response.data.user;
      setProfile(updated);
      setForm({ name: updated.name || '', bio: updated.bio || '', avatar: updated.avatar || '' });
      setEditing(false);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: 40 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 32 }}>
            <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 22, width: '50%', marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 14, width: '70%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 80 }} />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 16px' }}>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Profile</h1>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf3', padding: 40 }}>
        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          {profile.avatar && !profile.avatar.includes('placeholder') ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e8edf3' }}
            />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, flexShrink: 0,
            }}>
              {initials}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{profile.name}</h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>{profile.email}</p>
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
              Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Bio */}
        {!editing && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Bio</p>
              <p style={{ color: profile.bio ? '#475569' : '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
                {profile.bio || 'No bio yet.'}
              </p>
            </div>
            <button onClick={() => setEditing(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Edit Profile
            </button>
          </>
        )}

        {/* Edit form */}
        {editing && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="input-field"
                style={{ height: 100 }}
                placeholder="Tell readers a bit about yourself..."
                maxLength="200"
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                {form.bio.length} / 200
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>Avatar URL</label>
              <input
                type="url"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => { setEditing(false); setForm({ name: profile.name, bio: profile.bio, avatar: profile.avatar }); }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
