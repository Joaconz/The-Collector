import { api } from './api';

export const carritoService = {
  getMiCarrito() {
    return api.get('/carrito');
  },

  agregar(publicacionId) {
    return api.post(`/carrito/${publicacionId}`);
  },

  quitar(publicacionId) {
    return api.del(`/carrito/${publicacionId}`);
  },

  checkout() {
    return api.post('/carrito/checkout');
  },
};
