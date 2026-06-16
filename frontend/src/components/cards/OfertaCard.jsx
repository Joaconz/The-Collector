import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

const formatDate = (val) => {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const OfertaCard = ({ oferta, onAceptarContraoferta, onCancelar }) => {
  const {
    id,
    ref,
    nombreProducto,
    precioOfertado,
    precioContraoferta,
    estado,
    fecha,
    piezaId,
  } = oferta;

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

  const handleAceptar = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Aceptar Contraoferta del Curador',
      description: 'Al aceptar, se creará automáticamente una reserva con el precio acordado. Podrá seguirla desde "Mis Reservas".',
      details: [
        { label: 'PIEZA', value: nombreProducto },
        { label: 'SU OFERTA INICIAL', value: `${formatCurrency(precioOfertado)} USD` },
        { label: 'PRECIO ACORDADO', value: `${formatCurrency(precioContraoferta)} USD` },
      ],
      confirmText: 'ACEPTAR PROPUESTA',
      cancelText: 'REVISAR',
      icon: 'handshake',
      variant: 'success',
      onConfirm: () => {
        onAceptarContraoferta(id);
        closeConfirmModal();
      },
    });
  };

  const handleRechazar = () => {
    const esContraoferta = estado === 'CONTRAOFERTA_RECIBIDA';
    setConfirmModal({
      isOpen: true,
      title: esContraoferta ? 'Rechazar Contraoferta' : 'Cancelar Oferta',
      description: esContraoferta
        ? 'Al rechazar, la propuesta de negociación será cerrada formalmente. Podrá iniciar una nueva oferta desde el catálogo.'
        : 'Al cancelar, su oferta dejará de estar bajo revisión del curador.',
      details: esContraoferta
        ? [
            { label: 'PIEZA', value: nombreProducto },
            { label: 'CONTRAOFERTA A RECHAZAR', value: `${formatCurrency(precioContraoferta)} USD` },
          ]
        : [
            { label: 'PIEZA', value: nombreProducto },
            { label: 'SU OFERTA', value: `${formatCurrency(precioOfertado)} USD` },
          ],
      confirmText: esContraoferta ? 'RECHAZAR' : 'CANCELAR OFERTA',
      cancelText: 'VOLVER',
      icon: 'block',
      variant: 'danger',
      onConfirm: () => {
        onCancelar(id);
        closeConfirmModal();
      },
    });
  };

  return (
    <>
    <div className={`
      bg-surface-container border text-left flex flex-col transition-all duration-300
      ${estado === 'CONTRAOFERTA_RECIBIDA' ? 'border-[#dec2a3]' : 'border-outline-variant/40 hover:border-outline'}
    `}>
      <div className="p-6 flex flex-col space-y-4">

        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • PROPUESTA DE NEGOCIACIÓN PRIVADA
            </span>
            <Link to={`/publicaciones/${piezaId}`}>
              <h3 className="font-headline-sm text-lg text-white hover:text-primary transition-colors mt-0.5 font-semibold">
                {nombreProducto}
              </h3>
            </Link>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge status={estado}>{estado}</Badge>
            {estado === 'CONTRAOFERTA_RECIBIDA' && (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-error text-black px-1.5 py-0.5 font-bold">
                <span className="w-1 h-1 bg-black rounded-full animate-ping" />
                <span>ACCIÓN REQUERIDA</span>
              </span>
            )}
            <span className="font-body-sm text-[12px] text-white">
              {formatDate(fecha)}
            </span>
          </div>
        </div>

        {/* Inferior: Valores y Decisiones */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-end justify-between gap-6">

          {/* Desglose de precios en comparación */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">

            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">
                SU OFERTA INICIAL
              </span>
              <span className="font-body-md text-sm text-on-surface-variant">
                {formatCurrency(precioOfertado)}
              </span>
            </div>

            {precioContraoferta != null && (
              <div className="flex flex-col">
                <span className="font-label-caps text-primary text-[8px] tracking-widest font-semibold">
                  CONTRAOFERTA RECIBIDA
                </span>
                <span className="font-body-md text-[17px] font-semibold text-[#dec2a3]">
                  {formatCurrency(precioContraoferta)} USD
                </span>
                <span className="font-sans text-[9px] text-[#77dd77] font-semibold">
                  Diferencia: {formatCurrency(precioContraoferta - precioOfertado)}
                </span>
              </div>
            )}

          </div>

          {/* Botones de acción según estado */}
          <div className="flex space-x-3 w-full md:w-auto">
            {estado === 'CONTRAOFERTA_RECIBIDA' ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleRechazar}
                  className="flex-1 md:flex-initial py-2 px-4 text-[9px]"
                >
                  RECHAZAR
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAceptar}
                  className="flex-1 md:flex-initial py-2 px-5 text-[9px]"
                >
                  ACEPTAR PROPUESTA
                </Button>
              </>
            ) : estado === 'EN_REVISION' ? (
              <>
                <span className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider py-2 select-none">
                  EN ESPERA DE EVALUACIÓN DEL CURADOR
                </span>
                <Button
                  variant="outline"
                  onClick={handleRechazar}
                  className="flex-1 md:flex-initial py-2 px-4 text-[9px] border-error/40 text-error"
                >
                  CANCELAR OFERTA
                </Button>
              </>
            ) : estado === 'ACEPTADA' ? (
              <Link to="/reservas" className="w-full">
                <Button
                  variant="outline"
                  className="w-full py-2 px-4 text-[9px] border-primary text-primary"
                >
                  VER ADQUISICIÓN EN RESERVAS
                </Button>
              </Link>
            ) : (
              <span className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider py-2 select-none">
                {estado === 'RECHAZADA' ? 'PROPUESTA RECHAZADA POR EL CURADOR' : 'OFERTA CANCELADA'}
              </span>
            )}
          </div>

        </div>

      </div>
    </div>

    {/* Modal de Confirmación */}
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

export default OfertaCard;
