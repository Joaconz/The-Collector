import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { getPublicacionById } from '../../data/mockData';

const ReservaCard = ({ reserva }) => {
  const {
    id,
    ref,
    estado,
    precioAcordado,
    fecha,
    vendedor,
    tipo,
    piezaId
  } = reserva;

  // Obtener detalles de la pieza asociados a la reserva
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

  return (
    <div className="bg-surface-container border border-outline-variant/40 flex flex-col md:flex-row text-left transition-all duration-300 hover:border-primary">
      
      {/* 1. Thumbnail Imagen (Aspecto 1/1 en mobile, rectangular en desktop) */}
      <div className="w-full md:w-48 bg-black aspect-square md:aspect-auto md:h-48 border-b md:border-b-0 md:border-r border-outline-variant/20 overflow-hidden relative flex-shrink-0">
        <img
          src={pieza.imagenUrl}
          alt={pieza.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 z-10">
          <Badge status={estado}>{estado}</Badge>
        </div>
      </div>

      {/* 2. Información Desglosada (Cuerpo Principal) */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4 md:space-y-0">
        
        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • {tipo.toUpperCase()}
            </span>
            <Link to={`/publicaciones/${pieza.id}`}>
              <h3 className="font-headline-sm text-lg text-white hover:text-primary transition-colors mt-0.5 font-semibold">
                {pieza.nombre}
              </h3>
            </Link>
            <p className="font-body-sm text-[12px] text-on-surface-variant/70 mt-1">
              {pieza.especificaciones.Material} • {pieza.especificaciones.Año}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider block">
              FECHA DE SOLICITUD
            </span>
            <span className="font-body-sm text-[12px] text-white">
              {fecha}
            </span>
          </div>
        </div>

        {/* Inferior: Valores e Información de Cierre */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-label-caps text-on-surface-variant text-[8px] tracking-widest">
              MONTO TRANSACCIONADO
            </span>
            <span className="font-body-md text-lg font-semibold text-[#dec2a3]">
              {formatCurrency(precioAcordado)} USD
            </span>
            <span className="font-sans text-[10px] text-on-surface-variant/60 mt-0.5">
              Consignatario: {vendedor}
            </span>
          </div>

          {/* Botones de acción contextual */}
          <div className="flex space-x-3">
            <Link to={`/publicaciones/${pieza.id}`}>
              <button className="border border-outline-variant/60 hover:border-primary text-on-surface hover:text-primary transition-all duration-300 font-label-caps text-[9px] py-2 px-4 cursor-pointer">
                DETALLE DE PIEZA
              </button>
            </Link>
            
            {estado === 'CONFIRMADA' && (
              <button
                onClick={() => alert(`Certificado digital y contrato notarizado para la pieza '${pieza.nombre}' enviado a su correo registrado.`)}
                className="bg-primary hover:bg-[#ebd5be] text-on-primary transition-all duration-300 font-label-caps text-[9px] py-2 px-4 cursor-pointer"
              >
                DESCARGAR TÍTULO
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReservaCard;
