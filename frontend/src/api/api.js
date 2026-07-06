import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach Firebase ID token to every request when the user is logged in
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Students ──────────────────────────────────────────────
export const getStudents = (params) => api.get('/students', { params });
export const createStudent = (data) => api.post('/students', data);
export const updateStudentStatus = (id, status) =>
  api.patch(`/students/${id}/status`, { status });
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const getStats = () => api.get('/students/stats');

// ── Matches ───────────────────────────────────────────────
export const getMatches = () => api.get('/matches');

// ── History ───────────────────────────────────────────────
export const getHistory = () => api.get('/history');
export const recordExchange = (studentAId, studentBId) =>
  api.post('/history', { studentAId, studentBId });

export default api;
