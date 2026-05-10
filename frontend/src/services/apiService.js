import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const blogService = {
  getAllBlogs: (params) => api.get('/blogs', { params }),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  getUserBlogs: () => api.get('/blogs/user/my-blogs'),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  likeBlog: (id) => api.post(`/blogs/${id}/like`),
  addComment: (id, text) => api.post(`/blogs/${id}/comment`, { text }),
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
