import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import {
  fetchOfertasComprador,
  fetchOfertasVendedor,
  crearOferta,
  aceptarOferta,
  rechazarOferta,
  contraofertar,
  aceptarContraoferta,
  cancelarOferta,
} from './ofertasThunks';

const initialState = {
  comprador: createAsyncSection([]),
  vendedor: createAsyncSection([]),
  mutacion: createAsyncSection(null),
};

// Aplica un cambio de estado/datos a una oferta dentro de una lista.
const patchOferta = (lista, { id, ...cambios }) =>
  lista.map((o) => (o.id === id ? { ...o, ...cambios } : o));

const ofertasSlice = createSlice({
  name: 'ofertas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchOfertasComprador, 'comprador', (state, action) => {
      state.comprador.data = action.payload;
    });
    addAsyncCases(builder, fetchOfertasVendedor, 'vendedor', (state, action) => {
      state.vendedor.data = action.payload;
    });

    // Mutaciones del comprador
    addAsyncCases(builder, aceptarContraoferta, 'mutacion', (state, action) => {
      state.comprador.data = patchOferta(state.comprador.data, action.payload);
    });
    addAsyncCases(builder, cancelarOferta, 'mutacion', (state, action) => {
      state.comprador.data = patchOferta(state.comprador.data, action.payload);
    });
    addAsyncCases(builder, crearOferta, 'mutacion', () => {});

    // Mutaciones del vendedor
    addAsyncCases(builder, aceptarOferta, 'mutacion', (state, action) => {
      state.vendedor.data = patchOferta(state.vendedor.data, action.payload);
    });
    addAsyncCases(builder, rechazarOferta, 'mutacion', (state, action) => {
      state.vendedor.data = patchOferta(state.vendedor.data, action.payload);
    });
    addAsyncCases(builder, contraofertar, 'mutacion', (state, action) => {
      state.vendedor.data = patchOferta(state.vendedor.data, action.payload);
    });
  },
});

// Selectores
export const selectOfertasComprador = (state) => state.ofertas.comprador;
export const selectOfertasVendedor = (state) => state.ofertas.vendedor;
export const selectOfertaMutacion = (state) => state.ofertas.mutacion;

export default ofertasSlice.reducer;
