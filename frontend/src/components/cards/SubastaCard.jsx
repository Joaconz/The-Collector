import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getPublicacionById } from '../../data/mockData';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

const calcularTiempoRestante = (fechaLimite) => {
  const diff = new Date(fechaLimite) - new Date();
  if (diff <= 0) return { texto: 'FINALIZADA', urgente: false, finalizada: true };
  const dias = Math.floor(diff / 86400000);
  const horas = Math.floor((diff % 86400000) / 3600000);
  const minutos = Math.floor((diff % 3600000) / 60000);
  const texto = dias > 0 ? `${dias}d ${horas}h ${minutos}m` : `${horas}h ${minutos}m`;
  return { texto, urgente: diff < 1000 * 60 * 60 * 2, finalizada: false };
};

const SubastaCard = ({ subasta }) => {
  const { piezaId, ref, pujaUsuario, pujaLider, estado, resultado, fechaLimite, vendedor } = subasta;

  const pieza = getPublicacionById(piezaId);

  const [tiempo, setTiempo] = useState(() =>
    estado === 'ABIERTA' ? calcularTiempoRestante(fechaLimite) : null
  );

  useEffect(() => {
    if (estado !== 'ABIERTA') return;
    const actualizar = () => setTiempo(calcularTiempoRestante(fechaLimite));
    actualizar();
    const interval = setInterval(actualizar, 60000);
    return () => clearInterval(interval);
  }, [fechaLimite, estado]);

  if (!pieza) return null;

  const esLider = pujaUsuario >= pujaLider;
  const diferencia = pujaLider - pujaUsuario;

  const bordeClase =
    estado === 'ABIERTA'
      ? esLider
        ? 'border-[#77dd77]/40'
        : 'border-error/40'
      : 'border-outline-variant/40 hover:border-outline';

  return (
    <div className={`bg-surface-container border text-left flex flex-col md:flex-row transition-all duration-300 ${bordeClase}`}>

      {/* 1. Imagen miniatura */}
      <div className="w-full md:w-44 bg-black aspect-square md:aspect-auto md:h-44 border-b md:border-b-0 md:border-r border-outline-variant/20 overflow-hidden relative flex-shrink-0">
        <img
          src={pieza.imagenUrl}
          alt={pieza.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2 items-start">
          <Badge status={estado}>{estado}</Badge>
          {estado === 'ABIERTA' && (
            esLider ? (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-[#142319] text-[#77dd77] border border-[#1b3d2b] px-1.5 py-0.5 font-bold">
                <span>PUJA LÍDER</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-error text-black px-1.5 py-0.5 font-bold">
                <span className="w-1 h-1 bg-black rounded-full animate-ping" />
                <span>SUPERADA</span>
              </span>
            )
          )}
          {estado === 'CERRADA' && (
            <Badge status={resultado}>{resultado === 'GANADA' ? 'ADJUDICADA' : 'NO ADJUDICADA'}</Badge>
          )}
        </div>
      </div>

      {/* 2. Cuerpo de detalles */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4 md:space-y-0">

        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • {estado === 'ABIERTA' ? 'SALA DE SUBASTA EN VIVO' : 'SALA DE SUBASTA CERRADA'}
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

          {estado === 'ABIERTA' && tiempo && (
            <div className="text-left md:text-right">
              <span className={`font-label-caps text-[8px] tracking-wider block font-bold ${tiempo.urgente ? 'text-error' : 'text-on-surface-variant/60'}`}>
                TIEMPO RESTANTE
              </span>
              <span className={`font-body-sm text-[12px] font-semibold flex items-center space-x-1 justify-start md:justify-end mt-0.5 ${tiempo.urgente ? 'text-error' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm font-light">schedule</span>
                <span>{tiempo.texto}</span>
                {tiempo.urgente && <span className="w-1 h-1 bg-error rounded-full animate-ping" />}
              </span>
            </div>
          )}

          {estado === 'CERRADA' && (
            <div className="text-left md:text-right">
              <span className="font-label-caps text-[8px] tracking-wider block font-bold text-on-surface-variant/40">
                SUBASTA FINALIZADA
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
                SU PUJA MÁS ALTA
              </span>
              <span className="font-body-md text-sm text-on-surface-variant">
                {formatCurrency(pujaUsuario)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">
                PUJA LÍDER ACTUAL
              </span>
              <span className="font-body-md text-[17px] font-semibold text-[#dec2a3]">
                {formatCurrency(pujaLider)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">
                DIFERENCIA
              </span>
              {diferencia <= 0 ? (
                <span className="font-sans text-[12px] text-[#77dd77] font-semibold">
                  $0 — USTED LIDERA
                </span>
              ) : (
                <span className="font-sans text-[12px] text-error font-semibold">
                  {formatCurrency(diferencia)} para superar
                </span>
              )}
            </div>

          </div>

          {/* Botón de acción según estado */}
          <div className="flex space-x-3 w-full md:w-auto">
            {estado === 'ABIERTA' ? (
              <Link to={`/publicaciones/${pieza.id}`} className="w-full md:w-auto">
                <Button
                  variant="primary"
                  className="w-full md:w-auto py-2 px-5 text-[9px]"
                >
                  VER SALA DE SUBASTA
                </Button>
              </Link>
            ) : resultado === 'GANADA' ? (
              <Link to="/reservas" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  className="w-full md:w-auto py-2 px-4 text-[9px] border-primary text-primary"
                >
                  VER ADQUISICIÓN EN RESERVAS
                </Button>
              </Link>
            ) : (
              <span className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider py-2 select-none">
                SUBASTA FINALIZADA — NO ADJUDICADA
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SubastaCard;
