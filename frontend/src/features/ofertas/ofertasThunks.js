import { createAsyncThunk } from '@reduxjs/toolkit';
import { ofertaService } from '../../services/ofertaService';
import { toOferta } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

const TTL = 5 * 60 * 1000;

// GET /api/ofertas/comprador
export const fetchOfertasComprador = createAsyncThunk(
  'ofertas/fetchComprador',
  async (_, { rejectWithValue }) => {
    try {
      const list = await ofertaService.getMisOfertasComprador();
      return (list || []).map(toOferta);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, lastFetched } = getState().ofertas.comprador;
      return !(status === 'succeeded' && Date.now() - lastFetched < TTL);
    },
  }
);

// GET /api/ofertas/vendedor
export const fetchOfertasVendedor = createAsyncThunk(
  'ofertas/fetchVendedor',
  async (_, { rejectWithValue }) => {
    try {
      const list = await ofertaService.getMisOfertasVendedor();
      return (list || []).map(toOferta);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, lastFetched } = getState().ofertas.vendedor;
      return !(status === 'succeeded' && Date.now() - lastFetched < TTL);
    },
  }
);

// POST /api/ofertas
export const crearOferta = createAsyncThunk(
  'ofertas/crear',
  async ({ publicacionId, precioOfertado }, { rejectWithValue }) => {
    try {
      return toOferta(await ofertaService.crear(publicacionId, precioOfertado));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/ofertas/{id}/aceptar (vendedor)
export const aceptarOferta = createAsyncThunk(
  'ofertas/aceptar',
  async (id, { rejectWithValue }) => {
    try {
      await ofertaService.aceptar(id);
      return { id, estado: 'ACEPTADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/ofertas/{id}/rechazar (vendedor)
export const rechazarOferta = createAsyncThunk(
  'ofertas/rechazar',
  async (id, { rejectWithValue }) => {
    try {
      await ofertaService.rechazar(id);
      return { id, estado: 'RECHAZADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/ofertas/{id}/contraofertar (vendedor)
export const contraofertar = createAsyncThunk(
  'ofertas/contraofertar',
  async ({ id, precioContraoferta }, { rejectWithValue }) => {
    try {
      await ofertaService.contraofertar(id, precioContraoferta);
      return { id, estado: 'CONTRAOFERTA_RECIBIDA', precioContraoferta };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/ofertas/{id}/aceptar-contraoferta (comprador)
export const aceptarContraoferta = createAsyncThunk(
  'ofertas/aceptarContraoferta',
  async (id, { rejectWithValue }) => {
    try {
      await ofertaService.aceptarContraoferta(id);
      return { id, estado: 'ACEPTADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/ofertas/{id}/cancelar (comprador)
export const cancelarOferta = createAsyncThunk(
  'ofertas/cancelar',
  async (id, { rejectWithValue }) => {
    try {
      await ofertaService.cancelar(id);
      return { id, estado: 'CANCELADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
