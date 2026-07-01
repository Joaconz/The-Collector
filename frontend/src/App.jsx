import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import PageLayout from './components/layout/PageLayout';
import AppRouter from './routes/AppRouter';
import { selectCurrentUser } from './features/auth/authSlice';
import { fetchFavoritos } from './features/favoritos/favoritosThunks';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // Carga los favoritos del coleccionista cuando hay sesión activa.
  useEffect(() => {
    if (currentUser?.rol === 'COMPRADOR') {
      dispatch(fetchFavoritos());
    }
  }, [dispatch, currentUser]);

  return (
    <>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
      <PageLayout>
        <AppRouter />
      </PageLayout>
    </>
  );
}

export default App;
