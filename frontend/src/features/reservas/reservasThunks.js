import { createAsyncThunk } from '@reduxjs/toolkit';
import { reservaService } from '../../services/reservaService';
import { toReserva } from '../../utils/adapters';
import { toRejectedPayload } from '../shared/asyncState';

// GET /api/reservas/comprador
export const fetchReservasComprador = createAsyncThunk(
  'reservas/fetchComprador',
  async (_, { rejectWithValue }) => {
    try {
      const list = await reservaService.getMisReservasComprador();
      return (list || []).map(toReserva);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// GET /api/reservas/vendedor
export const fetchReservasVendedor = createAsyncThunk(
  'reservas/fetchVendedor',
  async (_, { rejectWithValue }) => {
    try {
      const list = await reservaService.getMisReservasVendedor();
      return (list || []).map(toReserva);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// POST /api/reservas
export const crearReserva = createAsyncThunk(
  'reservas/crear',
  async (publicacionId, { rejectWithValue }) => {
    try {
      return toReserva(await reservaService.crear(publicacionId));
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/reservas/{id}/confirmar (vendedor)
export const confirmarReserva = createAsyncThunk(
  'reservas/confirmar',
  async (id, { rejectWithValue }) => {
    try {
      await reservaService.confirmar(id);
      return { id, estado: 'CONFIRMADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/reservas/{id}/rechazar (vendedor)
export const rechazarReserva = createAsyncThunk(
  'reservas/rechazar',
  async (id, { rejectWithValue }) => {
    try {
      await reservaService.rechazar(id);
      return { id, estado: 'RECHAZADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// PATCH /api/reservas/{id}/cancelar (comprador)
export const cancelarReserva = createAsyncThunk(
  'reservas/cancelar',
  async (id, { rejectWithValue }) => {
    try {
      await reservaService.cancelar(id);
      return { id, estado: 'CANCELADA' };
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
