import React, { useState, useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      setShouldRender(true);
      timeoutId = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, 200); // duration-200
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Bloquear el scroll del body al estar renderizado
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ease-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Contenedor Modal */}
      <div className={`relative bg-surface-container border border-outline-variant max-w-lg w-full z-10 p-6 md:p-8 flex flex-col transition-all duration-200 ease-out transform ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant">
          {title && (
            <h3 className="font-headline-sm text-primary uppercase tracking-wide">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-2xl font-light">close</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full text-left">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
