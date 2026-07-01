import { createAsyncThunk } from '@reduxjs/toolkit';
import { publicacionService } from '../../services/publicacionService';
import { toPublicacion } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

// GET /api/publicaciones (catálogo paginado) → devuelve lista adaptada
export const fetchCatalogo = createAsyncThunk(
  'publicaciones/fetchCatalogo',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      const res = await publicacionService.getCatalogo(filtros);
      return (res?.content || []).map(toPublicacion);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// GET /api/publicaciones/{id}
export const fetchPublicacionById = createAsyncThunk(
  'publicaciones/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return toPublicacion(await publicacionService.getById(id));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

const TTL = 5 * 60 * 1000;

// GET /api/publicaciones/mias
export const fetchMisPublicaciones = createAsyncThunk(
  'publicaciones/fetchMias',
  async (_, { rejectWithValue }) => {
    try {
      const list = await publicacionService.getMisPublicaciones();
      return (list || []).map(toPublicacion);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, lastFetched } = getState().publicaciones.mias;
      return !(status === 'succeeded' && Date.now() - lastFetched < TTL);
    },
  }
);

// POST /api/publicaciones
export const createPublicacion = createAsyncThunk(
  'publicaciones/create',
  async (request, { rejectWithValue }) => {
    try {
      return toPublicacion(await publicacionService.create(request));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PUT /api/publicaciones/{id}
export const updatePublicacion = createAsyncThunk(
  'publicaciones/update',
  async ({ id, request }, { rejectWithValue }) => {
    try {
      return toPublicacion(await publicacionService.update(id, request));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/publicaciones/{id}/estado
export const updateEstadoPublicacion = createAsyncThunk(
  'publicaciones/updateEstado',
  async ({ id, estado }, { rejectWithValue }) => {
    try {
      return toPublicacion(await publicacionService.updateEstado(id, estado));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// DELETE /api/publicaciones/{id}
export const deletePublicacion = createAsyncThunk(
  'publicaciones/delete',
  async (id, { rejectWithValue }) => {
    try {
      await publicacionService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
