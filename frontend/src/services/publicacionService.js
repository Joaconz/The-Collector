import { api } from './api';

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const publicacionService = {
  getCatalogo({ categoria, precioMin, precioMax, orden, page = 0, size = 20 } = {}) {
    return api.get(`/publicaciones${buildQuery({ categoria, precioMin, precioMax, orden, page, size })}`);
  },

  getById(id) {
    return api.get(`/publicaciones/${id}`);
  },

  getMisPublicaciones() {
    return api.get('/publicaciones/mias');
  },

  create(request) {
    return api.post('/publicaciones', request);
  },

  update(id, request) {
    return api.put(`/publicaciones/${id}`, request);
  },

  updateEstado(id, estado) {
    return api.patch(`/publicaciones/${id}/estado`, { estado });
  },

  remove(id) {
    return api.del(`/publicaciones/${id}`);
  },
};
