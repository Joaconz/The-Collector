import { api } from './api';

export const subastaService = {
  getPujas(publicacionId) {
    return api.get(`/publicaciones/${publicacionId}/pujas`);
  },

  addPuja(publicacionId, monto) {
    return api.post(`/publicaciones/${publicacionId}/pujas`, { monto });
  },

  cerrar(publicacionId) {
    return api.post(`/publicaciones/${publicacionId}/cerrar-subasta`);
  },

  getMisSubastas() {
    return api.get('/publicaciones/mis-subastas');
  },
};
