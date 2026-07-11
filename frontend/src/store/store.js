import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storagePkg from 'redux-persist/lib/storage';

// redux-persist/lib/storage es CommonJS: según cómo el optimizer de Vite resuelva
// el interop, el default puede llegar doble-anidado ({ default: storageReal }).
// Normalizamos para quedarnos siempre con el objeto que expone getItem/setItem.
const storage = typeof storagePkg.getItem === 'function' ? storagePkg : storagePkg.default;

import authReducer from '../features/auth/authSlice';
import publicacionesReducer from '../features/publicaciones/publicacionesSlice';
import favoritosReducer from '../features/favoritos/favoritosSlice';
import ofertasReducer from '../features/ofertas/ofertasSlice';
import reservasReducer from '../features/reservas/reservasSlice';
import subastasReducer from '../features/subastas/subastasSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  publicaciones: publicacionesReducer,
  favoritos: favoritosReducer,
  ofertas: ofertasReducer,
  reservas: reservasReducer,
  subastas: subastasReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  // auth no se persiste aquí: se hidrata desde localStorage en authSlice
  whitelist: ['publicaciones', 'favoritos', 'ofertas', 'reservas', 'subastas'],
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
