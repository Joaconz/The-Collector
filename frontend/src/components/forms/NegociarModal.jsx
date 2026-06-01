import React, { useState, useEffect } from 'react';
import ConfirmModal from '../ui/ConfirmModal';

const NegociarModal = ({ isOpen, onClose, oferta, pieza, onResponder }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modo, setModo] = useState(null); // null | 'CONTRAOFERTA'
  const [montoContraoferta, setMontoContraoferta] = useState('');
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

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setModo(null);
      setMontoContraoferta('');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setModo(null);
        setMontoContraoferta('');
        document.body.style.overflow = '';
      }, 200);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!shouldRender || !oferta || !pieza) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const deltaListaAbs = oferta.precioOriginal - oferta.precioOfertado;
  const deltaListaPct = ((deltaListaAbs / oferta.precioOriginal) * 100).toFixed(1);

  const monto = parseFloat(montoContraoferta) || 0;
  const contravsDelta = monto > 0 ? monto - oferta.precioOfertado : null;
  const contravsListaDelta = monto > 0 ? oferta.precioOriginal - monto : null;
  const isMontoValido = monto > oferta.precioOfertado && monto < oferta.precioOriginal;

  const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const handleAceptar = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Aceptar Oferta del Comprador',
      description: 'Al aceptar, se acordará el precio ofertado y se generará una reserva confirmada para el comprador.',
      details: [
        { label: 'PIEZA', value: pieza.nombre },
        { label: 'PRECIO DE LISTA', value: `${formatCurrency(oferta.precioOriginal)} USD` },
        { label: 'PRECIO ACORDADO', value: `${formatCurrency(oferta.precioOfertado)} USD` },
        { label: 'DESCUENTO APLICADO', value: `-${deltaListaPct}%` },
      ],
      confirmText: 'ACEPTAR OFERTA',
      cancelText: 'VOLVER',
      icon: 'handshake',
      variant: 'success',
      onConfirm: () => {
        onResponder({ accion: 'ACEPTAR', montoContraoferta: null });
        closeConfirmModal();
        onClose();
      },
    });
  };

  const handleRechazar = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Rechazar Propuesta',
      description: 'La negociación finalizará y se notificará al comprador que su oferta no fue aceptada.',
      details: [
        { label: 'PIEZA', value: pieza.nombre },
        { label: 'OFERTA RECHAZADA', value: `${formatCurrency(oferta.precioOfertado)} USD` },
      ],
      confirmText: 'RECHAZAR PROPUESTA',
      cancelText: 'VOLVER',
      icon: 'block',
      variant: 'danger',
      onConfirm: () => {
        onResponder({ accion: 'RECHAZAR', montoContraoferta: null });
        closeConfirmModal();
        onClose();
      },
    });
  };

  const handleEnviarContraoferta = () => {
    if (!isMontoValido) return;
    setConfirmModal({
      isOpen: true,
      title: 'Enviar Contraoferta',
      description: 'El comprador recibirá su propuesta y tendrá 24 horas para aceptarla o rechazarla.',
      details: [
        { label: 'PIEZA', value: pieza.nombre },
        { label: 'OFERTA DEL COMPRADOR', value: `${formatCurrency(oferta.precioOfertado)} USD` },
        { label: 'SU CONTRAOFERTA', value: `${formatCurrency(monto)} USD` },
        {
          label: 'AJUSTE VS. OFERTA',
          value: `+${formatCurrency(contravsDelta)} (+${((contravsDelta / oferta.precioOfertado) * 100).toFixed(1)}%)`,
        },
      ],
      confirmText: 'ENVIAR CONTRAOFERTA',
      cancelText: 'REVISAR',
      icon: 'swap_horiz',
      variant: 'success',
      onConfirm: () => {
        onResponder({ accion: 'CONTRAOFERTA', montoContraoferta: monto });
        closeConfirmModal();
        onClose();
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Panel */}
        <div
          className={`relative bg-surface-container border border-outline-variant/60 w-full max-w-2xl
            flex flex-col transition-[transform,opacity] duration-200 ease-out shadow-2xl
            ${isAnimating ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="negociar-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
            <div className="flex flex-col space-y-0.5">
              <span className="font-label-caps text-primary text-[9px] tracking-[0.25em]">CANAL DE NEGOCIACIÓN</span>
              <h3
                id="negociar-modal-title"
                className="font-headline-sm text-white uppercase tracking-wider text-[15px]"
              >
                RESPONDER PROPUESTA
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-2xl font-light">close</span>
            </button>
          </div>

          {/* Zone A: Item Strip */}
          <div className="flex items-center space-x-4 px-6 py-4 bg-surface-container-low/50 border-b border-outline-variant/15">
            <img
              src={pieza.imagenUrl}
              alt={pieza.nombre}
              className="w-14 h-16 object-cover bg-black flex-shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-caps text-[8px] text-on-surface-variant/50 tracking-widest">{oferta.ref}</span>
              <span className="font-sans text-sm font-semibold text-white truncate mt-0.5">{pieza.nombre}</span>
              <span className="font-label-caps text-[9px] text-on-surface-variant/60 mt-0.5">{oferta.vendedor}</span>
            </div>
          </div>

          {/* Zone B: Price Arena */}
          <div className="px-6 py-5 border-b border-outline-variant/15 flex flex-col space-y-5">
            <div className="grid grid-cols-2 gap-x-8">
              {/* List price */}
              <div className="flex flex-col space-y-1.5">
                <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">PRECIO DE LISTA</span>
                <span className="font-sans text-sm text-on-surface-variant line-through">
                  {formatCurrency(oferta.precioOriginal)} USD
                </span>
              </div>

              {/* Buyer's offer */}
              <div className="flex flex-col space-y-1.5">
                <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">OFERTA DEL COMPRADOR</span>
                <div className="flex items-center space-x-2.5">
                  <span className="font-sans text-base font-semibold text-primary">
                    {formatCurrency(oferta.precioOfertado)} USD
                  </span>
                  <span className="font-label-caps text-[9px] text-error bg-error-container/20 border border-error/20 px-1.5 py-0.5">
                    -{deltaListaPct}%
                  </span>
                </div>
                <span className="font-label-caps text-[9px] text-on-surface-variant/40">
                  Diferencia: {formatCurrency(deltaListaAbs)}
                </span>
              </div>
            </div>

            {/* Contraoferta input - animated reveal */}
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                modo === 'CONTRAOFERTA' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div
                className={`transition-transform duration-200 ease-out border-t border-outline-variant/15 pt-5 flex flex-col space-y-3 ${
                  modo === 'CONTRAOFERTA' ? 'translate-y-0' : '-translate-y-2'
                }`}
              >
                <div className="flex flex-col">
                  <label className="font-label-caps text-[10px] text-primary tracking-widest mb-2.5">
                    TU CONTRAOFERTA (USD)
                  </label>
                  <input
                    type="number"
                    value={montoContraoferta}
                    onChange={(e) => setMontoContraoferta(e.target.value)}
                    placeholder={`Entre ${formatCurrency(oferta.precioOfertado + 1)} y ${formatCurrency(oferta.precioOriginal - 1)}`}
                    className="bg-transparent border-b border-outline-variant py-2.5 px-0 text-white font-body-md
                               focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/30"
                  />
                </div>

                {/* Real-time deltas */}
                {monto > 0 && (
                  <div className="flex items-center space-x-6 font-label-caps text-[9px] tracking-wider">
                    {contravsListaDelta !== null && (
                      <span className="text-on-surface-variant/60">
                        vs. lista: -{formatCurrency(contravsListaDelta)}
                      </span>
                    )}
                    {contravsDelta !== null && (
                      <span className={contravsDelta >= 0 ? 'text-[#77dd77]' : 'text-error'}>
                        vs. oferta: {contravsDelta >= 0 ? '+' : ''}{formatCurrency(contravsDelta)}
                      </span>
                    )}
                    {!isMontoValido && monto > 0 && (
                      <span className="text-error">
                        {monto <= oferta.precioOfertado ? 'Debe superar la oferta del comprador' : 'Debe ser menor al precio de lista'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zone C: Action Buttons */}
          <div className="px-6 py-5">
            {modo === 'CONTRAOFERTA' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setModo(null); setMontoContraoferta(''); }}
                  className="flex-1 py-3 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline
                             transition-[transform,border-color,color] duration-150 ease-out font-label-caps text-[10px] tracking-widest cursor-pointer active:scale-[0.97]"
                >
                  ← VOLVER
                </button>
                <button
                  onClick={handleEnviarContraoferta}
                  disabled={!isMontoValido}
                  className="flex-[2] py-3 bg-primary hover:bg-[#ebd5be] text-on-primary font-label-caps text-[10px] tracking-widest
                             transition-[transform,background-color] duration-150 ease-out cursor-pointer active:scale-[0.97]
                             disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  ENVIAR CONTRAOFERTA
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRechazar}
                  className="flex-1 py-3 border border-error/40 hover:border-error text-error
                             transition-[transform,border-color] duration-150 ease-out font-label-caps text-[10px] tracking-widest cursor-pointer active:scale-[0.97]"
                >
                  RECHAZAR
                </button>
                <button
                  onClick={() => setModo('CONTRAOFERTA')}
                  className="flex-1 py-3 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary
                             transition-[transform,border-color,color] duration-150 ease-out font-label-caps text-[10px] tracking-widest cursor-pointer active:scale-[0.97]"
                >
                  CONTRAOFERTA
                </button>
                <button
                  onClick={handleAceptar}
                  className="flex-1 py-3 bg-primary hover:bg-[#ebd5be] text-on-primary font-label-caps text-[10px] tracking-widest
                             transition-[transform,background-color] duration-150 ease-out cursor-pointer active:scale-[0.97]"
                >
                  ACEPTAR DIRECTO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation dialog — renders above the negotiation modal (z-[100] > z-[80]) */}
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

export default NegociarModal;
