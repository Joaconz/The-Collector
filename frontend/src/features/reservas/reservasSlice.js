import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import {
  fetchReservasComprador,
  fetchReservasVendedor,
  crearReserva,
  confirmarReserva,
  rechazarReserva,
  cancelarReserva,
} from './reservasThunks';

const initialState = {
  comprador: createAsyncSection([]),
  vendedor: createAsyncSection([]),
  mutacion: createAsyncSection(null),
};

const patchReserva = (lista, { id, ...cambios }) =>
  lista.map((r) => (r.id === id ? { ...r, ...cambios } : r));

const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchReservasComprador, 'comprador', (state, action) => {
      state.comprador.data = action.payload;
    });
    addAsyncCases(builder, fetchReservasVendedor, 'vendedor', (state, action) => {
      state.vendedor.data = action.payload;
    });

    // Comprador
    addAsyncCases(builder, crearReserva, 'mutacion', () => {});
    addAsyncCases(builder, cancelarReserva, 'mutacion', (state, action) => {
      state.comprador.data = patchReserva(state.comprador.data, action.payload);
    });

    // Vendedor
    addAsyncCases(builder, confirmarReserva, 'mutacion', (state, action) => {
      state.vendedor.data = patchReserva(state.vendedor.data, action.payload);
    });
    addAsyncCases(builder, rechazarReserva, 'mutacion', (state, action) => {
      state.vendedor.data = patchReserva(state.vendedor.data, action.payload);
    });
  },
});

// Selectores
export const selectReservasComprador = (state) => state.reservas.comprador;
export const selectReservasVendedor = (state) => state.reservas.vendedor;
export const selectReservaMutacion = (state) => state.reservas.mutacion;

export default reservasSlice.reducer;
