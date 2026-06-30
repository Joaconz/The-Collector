import { createSlice } from '@reduxjs/toolkit';
import { createAsyncSection, addAsyncCases } from '../shared/asyncState';
import { logout } from '../auth/authSlice';
import {
  fetchCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  checkoutCarrito,
} from './carritoThunks';

const initialState = {
  items: createAsyncSection([]),
  mutacion: createAsyncSection(null),
};

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchCarrito, 'items', (state, action) => {
      state.items.data = action.payload;
    });
    addAsyncCases(builder, agregarAlCarrito, 'mutacion', (state, action) => {
      state.items.data = action.payload;
    });
    addAsyncCases(builder, quitarDelCarrito, 'mutacion', (state, action) => {
      state.items.data = state.items.data.filter((i) => i.piezaId !== action.payload);
    });
    addAsyncCases(builder, checkoutCarrito, 'mutacion', (state) => {
      state.items.data = [];
    });

    builder.addCase(logout, (state) => {
      state.items = createAsyncSection([]);
      state.mutacion = createAsyncSection(null);
    });
  },
});

// Selectores
export const selectCarritoItems = (state) => state.carrito.items;
export const selectCarritoCount = (state) => state.carrito.items.data.length;

export default carritoSlice.reducer;
