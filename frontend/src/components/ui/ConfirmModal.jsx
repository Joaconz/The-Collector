import React, { useEffect, useState } from 'react';

/**
 * ConfirmModal — Modal de confirmación transaccional reutilizable.
 *
 * Props:
 *  - isOpen (bool): controla visibilidad
 *  - onClose (fn): callback al cancelar / cerrar
 *  - onConfirm (fn): callback al confirmar la acción
 *  - title (string): título del modal
 *  - description (string): texto descriptivo opcional
 *  - details (Array<{ label: string, value: string }>): desglose de la transacción
 *  - confirmText (string): texto del botón de confirmación (default: 'CONFIRMAR')
 *  - cancelText (string): texto del botón de cancelación (default: 'CANCELAR')
 *  - variant ('success' | 'danger'): color del botón de confirmación y el icono
 *  - icon (string): nombre del Material Symbol (default: 'verified')
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Acción',
  description = '',
  details = [],
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
  variant = 'success',
  icon = 'verified',
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Máquina de estados para diferir el desmontaje y permitir la animación de salida
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Doble rAF para garantizar que la clase inicial se aplica antes de la transición
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = '';
      }, 200);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-error-container hover:bg-error/30 text-error border border-error/40 hover:border-error'
      : 'bg-primary hover:bg-[#ebd5be] text-on-primary';

  const iconColorClass =
    variant === 'danger'
      ? 'border-error/30 text-error'
      : 'border-primary/30 text-primary';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel principal */}
      <div
        className={`
          relative bg-surface-container border border-outline-variant/60 w-full max-w-md
          flex flex-col transition-[transform,opacity] duration-200 ease-out shadow-2xl
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Header */}
        <div className="p-7 pb-5 flex flex-col items-center text-center space-y-4 border-b border-outline-variant/20">
          {/* Icono */}
          <div
            className={`w-14 h-14 flex items-center justify-center border ${iconColorClass}`}
          >
            <span className="material-symbols-outlined text-2xl font-light">
              {icon}
            </span>
          </div>

          <div className="space-y-2">
            <h3
              id="confirm-modal-title"
              className="font-headline-sm text-white uppercase tracking-wider text-[15px]"
            >
              {title}
            </h3>
            {description && (
              <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Desglose de transacción */}
        {details.length > 0 && (
          <div className="px-7 py-5 bg-surface-container-high/20 border-b border-outline-variant/10 flex flex-col space-y-3">
            {details.map((d, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-label-caps text-on-surface-variant/70 text-[10px] tracking-widest">
                  {d.label}
                </span>
                <span className="font-sans text-sm text-white font-medium">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <button
            id="confirm-modal-cancel"
            onClick={onClose}
            className="flex-1 py-3 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline transition-[transform,border-color,color] duration-150 ease-out font-label-caps text-[11px] tracking-widest cursor-pointer active:scale-[0.97]"
          >
            {cancelText}
          </button>
          <button
            id="confirm-modal-confirm"
            onClick={onConfirm}
            className={`flex-1 py-3 font-label-caps text-[11px] tracking-widest cursor-pointer transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] ${confirmBtnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
