import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import NuevaPublicacionPage from '../pages/NuevaPublicacionPage';
import EditarPublicacionPage from '../pages/EditarPublicacionPage';
import GestionSubastaPage from '../pages/GestionSubastaPage';
import PerfilPage from '../pages/PerfilPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = ({
  currentUser,
  onLogin,
  onLogout,
  favoritos,
  onToggleFavorito,
  reservas,
  onAddReserva,
  ofertas,
  onAddOferta,
  onUpdateOfertaEstado,
  pujas,
  onAddPuja
}) => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage onLogin={onLogin} currentUser={currentUser} />} />
      <Route path="/register" element={<RegisterPage onLogin={onLogin} currentUser={currentUser} />} />
      <Route path="/catalogo" element={<CatalogoPage favoritos={favoritos} onToggleFavorito={onToggleFavorito} />} />
      <Route
        path="/publicaciones/:id"
        element={
          <DetallePiezaPage
            currentUser={currentUser}
            favoritos={favoritos}
            onToggleFavorito={onToggleFavorito}
            onAddReserva={onAddReserva}
            onAddOferta={onAddOferta}
            pujas={pujas}
            onAddPuja={onAddPuja}
          />
        }
      />

      {/* Rutas Comprador (Protección visual opcional, con redirección simple en base a mock) */}
      <Route
        path="/favoritos"
        element={
          <FavoritosPage
            favoritos={favoritos}
            onToggleFavorito={onToggleFavorito}
          />
        }
      />
      <Route
        path="/reservas"
        element={
          currentUser ? (
            <ReservasPage reservas={reservas} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/ofertas"
        element={
          currentUser ? (
            <OfertasPage
              ofertas={ofertas}
              onUpdateOfertaEstado={onUpdateOfertaEstado}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rutas Vendedor */}
      <Route
        path="/vendedor"
        element={
          currentUser && currentUser.rol === 'VENDEDOR' ? (
            <PanelVendedorPage
              reservas={reservas}
              ofertas={ofertas}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/vendedor/nueva"
        element={
          currentUser && currentUser.rol === 'VENDEDOR' ? (
            <NuevaPublicacionPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/vendedor/:id/editar"
        element={
          currentUser && currentUser.rol === 'VENDEDOR' ? (
            <EditarPublicacionPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/vendedor/:id/subasta"
        element={
          currentUser && currentUser.rol === 'VENDEDOR' ? (
            <GestionSubastaPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Perfil + Captura Todo */}
      <Route
        path="/perfil"
        element={
          currentUser ? (
            <PerfilPage currentUser={currentUser} onLogin={onLogin} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
