import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import { fetchPujas, registrarPuja, cerrarSubasta, fetchMisSubastas } from './subastasThunks';

const initialState = {
  pujas: createAsyncSection([]),
  misSubastas: createAsyncSection([]),
  mutacion: createAsyncSection(null),
};

const subastasSlice = createSlice({
  name: 'subastas',
  initialState,
  reducers: {
    limpiarPujas(state) {
      state.pujas = createAsyncSection([]);
    },
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchPujas, 'pujas', (state, action) => {
      state.pujas.data = action.payload;
    });
    addAsyncCases(builder, fetchMisSubastas, 'misSubastas', (state, action) => {
      state.misSubastas.data = action.payload;
    });
    // Una puja nueva queda como líder al tope de la bitácora.
    addAsyncCases(builder, registrarPuja, 'mutacion', (state, action) => {
      if (action.payload) state.pujas.data.unshift(action.payload);
      // La nueva puja puede cambiar la posición del usuario (líder/superado)
      // en "Mis Subastas"; no tenemos acá el objeto MisSubasta completo para
      // parchearlo, así que invalidamos la caché para forzar un fetch fresco.
      state.misSubastas.status = 'idle';
    });
    addAsyncCases(builder, cerrarSubasta, 'mutacion', () => {});
  },
});

export const { limpiarPujas } = subastasSlice.actions;

// Selectores
export const selectPujas = (state) => state.subastas.pujas;
export const selectMisSubastas = (state) => state.subastas.misSubastas;
export const selectSubastaMutacion = (state) => state.subastas.mutacion;

export default subastasSlice.reducer;
