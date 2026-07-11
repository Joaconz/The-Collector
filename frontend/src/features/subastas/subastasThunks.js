import { createAsyncThunk } from '@reduxjs/toolkit';
import { subastaService } from '../../services/subastaService';
import { toPuja, toMisSubasta, toPublicacion } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

const TTL = 5 * 60 * 1000;

// GET /api/publicaciones/{id}/pujas
export const fetchPujas = createAsyncThunk(
  'subastas/fetchPujas',
  async (publicacionId, { rejectWithValue }) => {
    try {
      const list = await subastaService.getPujas(publicacionId);
      return (list || []).map(toPuja);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// POST /api/publicaciones/{id}/pujas
export const registrarPuja = createAsyncThunk(
  'subastas/registrarPuja',
  async ({ publicacionId, monto }, { rejectWithValue }) => {
    try {
      return toPuja(await subastaService.addPuja(publicacionId, monto));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// GET /api/publicaciones/mis-subastas
export const fetchMisSubastas = createAsyncThunk(
  'subastas/fetchMisSubastas',
  async (_, { rejectWithValue }) => {
    try {
      const list = await subastaService.getMisSubastas();
      return (list || []).map(toMisSubasta);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, lastFetched } = getState().subastas.misSubastas;
      return !(status === 'succeeded' && Date.now() - lastFetched < TTL);
    },
  }
);

// POST /api/publicaciones/{id}/cerrar-subasta
export const cerrarSubasta = createAsyncThunk(
  'subastas/cerrar',
  async (publicacionId, { rejectWithValue }) => {
    try {
      return toPublicacion(await subastaService.cerrar(publicacionId));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
