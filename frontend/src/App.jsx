import React, { useState } from 'react';
import PageLayout from './components/layout/PageLayout';
import AppRouter from './routes/AppRouter';
import {
  mockUsuarios,
  getFavoritos,
  toggleFavorito,
  getReservas,
  addReserva,
  getOfertas,
  addOferta,
  updateOfertaEstado,
  getPujas,
  addPuja
} from './data/mockData';

function App() {
  // Inicializamos el usuario actual con el Comprador Joaquín para simplificar el flujo inicial
  const [currentUser, setCurrentUser] = useState(mockUsuarios[0]);
  
  // Estados para simular la persistencia reactiva durante la sesión de navegación
  const [favoritos, setFavoritos] = useState([1, 3, 5]); // IDs correspondientes a mockFavoritos
  const [reservas, setReservas] = useState(getReservas());
  const [ofertas, setOfertas] = useState(getOfertas());
  const [pujas, setPujas] = useState(getPujas());

  // Manejador de Login
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  // Manejador de Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Manejador de Favoritos (Deseos/Carrito)
  const handleToggleFavorito = (id) => {
    const pId = parseInt(id);
    let updated;
    if (favoritos.includes(pId)) {
      updated = favoritos.filter(f => f !== pId);
    } else {
      updated = [...favoritos, pId];
    }
    setFavoritos(updated);
  };

  // Manejador de Reservas
  const handleAddReserva = (piezaId, precioAcordado, vendedor) => {
    const newRes = addReserva({
      piezaId,
      precioAcordado,
      vendedor,
      tipo: "Adquisición Directa"
    });
    setReservas([...getReservas()]);
    return newRes;
  };

  // Manejador de Ofertas
  const handleAddOferta = (piezaId, precioOriginal, precioOfertado, vendedor) => {
    const newOf = addOferta({
      piezaId,
      precioOriginal,
      precioOfertado,
      vendedor
    });
    setOfertas([...getOfertas()]);
    return newOf;
  };

  // Actualizar estado de una Oferta (aceptar/contraofertar)
  const handleUpdateOfertaEstado = (id, nuevoEstado) => {
    updateOfertaEstado(id, nuevoEstado);
    setOfertas([...getOfertas()]);
    setReservas([...getReservas()]); // Si fue aceptada, se crea una reserva
  };

  // Registrar puja en subasta
  const handleAddPuja = (monto) => {
    addPuja(monto);
    setPujas([...getPujas()]);
  };

  return (
    <PageLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      favoritosCount={favoritos.length}
    >
      <AppRouter
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        favoritos={favoritos}
        onToggleFavorito={handleToggleFavorito}
        reservas={reservas}
        onAddReserva={handleAddReserva}
        ofertas={ofertas}
        onAddOferta={handleAddOferta}
        onUpdateOfertaEstado={handleUpdateOfertaEstado}
        pujas={pujas}
        onAddPuja={handleAddPuja}
      />
    </PageLayout>
  );
}

export default App;
