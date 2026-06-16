import { api } from './api';

export const reservaService = {
  crear(publicacionId) {
    return api.post('/reservas', { publicacionId });
  },

  getMisReservasComprador() {
    return api.get('/reservas/comprador');
  },

  getMisReservasVendedor() {
    return api.get('/reservas/vendedor');
  },

  confirmar(id) {
    return api.patch(`/reservas/${id}/confirmar`);
  },

  rechazar(id) {
    return api.patch(`/reservas/${id}/rechazar`);
  },

  cancelar(id) {
    return api.patch(`/reservas/${id}/cancelar`);
  },
};
