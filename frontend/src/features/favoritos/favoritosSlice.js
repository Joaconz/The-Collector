import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import { logout } from '../auth/authSlice';
import { fetchFavoritos, toggleFavorito } from './favoritosThunks';

const initialState = {
  // ids de publicaciones favoritas: usados por el toggle en catálogo y detalle
  ids: [],
  // objetos completos de favoritos (para la página "Lista de deseos")
  lista: createAsyncSection([]),
};

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchFavoritos, 'lista', (state, action) => {
      state.lista.data = action.payload;
      state.ids = action.payload.map((f) => f.id);
    });

    builder
      .addCase(toggleFavorito.fulfilled, (state, action) => {
        const { id, added } = action.payload;
        if (added) {
          if (!state.ids.includes(id)) state.ids.push(id);
        } else {
          state.ids = state.ids.filter((favId) => favId !== id);
          state.lista.data = state.lista.data.filter((f) => f.id !== id);
        }
      })
      // al cerrar sesión se limpia la bóveda local
      .addCase(logout, (state) => {
        state.ids = [];
        state.lista = createAsyncSection([]);
      });
  },
});

// Selectores
export const selectFavoritoIds = (state) => state.favoritos.ids;
export const selectFavoritosLista = (state) => state.favoritos.lista;
export const selectEsFavorito = (id) => (state) => state.favoritos.ids.includes(Number(id));

export default favoritosSlice.reducer;
