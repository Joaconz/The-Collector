import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import {
  fetchCatalogo,
  fetchPublicacionById,
  fetchMisPublicaciones,
  createPublicacion,
  updatePublicacion,
  updateEstadoPublicacion,
  deletePublicacion,
} from './publicacionesThunks';

const initialState = {
  catalogo: createAsyncSection([]), // lista pública
  detalle: createAsyncSection(null), // pieza individual
  mias: createAsyncSection([]), // publicaciones del vendedor
  mutacion: createAsyncSection(null), // create / update / delete
};

const publicacionesSlice = createSlice({
  name: 'publicaciones',
  initialState,
  reducers: {
    limpiarDetalle(state) {
      state.detalle = createAsyncSection(null);
    },
    resetMutacion(state) {
      state.mutacion = createAsyncSection(null);
    },
  },
  extraReducers: (builder) => {
    // Lecturas (GET)
    addAsyncCases(builder, fetchCatalogo, 'catalogo', (state, action) => {
      state.catalogo.data = action.payload;
    });
    addAsyncCases(builder, fetchPublicacionById, 'detalle', (state, action) => {
      state.detalle.data = action.payload;
    });
    addAsyncCases(builder, fetchMisPublicaciones, 'mias', (state, action) => {
      state.mias.data = action.payload;
    });

    // Mutaciones (POST / PUT / PATCH / DELETE) comparten la sección `mutacion`
    addAsyncCases(builder, createPublicacion, 'mutacion', (state, action) => {
      state.mias.data.unshift(action.payload);
    });
    addAsyncCases(builder, updatePublicacion, 'mutacion', (state, action) => {
      const updated = action.payload;
      state.mias.data = state.mias.data.map((p) => (p.id === updated.id ? updated : p));
      if (state.detalle.data?.id === updated.id) state.detalle.data = updated;
    });
    addAsyncCases(builder, updateEstadoPublicacion, 'mutacion', (state, action) => {
      const updated = action.payload;
      state.mias.data = state.mias.data.map((p) => (p.id === updated.id ? updated : p));
      if (state.detalle.data?.id === updated.id) state.detalle.data = updated;
    });
    addAsyncCases(builder, deletePublicacion, 'mutacion', (state, action) => {
      state.mias.data = state.mias.data.filter((p) => p.id !== action.payload);
    });
  },
});

export const { limpiarDetalle, resetMutacion } = publicacionesSlice.actions;

// Selectores
export const selectCatalogo = (state) => state.publicaciones.catalogo;
export const selectDetalle = (state) => state.publicaciones.detalle;
export const selectMisPublicaciones = (state) => state.publicaciones.mias;
export const selectPublicacionMutacion = (state) => state.publicaciones.mutacion;

export default publicacionesSlice.reducer;
