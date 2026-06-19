import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import { PageLoader, PageError } from '../components/ui/Spinner';
import { useFetch } from '../hooks/useFetch';
import { MODO_VENTA } from '../data/mockData';
import { publicacionService } from '../services/publicacionService';
import { subastaService } from '../services/subastaService';
import { toPublicacion, toPuja } from '../utils/adapters';

const formatTimeRemaining = (fechaLimite) => {
  if (!fechaLimite) return 'Sin fecha límite';
  const diff = new Date(fechaLimite).getTime() - Date.now();
  if (diff <= 0) return 'Subasta finalizada';
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);
  if (dias > 0) return `Cierra en ${dias}d ${horas % 24}h`;
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  return `Cierra en ${horas}h ${minutos}m`;
};

const formatFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
};

const GestionSubastaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cerrando, setCerrando] = useState(false);

  const { data, loading, error, refetch } = useFetch(async () => {
    const [pub, pujas] = await Promise.all([
      publicacionService.getById(id).then(toPublicacion),
      subastaService.getPujas(id).then((list) => (list || []).map(toPuja)),
    ]);
    return { pub, pujas };
  }, [id]);

  if (loading) return <PageLoader label="Cargando sala de subasta..." />;

  if (error || data?.pub?.modo !== MODO_VENTA.SUBASTA) {
    if (error && error.status !== 404 && data?.pub?.modo === undefined) {
      return <PageError message="No se pudo cargar la sala de subasta." onRetry={refetch} />;
    }
    return (
      <div className="py-24 px-6 text-center max-w-md mx-auto flex flex-col items-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-error font-light">warning</span>
        <h2 className="font-headline-sm text-white uppercase tracking-wider">SUBASTA NO ENCONTRADA</h2>
        <p className="font-body-sm text-on-surface-variant">La sala de subasta solicitada no se encuentra activa en los servidores.</p>
        <Link to="/vendedor">
          <Button variant="outline">VOLVER AL PANEL</Button>
        </Link>
      </div>
    );
  }

  const { pub, pujas } = data;

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCerrarSubasta = async () => {
    setCerrando(true);
    try {
      const lider = pujas[0];
      await subastaService.cerrar(pub.id);
      if (lider) {
        toast.success(`¡Subasta finalizada! La pieza '${pub.nombre}' fue adjudicada a ${lider.usuario} por ${formatCurrency(lider.monto)} USD.`);
      } else {
        toast.info('Subasta finalizada sin postores. La pieza vuelve a depósito.');
      }
      navigate('/vendedor');
    } catch (err) {
      toast.error(err.message || 'No se pudo cerrar la subasta.');
      setCerrando(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-10 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-10 text-left">

        {/* Header Sala en Vivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/35 pb-5 gap-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/vendedor"
              className="font-label-caps text-[9px] text-on-surface-variant/75 hover:text-primary tracking-widest flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm font-light">arrow_back</span>
              <span>VOLVER AL PANEL DE VENDEDOR</span>
            </Link>
            <h1 className="font-headline-sm text-white uppercase tracking-wider mt-2 flex items-center space-x-3">
              <span>SALA DE SUBASTAS EN VIVO</span>
              <span className="inline-flex items-center space-x-1 font-label-caps text-[9px] bg-error-container/20 text-error border border-error/30 px-2 py-0.5 animate-pulse-subtle">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping" />
                <span>SUBASTA EN DIRECTO</span>
              </span>
            </h1>
          </div>

          <span className="font-label-caps text-on-surface-variant text-[10px] tracking-wider bg-surface-container border border-outline-variant py-1.5 px-3">
            LOTE: #{pub.ref}
          </span>
        </div>

        {/* Layout Principal 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Lado Izquierdo: Ficha del Lote (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="w-full aspect-[16/10] bg-black border border-outline-variant/30 overflow-hidden relative">
              <img src={pub.imagenUrl} alt={pub.nombre} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <h2 className="font-headline-md text-white">{pub.nombre}</h2>
              <p className="font-body-md text-on-surface-variant/80">{pub.descripcion}</p>

              {/* Tabla de especificaciones */}
              <div className="border border-outline-variant/20 bg-surface-container/10 flex flex-col pt-2">
                {Object.entries(pub.especificaciones || {}).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-3 border-b border-outline-variant/10 text-xs font-body-sm">
                    <span className="font-label-caps text-on-surface-variant/60 text-[9px] tracking-wider">{key}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Monitor de Pujas (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">

            {/* Monitor de Puja Actual */}
            <div className="bg-surface-container border border-outline-variant/60 p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-on-surface-variant text-[9px] tracking-widest">PUJA MÁS ALTA</span>
                <span className="font-label-caps text-error text-[9px] tracking-widest font-bold animate-pulse">LÍDER ACTUAL</span>
              </div>

              <div className="font-display text-4xl md:text-5xl font-bold text-primary tracking-wide">
                {formatCurrency(pub.precio)}
              </div>

              <div className="flex justify-between items-center text-xs pt-4 border-t border-outline-variant/20 font-body-sm text-on-surface-variant/70">
                <span>Postor Líder: <strong className="text-white">{pujas[0]?.usuario || 'Sin pujas'}</strong></span>
                <span className="flex items-center space-x-1 text-error font-semibold">
                  <span className="material-symbols-outlined text-sm font-light">schedule</span>
                  <span>{formatTimeRemaining(pub.fechaLimiteSubasta)}</span>
                </span>
              </div>
            </div>

            {/* Bitácora de Pujas en Vivo */}
            <div className="flex flex-col space-y-3">
              <span className="font-label-caps text-[9px] text-on-surface-variant tracking-wider font-bold">
                HISTORIAL DE PUJAS EN LA SALA
              </span>

              <div className="border border-outline-variant/30 bg-surface-container/20 max-h-56 overflow-y-auto flex flex-col divide-y divide-outline-variant/10">
                {pujas.length > 0 ? (
                  pujas.map((bid) => (
                    <div key={bid.id} className="p-3.5 flex justify-between items-center text-xs font-body-sm">
                      <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-outline-variant/80 text-sm font-light">account_balance_wallet</span>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{bid.usuario}</span>
                          <span className="font-body-sm text-[9px] text-on-surface-variant/50 mt-0.5">{formatFecha(bid.fecha)}</span>
                        </div>
                      </div>
                      <span className="font-body-sm text-sm font-semibold text-primary">
                        {formatCurrency(bid.monto)} USD
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center font-body-sm text-on-surface-variant/60 text-xs">
                    Aún no se registraron pujas en esta sala.
                  </div>
                )}
              </div>
            </div>

            {/* Cerrar Subasta */}
            <div className="pt-4">
              <Button
                variant="danger"
                fullWidth
                onClick={handleCerrarSubasta}
                disabled={cerrando}
                className="py-4 font-bold"
              >
                {cerrando ? 'CERRANDO SALA...' : 'CERRAR SALA'}
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GestionSubastaPage;
