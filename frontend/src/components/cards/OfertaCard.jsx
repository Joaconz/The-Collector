import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getPublicacionById } from '../../data/mockData';

const OfertaCard = ({ oferta, onUpdateEstado }) => {
  const {
    id,
    ref,
    precioOriginal,
    precioOfertado,
    precioContraoferta,
    estado,
    vendedor,
    fechaLimite,
    piezaId
  } = oferta;

  const pieza = getPublicacionById(piezaId);

  if (!pieza) return null;

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAceptar = () => {
    onUpdateEstado(id, 'ACEPTADA');
    alert(`¡Contraoferta aceptada con éxito! Su adquisición ha sido consolidada. Puede revisarla ahora en 'Mis Reservas'.`);
  };

  const handleRechazar = () => {
    onUpdateEstado(id, 'RECHAZADA');
    alert(`Oferta rechazada y cerrada formalmente.`);
  };

  return (
    <div className={`
      bg-surface-container border text-left flex flex-col md:flex-row transition-all duration-300
      ${estado === 'CONTRAOFERTA_RECIBIDA' ? 'border-[#dec2a3]' : 'border-outline-variant/40 hover:border-outline'}
    `}>
      
      {/* 1. Imagen miniatura */}
      <div className="w-full md:w-44 bg-black aspect-square md:aspect-auto md:h-44 border-b md:border-b-0 md:border-r border-outline-variant/20 overflow-hidden relative flex-shrink-0">
        <img
          src={pieza.imagenUrl}
          alt={pieza.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2 items-start">
          <Badge status={estado}>{estado}</Badge>
          {estado === 'CONTRAOFERTA_RECIBIDA' && (
            <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-error text-black px-1.5 py-0.5 font-bold">
              <span className="w-1 h-1 bg-black rounded-full animate-ping" />
              <span>ACCIÓN REQUERIDA</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Cuerpo de detalles */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4 md:space-y-0">
        
        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • PROPUESTA DE NEGOCIACIÓN PRIVADA
            </span>
            <Link to={`/publicaciones/${pieza.id}`}>
              <h3 className="font-headline-sm text-lg text-white hover:text-primary transition-colors mt-0.5 font-semibold">
                {pieza.nombre}
              </h3>
            </Link>
            <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1">
              Consignatario: {vendedor}
            </p>
          </div>

          {estado === 'CONTRAOFERTA_RECIBIDA' && (
            <div className="text-left md:text-right">
              <span className="font-label-caps text-error text-[8px] tracking-wider block font-bold">
                TIEMPO LÍMITE
              </span>
              <span className="font-body-sm text-[12px] text-error font-semibold flex items-center space-x-1 justify-start md:justify-end mt-0.5">
                <span className="material-symbols-outlined text-sm font-light">schedule</span>
                <span>Termina en 18h 15m</span>
              </span>
            </div>
          )}
        </div>

        {/* Inferior: Valores y Decisiones */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Desglose de precios en comparación */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">
                PRECIO DE LISTA
              </span>
              <span className="font-body-md text-sm text-on-surface-variant line-through">
                {formatCurrency(precioOriginal)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">
                SU OFERTA INICIAL
              </span>
              <span className="font-body-md text-sm text-on-surface-variant">
                {formatCurrency(precioOfertado)}
              </span>
            </div>

            {precioContraoferta && (
              <div className="flex flex-col">
                <span className="font-label-caps text-primary text-[8px] tracking-widest font-semibold">
                  CONTRAOFERTA RECIBIDA
                </span>
                <span className="font-body-md text-[17px] font-semibold text-[#dec2a3]">
                  {formatCurrency(precioContraoferta)} USD
                </span>
                <span className="font-sans text-[9px] text-[#77dd77] font-semibold">
                  Diferencia: {formatCurrency(precioContraoferta - precioOfertado)} (Ajuste {(((precioContraoferta - precioOriginal) / precioOriginal) * 100).toFixed(1)}%)
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
                EN ESPERA DE EVALUACIÓN DEL CURADOR
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default OfertaCard;
