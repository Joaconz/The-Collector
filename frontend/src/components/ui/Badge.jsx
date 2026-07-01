import React from 'react';

const Badge = ({ status = 'ACTIVA', children, className = '' }) => {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  
  const styles = {
    // Publicaciones
    ACTIVA: 'bg-[#142319] text-[#a3dec2] border border-[#1b3d2b]',
    PENDIENTE: 'bg-[#29221a] text-[#dec2a3] border border-[#46392a]',
    VENDIDA: 'bg-[#1b1c1b] text-[#cfc5ba] border border-[#2a2a29]',
    PAUSADA: 'bg-[#1b1c1b] text-[#9a8f85] border border-[#2a2a29]',
    
    // Reservas
    CONFIRMADA: 'bg-[#142319] text-[#77dd77] border border-[#1b3d2b]',
    COMPLETADA: 'bg-[#1a221f] text-[#cfc5ba] border border-[#2c3d36]',
    RECHAZADA: 'bg-[#2a1b1b] text-[#ffb4ab] border border-[#4d2727]',
    
    // Ofertas
    EN_REVISION: 'bg-[#20201f] text-[#cfc5ba] border border-[#4d453d]',
    CONTRAOFERTA_RECIBIDA: 'bg-[#2b2015] text-[#dec2a3] border border-[#4e3a24]',
    ACEPTADA: 'bg-[#142319] text-[#77dd77] border border-[#1b3d2b]',
    RECHAZADA_OFERTA: 'bg-[#2a1b1b] text-[#ffb4ab] border border-[#4d2727]',

    // Subastas
    ABIERTA: 'bg-[#1a1a2e] text-[#a0b4ff] border border-[#2a2a4d]',
    CERRADA: 'bg-[#1b1c1b] text-[#9a8f85] border border-[#2a2a29]',
    GANADA: 'bg-[#142319] text-[#77dd77] border border-[#1b3d2b]',
    SUPERADA: 'bg-[#2a1b1b] text-[#ffb4ab] border border-[#4d2727]',
    NO_ADJUDICADA: 'bg-[#1b1c1b] text-[#9a8f85] border border-[#2a2a29]',
  };

  const currentStyle = styles[normalizedStatus] || 'bg-[#20201f] text-[#e5e2e0] border border-[#4d453d]';

  return (
    <span
      className={`inline-flex items-center justify-center font-label-caps text-[9px] font-semibold py-1 px-2.5 border tracking-wider select-none ${currentStyle} ${className}`}
    >
      {children || status.replace(/_/g, ' ')}
    </span>
  );
};

export default Badge;
