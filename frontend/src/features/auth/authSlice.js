import { createSlice } from '@reduxjs/toolkit';
import { getStoredAuth, clearStoredAuth } from '../../services/api';
import { authService } from '../../services/authService';
import { login, register } from './authThunks';

// El usuario se hidrata desde localStorage para mantener la sesión entre recargas.
const initialState = {
  user: getStoredAuth(),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      clearStoredAuth();
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login / register comparten el mismo manejo de estados
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { status: null, message: action.error?.message };
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { status: null, message: action.error?.message };
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectores
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsVendedor = (state) => state.auth.user?.rol === 'VENDEDOR';
export const selectIsComprador = (state) => state.auth.user?.rol === 'COMPRADOR';

export default authSlice.reducer;
