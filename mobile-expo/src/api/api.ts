import axios from 'axios';
const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api' });
export default api;
