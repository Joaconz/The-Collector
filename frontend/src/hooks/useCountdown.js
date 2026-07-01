import { useState, useEffect } from 'react';

const calcular = (fechaLimite) => {
  if (!fechaLimite) return { texto: 'Sin fecha límite', finalizada: false, urgente: false };
  const diff = new Date(fechaLimite).getTime() - Date.now();
  if (diff <= 0) return { texto: 'FINALIZADA', finalizada: true, urgente: false };
  const dias = Math.floor(diff / 86400000);
  const horas = Math.floor((diff % 86400000) / 3600000);
  const minutos = Math.floor((diff % 3600000) / 60000);
  const segundos = Math.floor((diff % 60000) / 1000);
  const texto = dias > 0
    ? `${dias}d ${horas}h ${minutos}m`
    : horas > 0
      ? `${horas}h ${minutos}m ${segundos}s`
      : `${minutos}m ${segundos}s`;
  return { texto, finalizada: false, urgente: diff < 1000 * 60 * 60 * 2 };
};

/**
 * Cuenta regresiva en vivo hacia `fechaLimite` (ISO string o Date).
 * Actualiza cada segundo mientras la subasta esté abierta y limpia el intervalo al desmontar.
 * @returns {{ texto: string, finalizada: boolean, urgente: boolean }}
 */
export function useCountdown(fechaLimite) {
  const [estado, setEstado] = useState(() => calcular(fechaLimite));

  useEffect(() => {
    if (!fechaLimite) return;
    setEstado(calcular(fechaLimite));
    const interval = setInterval(() => {
      const siguiente = calcular(fechaLimite);
      setEstado(siguiente);
      if (siguiente.finalizada) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [fechaLimite]);

  return estado;
}
