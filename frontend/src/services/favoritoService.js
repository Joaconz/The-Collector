import { api } from './api';

export const favoritoService = {
  getMisFavoritos() {
    return api.get('/favoritos');
  },

  agregar(publicacionId) {
    return api.post(`/favoritos/${publicacionId}`);
  },

  eliminar(publicacionId) {
    return api.del(`/favoritos/${publicacionId}`);
  },
};
