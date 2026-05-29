import React from 'react';
import { Link } from 'react-router-dom';
import OfertaCard from '../components/cards/OfertaCard';
import Button from '../components/ui/Button';

const OfertasPage = ({ ofertas, onUpdateOfertaEstado }) => {
  const ofertasAccion = ofertas.filter(
    (o) => o.estado === 'CONTRAOFERTA_RECIBIDA'
  );
  
  const ofertasEspera = ofertas.filter(
    (o) => o.estado === 'EN_REVISION' || o.estado === 'ACEPTADA' || o.estado === 'RECHAZADA'
  );

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        {/* Header */}
        <div className="text-left flex flex-col space-y-2 border-b border-outline-variant/35 pb-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
            ÁREA DE COLECCIONISTA
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-wider">
            MIS OFERTAS
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            SEGUIMIENTO DE PROPUESTAS DE NEGOCIACIÓN PRIVADAS, CONTRAOFERTAS DE CURADORES Y ACUERDOS DE PRECIO.
          </p>
        </div>

        {ofertas.length > 0 ? (
          <div className="flex flex-col space-y-12">
            
            {/* Sección 1: Acción Requerida */}
            {ofertasAccion.length > 0 && (
              <div className="flex flex-col space-y-6 text-left animate-pulse-subtle">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-error rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-error tracking-[0.2em] font-bold">
                    CONTRAOFERTAS RECIBIDAS (ACCIÓN REQUERIDA)
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {ofertasAccion.map((of) => (
                    <OfertaCard
                      key={of.id}
                      oferta={of}
                      onUpdateEstado={onUpdateOfertaEstado}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sección 2: Esperando respuesta / Historial */}
            {ofertasEspera.length > 0 && (
              <div className="flex flex-col space-y-6 text-left">
                <div className="flex items-center space-x-3 pt-6 border-t border-outline-variant/15">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-on-surface-variant/70 tracking-[0.2em] font-bold">
                    HISTORIAL Y OFERTAS EN REVISIÓN
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {ofertasEspera.map((of) => (
                    <OfertaCard
                      key={of.id}
                      oferta={of}
                      onUpdateEstado={onUpdateOfertaEstado}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="py-28 border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-light">
              edit_document
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-white uppercase tracking-wider text-lg">Sin ofertas registradas</h3>
              <p className="font-body-sm text-on-surface-variant">No registra negociaciones privadas por piezas de precio fijo en curso.</p>
            </div>
            <Link to="/catalogo">
              <Button variant="primary" className="px-8 py-3.5">
                VER PIEZAS PARA OFERTAR
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfertasPage;
