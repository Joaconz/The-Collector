import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { MODO_VENTA } from '../../data/mockData';

const PublicacionCard = ({ publicacion, onToggleFavorito, isFavorito = false }) => {
  const {
    id,
    ref,
    nombre,
    categoria,
    modo,
    estado,
    precio,
    precioBase,
    pujaActual,
    imagenUrl
  } = publicacion;

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Evitar navegar al detalle
    e.stopPropagation();
    onToggleFavorito(id);
  };

  // Formateador de moneda en USD
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="group relative bg-surface-container flex flex-col border border-outline-variant/30 overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-primary active:scale-[0.985] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.6)]">
      {/* Zona Imagen & Acciones de Hover */}
      <Link to={`/publicaciones/${id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-black">
        {/* Imagen principal */}
        <img
          src={imagenUrl}
          alt={nombre}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Overlay degradado y bordes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Botón Favorito overlay */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-background/80 hover:bg-background border border-outline-variant/60 flex items-center justify-center text-on-surface hover:text-primary transition-[transform,background-color,border-color,color] duration-150 ease-out cursor-pointer active:scale-90"
          title={isFavorito ? 'Quitar de lista de deseos' : 'Guardar en lista de deseos'}
        >
          <span className={`material-symbols-outlined text-xl transition-[transform,color] duration-200 ease-out ${isFavorito ? 'text-primary fill-1 font-semibold' : 'font-light'}`}>
            favorite
          </span>
        </button>

        {/* Categoria Badge en Esquina */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 items-start">
          <Badge status={estado}>{estado}</Badge>
          <span className="font-label-caps text-[9px] bg-black/70 text-primary border border-primary/20 px-2 py-0.5">
            {categoria}
          </span>
        </div>

        {/* Info adicional en hover extremo inferior (Desktop) */}
        <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out hidden md:block">
          <span className="font-label-caps text-[9px] text-[#dec2a3] tracking-[0.25em] font-semibold">
            {modo === MODO_VENTA.SUBASTA ? 'SALA DE SUBASTAS' : 'ADQUISICIÓN DIRECTA'}
          </span>
        </div>
      </Link>

      {/* Info Descriptiva Inferior */}
      <div className="p-5 flex flex-col text-left flex-grow justify-between bg-surface-container/60">
        <div>
          {/* Código de Referencia */}
          <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
            {ref}
          </span>

          {/* Nombre */}
          <Link to={`/publicaciones/${id}`}>
            <h3 className="font-headline-sm text-lg text-white mt-1 mb-2 hover:text-primary transition-colors line-clamp-1">
              {nombre}
            </h3>
          </Link>
        </div>

        {/* Sección de Precios y Modos */}
        <div className="pt-3 border-t border-outline-variant/20 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="font-label-caps text-[8px] text-on-surface-variant/60 tracking-widest">
              {modo === MODO_VENTA.SUBASTA ? 'PUJA ACTUAL' : 'PRECIO PACTADO'}
            </span>
            <span className="font-body-md text-[17px] font-semibold text-[#dec2a3]">
              {modo === MODO_VENTA.SUBASTA
                ? formatCurrency(pujaActual || precioBase)
                : formatCurrency(precio)}
            </span>
          </div>

          <div>
            {modo === MODO_VENTA.SUBASTA ? (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[9px] bg-error-container/20 text-error border border-error/30 px-2 py-0.5">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping" />
                <span>SUBASTA</span>
              </span>
            ) : (
              <span className="font-label-caps text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5">
                FIJO
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicacionCard;
