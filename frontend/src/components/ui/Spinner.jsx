import React from 'react';
import { Link } from 'react-router-dom';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

export const Spinner = ({ size = 'md', className = '' }) => (
  <div
    role="status"
    aria-label="Cargando"
    className={`animate-spin rounded-full border-outline-variant/30 border-t-primary ${SIZES[size]} ${className}`}
  />
);

export const PageLoader = ({ label = 'Cargando información...' }) => (
  <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-6">
    <Spinner size="lg" />
    <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.25em]">{label}</span>
  </div>
);

export const PageError = ({ message = 'No se pudo cargar la información.', onRetry }) => (
  <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-6 text-center">
    <span className="material-symbols-outlined text-4xl text-error font-light">error</span>
    <p className="font-body-sm text-on-surface-variant max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="font-label-caps text-[10px] tracking-widest text-primary border border-primary/40 hover:border-primary px-4 py-2 transition-colors cursor-pointer"
      >
        REINTENTAR
      </button>
    )}
  </div>
);

export const AccessDenied = ({ message = 'Inicie sesión para acceder a esta sección.' }) => (
  <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-6 text-center">
    <span className="material-symbols-outlined text-4xl text-primary font-light">lock</span>
    <p className="font-body-sm text-on-surface-variant max-w-sm">{message}</p>
    <Link
      to="/login"
      className="font-label-caps text-[10px] tracking-widest text-primary border border-primary/40 hover:border-primary px-4 py-2 transition-colors cursor-pointer"
    >
      INICIAR SESIÓN
    </Link>
  </div>
);

export default Spinner;
