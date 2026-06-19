import { api, setStoredAuth, clearStoredAuth, getStoredAuth } from './api';

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    const auth = { ...data, email };
    setStoredAuth(auth);
    return auth;
  },

  async register({ nombre, email, password, rol }) {
    const data = await api.post('/auth/register', { nombre, email, password, rol });
    const auth = { ...data, email };
    setStoredAuth(auth);
    return auth;
  },

  logout() {
    clearStoredAuth();
  },

  getCurrentUser() {
    return getStoredAuth();
  },
};
