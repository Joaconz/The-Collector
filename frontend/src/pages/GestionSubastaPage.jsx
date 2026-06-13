import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getPublicacionById, getPujas, addPuja, resetPujas } from '../data/mockData';

const GestionSubastaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pub, setPub] = useState(null);
  const [pujasLog, setPujasLog] = useState([]);

  // Entrada para simulador de pujas del sistema (para demostrar reactividad de manera ultra inmersiva)
  const [simuladorMonto, setSimuladorMonto] = useState('');

  useEffect(() => {
    const item = getPublicacionById(id);
    if (item) {
      setPub(item);
      setPujasLog(getPujas());
      // Sugerir siguiente puja
      const base = item.pujaActual || item.precioBase;
      setSimuladorMonto(base + item.incrementoMinimo);
    }
  }, [id]);

  if (!pub) {
    return (
      <div className="py-24 px-6 text-center max-w-md mx-auto flex flex-col items-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-error font-light">warning</span>
        <h2 className="font-headline-sm text-white uppercase tracking-wider">SUBASTA NO ENCONTRADA</h2>
        <p className="font-body-sm text-on-surface-variant">La sala de subasta solicitada no se encuentra activa en los servidores.</p>
        <Link to="/vendedor">
          <Button variant="outline">VOLVER AL PANEL</Button>
        </Link>
      </div>
    );
  }

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSimularPuja = (e) => {
    e.preventDefault();
    const monto = parseFloat(simuladorMonto);
    const precioReferencia = pub.pujaActual || pub.precioBase;

    if (isNaN(monto) || monto <= precioReferencia) {
      alert(`La puja simulada debe ser superior al precio líder de ${formatCurrency(precioReferencia)} USD.`);
      return;
    }

    // Insertar puja mock
    const usuariosSimulados = ['PrestigeArt', 'Coleccionista_GVA', 'NumisLover', 'Vicent_M'];
    const randomUser = usuariosSimulados[Math.floor(Math.random() * usuariosSimulados.length)];

    addPuja(monto, randomUser);
    setPujasLog(getPujas());

    // Actualizar estado local de la publicación
    setPub({
      ...pub,
      pujaActual: monto
    });

    setSimuladorMonto(monto + pub.incrementoMinimo);
  };

  const handleCerrarSubasta = () => {
    const lider = pujasLog[0];
    if (lider) {
      alert(`¡SUBASTA FINALIZADA EXITOSAMENTE!\n\nLa pieza '${pub.nombre}' ha sido adjudicada a: ${lider.usuario} por un valor de ${formatCurrency(lider.monto)} USD.\nSe ha generado la transferencia de procedencia.`);
    } else {
      alert('Subasta finalizada sin postores. La pieza volverá a depósito.');
    }

    // Restablecer pujas mock para la siguiente simulación si es necesario
    resetPujas();
    navigate('/vendedor');
  };

  return (
    <div className="w-full bg-background min-h-screen py-10 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-10 text-left">

        {/* Header Sala en Vivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/35 pb-5 gap-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/vendedor"
              className="font-label-caps text-[9px] text-on-surface-variant/75 hover:text-primary tracking-widest flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm font-light">arrow_back</span>
              <span>VOLVER AL PANEL DE VENDEDOR</span>
            </Link>
            <h1 className="font-headline-sm text-white uppercase tracking-wider mt-2 flex items-center space-x-3">
              <span>SALA DE SUBASTAS EN VIVO</span>
              <span className="inline-flex items-center space-x-1 font-label-caps text-[9px] bg-error-container/20 text-error border border-error/30 px-2 py-0.5 animate-pulse-subtle">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping" />
                <span>SUBASTA EN DIRECTO</span>
              </span>
            </h1>
          </div>

          <span className="font-label-caps text-on-surface-variant text-[10px] tracking-wider bg-surface-container border border-outline-variant py-1.5 px-3">
            LOTE: #{pub.ref}
          </span>
        </div>

        {/* Layout Principal 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Lado Izquierdo: Ficha del Lote (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="w-full aspect-[16/10] bg-black border border-outline-variant/30 overflow-hidden relative">
              <img src={pub.imagenUrl} alt={pub.nombre} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <h2 className="font-headline-md text-white">{pub.nombre}</h2>
              <p className="font-body-md text-on-surface-variant/80">{pub.descripcion}</p>

              {/* Tabla de especificaciones */}
              <div className="border border-outline-variant/20 bg-surface-container/10 flex flex-col pt-2">
                {Object.entries(pub.especificaciones || {}).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-3 border-b border-outline-variant/10 text-xs font-body-sm">
                    <span className="font-label-caps text-on-surface-variant/60 text-[9px] tracking-wider">{key}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Monitor de Pujas & Simulador (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">

            {/* Monitor de Puja Actual */}
            <div className="bg-surface-container border border-outline-variant/60 p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-on-surface-variant text-[9px] tracking-widest">PUJA MÁS ALTA</span>
                <span className="font-label-caps text-error text-[9px] tracking-widest font-bold animate-pulse">LÍDER ACTUAL</span>
              </div>

              <div className="font-display text-4xl md:text-5xl font-bold text-primary tracking-wide">
                {formatCurrency(pub.pujaActual || pub.precioBase)}
              </div>

              <div className="flex justify-between items-center text-xs pt-4 border-t border-outline-variant/20 font-body-sm text-on-surface-variant/70">
                <span>Postor Líder: <strong className="text-white">{pujasLog[0]?.usuario || 'Sin pujas'}</strong></span>
                <span className="flex items-center space-x-1 text-error font-semibold">
                  <span className="material-symbols-outlined text-sm font-light">schedule</span>
                  <span>Cierre en 12h</span>
                </span>
              </div>
            </div>

            {/* Simulador de Puja para demostrar interactividad */}
            <div className="bg-surface-container-high/30 border border-outline-variant/30 p-5 flex flex-col space-y-4 text-left">
              <span className="font-label-caps text-primary text-[9px] tracking-widest font-bold">
                SIMULADOR DE SALA (HERRAMIENTA EVALUACIÓN)
              </span>
              <form onSubmit={handleSimularPuja} className="flex space-x-3">
                <div className="flex-grow flex bg-background border border-outline-variant/50 py-1.5 px-3">
                  <span className="text-on-surface-variant/50 mr-1 font-body-sm">$</span>
                  <input
                    type="number"
                    value={simuladorMonto}
                    onChange={(e) => setSimuladorMonto(e.target.value)}
                    placeholder="Monto puja simulada"
                    className="bg-transparent border-none text-on-surface font-body-sm w-full focus:outline-none focus:ring-0 p-0 text-sm"
                  />
                </div>
                <Button type="submit" variant="outline" className="py-2 px-4 text-[9px]">
                  SIMULAR PUJA
                </Button>
              </form>
              <p className="font-body-sm text-[9px] text-on-surface-variant/40 leading-normal">
                Use este panel para inyectar una puja externa al sistema. La consola recalculará dinámicamente el precio de puja líder y actualizará la bitácora inferior.
              </p>
            </div>

            {/* Bitácora de Pujas en Vivo */}
            <div className="flex flex-col space-y-3">
              <span className="font-label-caps text-[9px] text-on-surface-variant tracking-wider font-bold">
                HISTORIAL DE PUJAS EN LA SALA
              </span>

              <div className="border border-outline-variant/30 bg-surface-container/20 max-h-56 overflow-y-auto flex flex-col divide-y divide-outline-variant/10">
                {pujasLog.map((bid) => (
                  <div key={bid.id} className="p-3.5 flex justify-between items-center text-xs font-body-sm">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-outline-variant/80 text-sm font-light">account_balance_wallet</span>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{bid.usuario}</span>
                        <span className="font-body-sm text-[9px] text-on-surface-variant/50 mt-0.5">{bid.fecha}</span>
                      </div>
                    </div>
                    <span className="font-body-sm text-sm font-semibold text-primary">
                      {formatCurrency(bid.monto)} USD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cerrar Subasta */}
            <div className="pt-4">
              <Button
                variant="danger"
                fullWidth
                onClick={handleCerrarSubasta}
                className="py-4 font-bold"
              >
                CERRAR SALA
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GestionSubastaPage;
