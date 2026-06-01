import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import NegociarModal from '../components/forms/NegociarModal';
import {
  getVendedorPublicaciones,
  ESTADO_PUBLICACION,
  getReservas,
  getOfertas,
  getPublicacionById
} from '../data/mockData';

const PanelVendedorPage = ({ onResponderOferta }) => {
  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const [solicitudesReserva, setSolicitudesReserva] = useState([]);
  const [ofertasRecibidas, setOfertasRecibidas] = useState([]);

  // Estado del modal de negociación (seller side)
  const [negociarModal, setNegociarModal] = useState({ isOpen: false, oferta: null });

  // Estado del modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    details: [],
    confirmText: 'CONFIRMAR',
    cancelText: 'CANCELAR',
    icon: 'verified',
    variant: 'success',
    onConfirm: null,
  });
  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    // Sincronizar mis publicaciones de "Aura Dolce Galería"
    setMisPublicaciones(getVendedorPublicaciones());

    // Reservas de piezas del vendedor que están pendientes
    const todasRes = getReservas();
    const pendRes = todasRes.filter(r => {
      const pieza = getPublicacionById(r.piezaId);
      return pieza && pieza.vendedor === 'Aura Dolce Galería' && r.estado === 'PENDIENTE';
    });
    setSolicitudesReserva(pendRes);

    // Ofertas privadas activas en revisión
    const todasOf = getOfertas();
    const pendOf = todasOf.filter(o => {
      const pieza = getPublicacionById(o.piezaId);
      return pieza && pieza.vendedor === 'Aura Dolce Galería' && o.estado === 'EN_REVISION';
    });
    setOfertasRecibidas(pendOf);
  }, []);

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleConfirmarReserva = (resId, piezaNombre, precio) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Reserva',
      description: 'Al confirmar, se descontará el stock de la pieza y se notificará al comprador.',
      details: [
        { label: 'PIEZA', value: piezaNombre },
        { label: 'PRECIO ACORDADO', value: `${formatCurrency(precio)} USD` },
        { label: 'ACCIÓN', value: 'Confirmar adquisición' },
      ],
      confirmText: 'CONFIRMAR RESERVA',
      cancelText: 'CANCELAR',
      icon: 'check_circle',
      variant: 'success',
      onConfirm: () => {
        setSolicitudesReserva((prev) => prev.filter((r) => r.id !== resId));
        closeConfirmModal();
      },
    });
  };

  const handleRechazarReserva = (resId, piezaNombre) => {
    setConfirmModal({
      isOpen: true,
      title: 'Rechazar Reserva',
      description: 'Al rechazar, la pieza volverá a estar disponible en el catálogo y se notificará al comprador.',
      details: [
        { label: 'PIEZA', value: piezaNombre },
        { label: 'ACCIÓN', value: 'Rechazar y liberar stock' },
      ],
      confirmText: 'RECHAZAR RESERVA',
      cancelText: 'CANCELAR',
      icon: 'cancel',
      variant: 'danger',
      onConfirm: () => {
        setSolicitudesReserva((prev) => prev.filter((r) => r.id !== resId));
        closeConfirmModal();
      },
    });
  };

  const handleResponderOferta = (ofId) => {
    const oferta = ofertasRecibidas.find(o => o.id === ofId);
    if (oferta) setNegociarModal({ isOpen: true, oferta });
  };

  const handleNegociarConfirm = ({ accion, montoContraoferta }) => {
    onResponderOferta(negociarModal.oferta.id, accion, montoContraoferta);
    setOfertasRecibidas(prev => prev.filter(o => o.id !== negociarModal.oferta.id));
    setNegociarModal({ isOpen: false, oferta: null });
    if (accion === 'ACEPTAR') toast.success('Oferta aceptada. Reserva confirmada.');
    else if (accion === 'RECHAZAR') toast.info('Propuesta rechazada y notificada al comprador.');
    else toast.success('Contraoferta enviada. El comprador tiene 24h para responder.');
  };

  return (
    <>
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant/35 pb-6">
          <div className="text-left flex flex-col space-y-2">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
              ÁREA CORPORATIVA
            </span>
            <h1 className="font-headline-md text-white uppercase tracking-wider">
              PANEL DE CONTROL
            </h1>
            <p className="font-body-sm text-on-surface-variant">
              GESTIONE SUS CONSIGNACIONES, EVALÚE OFERTAS PRIVADAS Y SUPERVISE SALAS DE SUBASTA EN VIVO.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <Link to="/vendedor/historial">
              <Button variant="outline" className="py-3.5 px-5 flex items-center space-x-2">
                <span className="material-symbols-outlined text-sm font-light">bar_chart_4_bars</span>
                <span>HISTORIAL</span>
              </Button>
            </Link>
            <Link to="/vendedor/nueva">
              <Button variant="primary" className="py-3.5 px-6">
                + NUEVA PUBLICACIÓN
              </Button>
            </Link>
          </div>
        </div>

        {/* Notificaciones de Acción (Reservas y Ofertas Pendientes) */}
        {(solicitudesReserva.length > 0 || ofertasRecibidas.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Solicitudes de Reserva */}
            {solicitudesReserva.length > 0 && (
              <div className="flex flex-col space-y-4 text-left">
                <h3 className="font-label-caps text-primary text-[11px] tracking-[0.2em] font-bold">
                  SOLICITUDES DE RESERVA DIRECTA ({solicitudesReserva.length})
                </h3>
                <div className="flex flex-col space-y-3">
                  {solicitudesReserva.map((res) => {
                    const pieza = getPublicacionById(res.piezaId);
                    return (
                      <div key={res.id} className="bg-surface-container border border-outline-variant/60 p-5 flex items-center space-x-4">
                        <img src={pieza?.imagenUrl} alt={pieza?.nombre} className="w-16 h-20 object-cover bg-black" />
                        <div className="flex-grow flex flex-col min-w-0">
                          <span className="font-label-caps text-[8px] text-on-surface-variant/50">{res.ref}</span>
                          <span className="font-sans text-sm font-semibold text-white truncate">{pieza?.nombre}</span>
                          <span className="font-body-sm text-xs text-primary font-medium mt-1">{formatCurrency(res.precioAcordado)} USD</span>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0">
                          <button
                         onClick={() => handleRechazarReserva(res.id, pieza?.nombre)}
                            className="w-8 h-8 border border-error/40 hover:border-error text-error flex items-center justify-center transition-colors cursor-pointer"
                            title="Rechazar Reserva"
                          >
                            <span className="material-symbols-outlined text-lg font-light">close</span>
                          </button>
                          <button
                           onClick={() => handleConfirmarReserva(res.id, pieza?.nombre, res.precioAcordado)}
                            className="w-8 h-8 bg-primary hover:bg-[#ebd5be] text-on-primary flex items-center justify-center transition-colors cursor-pointer"
                            title="Confirmar Reserva"
                          >
                            <span className="material-symbols-outlined text-lg">check</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Ofertas Privadas Recibidas */}
            {ofertasRecibidas.length > 0 && (
              <div className="flex flex-col space-y-4 text-left">
                <h3 className="font-label-caps text-primary text-[11px] tracking-[0.2em] font-bold">
                  PROPUESTAS DE OFERTA PRIVADA ({ofertasRecibidas.length})
                </h3>
                <div className="flex flex-col space-y-3">
                  {ofertasRecibidas.map((of) => {
                    const pieza = getPublicacionById(of.piezaId);
                    return (
                      <div key={of.id} className="bg-surface-container border border-outline-variant/60 p-5 flex items-center space-x-4">
                        <img src={pieza?.imagenUrl} alt={pieza?.nombre} className="w-16 h-20 object-cover bg-black" />
                        <div className="flex-grow flex flex-col min-w-0">
                          <span className="font-label-caps text-[8px] text-on-surface-variant/50">{of.ref}</span>
                          <span className="font-sans text-sm font-semibold text-white truncate">{pieza?.nombre}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-body-sm text-[11px] text-on-surface-variant/60 line-through">{formatCurrency(of.precioOriginal)}</span>
                            <span className="font-body-sm text-xs text-[#dec2a3] font-semibold">{formatCurrency(of.precioOfertado)} USD</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleResponderOferta(of.id)}
                            className="border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all font-label-caps text-[9px] py-2 px-3 cursor-pointer"
                          >
                            REVISAR
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tabla / Lista de Publicaciones Consignadas */}
        <div className="flex flex-col space-y-6 text-left">
          <h3 className="font-label-caps text-primary text-[11px] tracking-[0.2em] font-bold">
            MIS PUBLICACIONES Y PIEZAS CONSIGNADAS
          </h3>
          
          <div className="border border-outline-variant/30 bg-surface-container/20 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-outline-variant/30 font-label-caps text-[10px] text-on-surface-variant/75 bg-surface-container/60">
                  <th className="p-4 pl-6">PIEZA</th>
                  <th className="p-4">MODALIDAD</th>
                  <th className="p-4">ESTADO</th>
                  <th className="p-4">VALOR / MOCK</th>
                  <th className="p-4 pr-6 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-sans text-xs">
                {misPublicaciones.map((pub) => (
                  <tr key={pub.id} className="hover:bg-surface-container/40 transition-colors">
                    {/* Pieza & Ref */}
                    <td className="p-4 pl-6 flex items-center space-x-4">
                      <img src={pub.imagenUrl} alt={pub.nombre} className="w-10 h-12 object-cover bg-black" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-semibold truncate max-w-[200px]">{pub.nombre}</span>
                        <span className="font-label-caps text-[8px] text-on-surface-variant/40 tracking-wider mt-0.5">{pub.ref}</span>
                      </div>
                    </td>
                    
                    {/* Modalidad */}
                    <td className="p-4">
                      <span className="font-label-caps text-[9px] tracking-wider text-on-surface-variant/80">
                        {pub.modo === 'SUBASTA' ? 'SUBASTA EN VIVO' : 'PRECIO FIJO'}
                      </span>
                    </td>
                    
                    {/* Estado Badge */}
                    <td className="p-4">
                      <Badge status={pub.estado}>{pub.estado}</Badge>
                    </td>
                    
                    {/* Precio o Puja */}
                    <td className="p-4 text-white font-medium">
                      {pub.modo === 'SUBASTA'
                        ? `${formatCurrency(pub.pujaActual || pub.precioBase)} USD`
                        : `${formatCurrency(pub.precio)} USD`}
                    </td>
                    
                    {/* Acciones */}
                    <td className="p-4 pr-6 text-right flex items-center justify-end space-x-3 h-20">
                      {pub.modo === 'SUBASTA' && pub.estado === ESTADO_PUBLICACION.ACTIVA && (
                        <Link to={`/vendedor/${pub.id}/subasta`}>
                          <button className="border border-error/50 hover:border-error text-error transition-all font-label-caps text-[9px] py-2 px-3 cursor-pointer">
                            SALA EN VIVO
                          </button>
                        </Link>
                      )}
                      
                      <Link to={`/vendedor/${pub.id}/editar`}>
                        <button className="border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all font-label-caps text-[9px] py-2 px-3 cursor-pointer">
                          EDITAR DETALLES
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

      {/* Modal de Negociación — Responder oferta del vendedor */}
      <NegociarModal
        isOpen={negociarModal.isOpen}
        onClose={() => setNegociarModal({ isOpen: false, oferta: null })}
        oferta={negociarModal.oferta}
        pieza={negociarModal.oferta ? getPublicacionById(negociarModal.oferta.piezaId) : null}
        onResponder={handleNegociarConfirm}
      />

      {/* Modal de Confirmación Transaccional */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        details={confirmModal.details}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        icon={confirmModal.icon}
        variant={confirmModal.variant}
      />
    </>
  );
};

export default PanelVendedorPage;
