import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogById(id);
      setBlog(response.data.blog);
      setLiked(response.data.blog.likes?.includes(user?._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await blogService.likeBlog(id);
      setLiked(!liked);
      fetchBlog();
    } catch (err) {
      setError('Failed to like blog');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await blogService.addComment(id, commentText);
      setCommentText('');
      fetchBlog();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete blog');
      }
    }
  };

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-12">{error}</p>;
  if (!blog) return <p className="text-center mt-12">Blog not found</p>;

  const isAuthor = user?._id === blog.author?._id;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Header */}
      <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        <div className="flex justify-between items-center mb-6 pb-6 border-b">
          <div className="flex items-center gap-4">
            <img
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full"
              onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
            />
            <div>
              <p className="font-semibold">{blog.author?.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <button onClick={() => navigate(`/edit/${id}`)} className="btn-primary text-sm">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger text-sm">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-8">
          <p className="whitespace-pre-wrap text-lg leading-relaxed">{blog.content}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 py-4 border-y">
          <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-600">
            <span className="text-2xl">{liked ? '❤️' : '🤍'}</span>
            <span>{blog.likes?.length || 0}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span>{blog.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👁️</span>
            <span>{blog.views}</span>
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({blog.comments?.length || 0})</h2>

        {token ? (
          <form onSubmit={handleAddComment} className="mb-8 pb-8 border-b">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="input-field w-full h-24 mb-4"
              placeholder="Add a comment..."
              required
            />
            <button type="submit" className="btn-primary">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mb-8 pb-8 border-b text-gray-600">
            Please <a href="/login" className="text-blue-600">login</a> to comment
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {blog.comments?.map((comment, index) => (
            <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="font-semibold flex items-center gap-2">
                <img
                  src={comment.user?.avatar}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/32'}
                />
                {comment.user?.name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;