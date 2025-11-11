import axios from 'axios';

// The base URL for your backend
const API = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

// This interceptor adds the login token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth endpoints
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);

// Post endpoints
export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const commentOnPost = (id, commentData) => API.post(`/posts/${id}/comment`, commentData);