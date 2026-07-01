import { createAsyncThunk } from '@reduxjs/toolkit';
import { favoritoService } from '../../services/favoritoService';
import { toFavorito } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

const TTL = 5 * 60 * 1000;

// GET /api/favoritos
export const fetchFavoritos = createAsyncThunk(
  'favoritos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const list = await favoritoService.getMisFavoritos();
      return (list || []).map(toFavorito);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, lastFetched } = getState().favoritos.lista;
      return !(status === 'succeeded' && Date.now() - lastFetched < TTL);
    },
  }
);

// POST/DELETE /api/favoritos/{publicacionId} según el estado actual.
// Lee el store para decidir si agregar o quitar (toggle).
export const toggleFavorito = createAsyncThunk(
  'favoritos/toggle',
  async (publicacionId, { getState, rejectWithValue }) => {
    const id = Number(publicacionId);
    const yaEsFavorito = getState().favoritos.ids.includes(id);
    try {
      if (yaEsFavorito) {
        await favoritoService.eliminar(id);
        return { id, added: false };
      }
      await favoritoService.agregar(id);
      return { id, added: true };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
