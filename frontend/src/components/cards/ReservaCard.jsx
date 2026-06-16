import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

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

const ReservaCard = ({ reserva, onCancelar }) => {
  const {
    id,
    ref,
    estado,
    precioAcordado,
    fecha,
    tipo,
    piezaId,
    nombreProducto,
  } = reserva;

  return (
    <div className="bg-surface-container border border-outline-variant/40 flex flex-col text-left transition-all duration-300 hover:border-primary">
      <div className="p-6 flex flex-col space-y-4">

        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • {tipo.toUpperCase()}
            </span>
            <Link to={`/publicaciones/${piezaId}`}>
              <h3 className="font-headline-sm text-lg text-white hover:text-primary transition-colors mt-0.5 font-semibold">
                {nombreProducto}
              </h3>
            </Link>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge status={estado}>{estado}</Badge>
            <span className="font-body-sm text-[12px] text-white">
              {formatDate(fecha)}
            </span>
          </div>
        </div>

        {/* Inferior: Valores y acciones */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-label-caps text-on-surface-variant text-[8px] tracking-widest">
              MONTO ACORDADO
            </span>
            <span className="font-body-md text-lg font-semibold text-[#dec2a3]">
              {formatCurrency(precioAcordado)} USD
            </span>
          </div>

          <div className="flex space-x-3">
            <Link to={`/publicaciones/${piezaId}`}>
              <button className="border border-outline-variant/60 hover:border-primary text-on-surface hover:text-primary transition-all duration-300 font-label-caps text-[9px] py-2 px-4 cursor-pointer">
                DETALLE DE PIEZA
              </button>
            </Link>

            {estado === 'PENDIENTE' && onCancelar && (
              <button
                onClick={() => onCancelar(id)}
                className="border border-error/40 hover:border-error text-error transition-all duration-300 font-label-caps text-[9px] py-2 px-4 cursor-pointer"
              >
                CANCELAR
              </button>
            )}

            {estado === 'CONFIRMADA' && (
              <button
                onClick={() => alert(`Certificado digital y contrato notarizado para la pieza '${nombreProducto}' enviado a su correo registrado.`)}
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
