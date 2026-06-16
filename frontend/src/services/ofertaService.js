import { api } from './api';

export const ofertaService = {
  crear(publicacionId, precioOfertado) {
    return api.post('/ofertas', { publicacionId, precioOfertado });
  },

  getMisOfertasComprador() {
    return api.get('/ofertas/comprador');
  },

  getMisOfertasVendedor() {
    return api.get('/ofertas/vendedor');
  },

  aceptar(id) {
    return api.patch(`/ofertas/${id}/aceptar`);
  },

  rechazar(id) {
    return api.patch(`/ofertas/${id}/rechazar`);
  },

  contraofertar(id, precioContraoferta) {
    return api.patch(`/ofertas/${id}/contraofertar`, { precioContraoferta });
  },

  aceptarContraoferta(id) {
    return api.patch(`/ofertas/${id}/aceptar-contraoferta`);
  },

  cancelar(id) {
    return api.patch(`/ofertas/${id}/cancelar`);
  },
};
