import { createAsyncThunk } from '@reduxjs/toolkit';
import { subastaService } from '../../services/subastaService';
import { toPuja } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

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

// POST /api/publicaciones/{id}/cerrar-subasta
export const cerrarSubasta = createAsyncThunk(
  'subastas/cerrar',
  async (publicacionId, { rejectWithValue }) => {
    try {
      await subastaService.cerrar(publicacionId);
      return publicacionId;
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
