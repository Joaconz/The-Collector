import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { toRejectedPayload } from '../shared/asyncState';

// POST /api/auth/login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authService.login(email, password);
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);

// POST /api/auth/register
export const register = createAsyncThunk(
  'auth/register',
  async ({ nombre, email, password, rol }, { rejectWithValue }) => {
    try {
      return await authService.register({ nombre, email, password, rol });
    } catch (err) {
      return rejectWithValue(toRejectedPayload(err));
    }
  }
);
