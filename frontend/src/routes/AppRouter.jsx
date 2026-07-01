import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/layout/ProtectedRoute';

// Importación de Páginas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CatalogoPage from '../pages/CatalogoPage';
import DetallePiezaPage from '../pages/DetallePiezaPage';
import FavoritosPage from '../pages/FavoritosPage';
import ReservasPage from '../pages/ReservasPage';
import OfertasPage from '../pages/OfertasPage';
import PanelVendedorPage from '../pages/PanelVendedorPage';
import HistorialVentasPage from '../pages/HistorialVentasPage';
import NuevaPublicacionPage from '../pages/NuevaPublicacionPage';
import EditarPublicacionPage from '../pages/EditarPublicacionPage';
import GestionSubastaPage from '../pages/GestionSubastaPage';
import MisSubastasPage from '../pages/MisSubastasPage';
import PerfilPage from '../pages/PerfilPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="/publicaciones/:id" element={<DetallePiezaPage />} />

      {/* Rutas Comprador */}
      <Route path="/favoritos" element={<FavoritosPage />} />
      <Route
        path="/subastas"
        element={
          <ProtectedRoute rol="COMPRADOR">
            <MisSubastasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservas"
        element={
          <ProtectedRoute>
            <ReservasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ofertas"
        element={
          <ProtectedRoute>
            <OfertasPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas Vendedor */}
      <Route
        path="/vendedor"
        element={
          <ProtectedRoute rol="VENDEDOR">
            <PanelVendedorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor/historial"
        element={
          <ProtectedRoute rol="VENDEDOR">
            <HistorialVentasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor/nueva"
        element={
          <ProtectedRoute rol="VENDEDOR">
            <NuevaPublicacionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor/:id/editar"
        element={
          <ProtectedRoute rol="VENDEDOR">
            <EditarPublicacionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor/:id/subasta"
        element={
          <ProtectedRoute rol="VENDEDOR">
            <GestionSubastaPage />
          </ProtectedRoute>
        }
      />

      {/* Perfil + Captura Todo */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
