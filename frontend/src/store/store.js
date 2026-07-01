import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../features/auth/authSlice';
import publicacionesReducer from '../features/publicaciones/publicacionesSlice';
import favoritosReducer from '../features/favoritos/favoritosSlice';
import ofertasReducer from '../features/ofertas/ofertasSlice';
import reservasReducer from '../features/reservas/reservasSlice';
import subastasReducer from '../features/subastas/subastasSlice';
import carritoReducer from '../features/carrito/carritoSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  publicaciones: publicacionesReducer,
  favoritos: favoritosReducer,
  ofertas: ofertasReducer,
  reservas: reservasReducer,
  subastas: subastasReducer,
  carrito: carritoReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // auth no se persiste aquí: se hidrata desde localStorage en authSlice
  whitelist: ['publicaciones', 'favoritos', 'ofertas', 'reservas', 'subastas', 'carrito'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
