import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex-grow w-full bg-background flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] px-6 relative overflow-hidden">
      
      {/* 404 Gigante de Fondo */}
      <div className="absolute z-0 select-none pointer-events-none text-on-surface-variant/[0.03] font-display font-bold text-[18rem] md:text-[30rem] leading-none">
        404
      </div>

      {/* Contenido en primer plano */}
      <div className="relative z-10 max-w-md flex flex-col items-center space-y-6 text-center">
        <span className="font-label-caps text-primary text-[10px] tracking-[0.3em] font-semibold">
          ERROR REGISTRAL
        </span>
        <h2 className="font-headline-md text-white uppercase tracking-wider">
          ARCHIVO NO ENCONTRADO
        </h2>
        <p className="font-body-sm text-on-surface-variant max-w-xs leading-relaxed">
          La referencia que intenta auditar no existe en nuestros libros de registro o ha sido reubicada de forma confidencial.
        </p>
        <div className="pt-4">
          <Link to="/catalogo">
            <Button variant="primary" className="px-8 py-3.5 flex items-center space-x-2">
              <span>VOLVER AL CATÁLOGO</span>
              <span className="material-symbols-outlined text-sm font-light">arrow_forward</span>
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default NotFoundPage;
