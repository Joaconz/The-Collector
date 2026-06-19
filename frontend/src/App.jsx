import React, { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import PageLayout from './components/layout/PageLayout';
import AppRouter from './routes/AppRouter';
import { authService } from './services/authService';
import { favoritoService } from './services/favoritoService';
import { toFavorito } from './utils/adapters';

function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [favoritos, setFavoritos] = useState([]);

  const cargarFavoritos = useCallback(async () => {
    if (!currentUser || currentUser.rol !== 'COMPRADOR') {
      setFavoritos([]);
      return;
    }
    try {
      const data = await favoritoService.getMisFavoritos();
      setFavoritos((data || []).map((dto) => toFavorito(dto).id));
    } catch {
      setFavoritos([]);
    }
  }, [currentUser]);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  const handleLogin = (auth) => {
    setCurrentUser(auth);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setFavoritos([]);
  };

  const handleToggleFavorito = async (id) => {
    const pId = Number(id);

    if (!currentUser || currentUser.rol !== 'COMPRADOR') {
      toast.error('Inicie sesión como coleccionista para guardar favoritos.');
      return;
    }

    try {
      if (favoritos.includes(pId)) {
        await favoritoService.eliminar(pId);
        setFavoritos((prev) => prev.filter((f) => f !== pId));
      } else {
        await favoritoService.agregar(pId);
        setFavoritos((prev) => [...prev, pId]);
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar sus favoritos.');
    }
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
      <PageLayout currentUser={currentUser} onLogout={handleLogout} favoritosCount={favoritos.length}>
        <AppRouter
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          favoritos={favoritos}
          onToggleFavorito={handleToggleFavorito}
        />
      </PageLayout>
    </>
  );
}

export default App;
