import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import publicacionesReducer from '../features/publicaciones/publicacionesSlice';
import favoritosReducer from '../features/favoritos/favoritosSlice';
import ofertasReducer from '../features/ofertas/ofertasSlice';
import reservasReducer from '../features/reservas/reservasSlice';
import subastasReducer from '../features/subastas/subastasSlice';
import carritoReducer from '../features/carrito/carritoSlice';

// Store central de la app. Cada slice vive en su dominio (/features/<dominio>).
export const store = configureStore({
  reducer: {
    auth: authReducer,
    publicaciones: publicacionesReducer,
    favoritos: favoritosReducer,
    ofertas: ofertasReducer,
    reservas: reservasReducer,
    subastas: subastasReducer,
    carrito: carritoReducer,
  },
});

export default store;
