import { createAsyncThunk } from '@reduxjs/toolkit';
import { carritoService } from '../../services/carritoService';
import { toCarritoItem } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

// GET /api/carrito
export const fetchCarrito = createAsyncThunk(
  'carrito/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const list = await carritoService.getMiCarrito();
      return (list || []).map(toCarritoItem);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// POST /api/carrito/{publicacionId}
export const agregarAlCarrito = createAsyncThunk(
  'carrito/agregar',
  async (publicacionId, { rejectWithValue }) => {
    try {
      await carritoService.agregar(publicacionId);
      const list = await carritoService.getMiCarrito();
      return (list || []).map(toCarritoItem);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// DELETE /api/carrito/{publicacionId}
export const quitarDelCarrito = createAsyncThunk(
  'carrito/quitar',
  async (publicacionId, { rejectWithValue }) => {
    try {
      await carritoService.quitar(publicacionId);
      return Number(publicacionId);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// POST /api/carrito/checkout
export const checkoutCarrito = createAsyncThunk(
  'carrito/checkout',
  async (_, { rejectWithValue }) => {
    try {
      return await carritoService.checkout();
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
