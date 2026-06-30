import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import ReservaCard from '../components/cards/ReservaCard';
import Button from '../components/ui/Button';
import { PageLoader, PageError, AccessDenied } from '../components/ui/Spinner';
import { fetchReservasComprador, cancelarReserva } from '../features/reservas/reservasThunks';
import { selectReservasComprador } from '../features/reservas/reservasSlice';

const ReservasPage = () => {
  const dispatch = useDispatch();
  const { data: reservas, status, error } = useSelector(selectReservasComprador);
  const loading = status === 'loading' || status === 'idle';

  useEffect(() => {
    dispatch(fetchReservasComprador());
  }, [dispatch]);

  if (loading) return <PageLoader label="Cargando sus reservas..." />;

  if (error) {
    if (error.status === 401 || error.status === 403) {
      return <AccessDenied message="Inicie sesión para ver sus reservas." />;
    }
    return <PageError message="No se pudieron cargar sus reservas." onRetry={() => dispatch(fetchReservasComprador())} />;
  }

  const reservasActivas = reservas.filter((r) => r.estado === 'PENDIENTE');
  const reservasHistorial = reservas.filter(
    (r) => r.estado === 'CONFIRMADA' || r.estado === 'RECHAZADA' || r.estado === 'CANCELADA'
  );

  const handleCancelar = async (id) => {
    try {
      await dispatch(cancelarReserva(id)).unwrap();
      toast.success('Reserva cancelada correctamente.');
    } catch (err) {
      toast.error(err?.message || 'No se pudo cancelar la reserva.');
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        {/* Header */}
        <div className="text-left flex flex-col space-y-2 border-b border-outline-variant/35 pb-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
            ÁREA DE COLECCIONISTA
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-wider">
            MIS RESERVAS
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            HISTORIAL DE ADQUISICIONES DIRECTAS, RESERVAS BAJO CONSIGNACIÓN Y TÍTULOS DE PROPIEDAD ADJUDICADOS.
          </p>
        </div>

        {reservas.length > 0 ? (
          <div className="flex flex-col space-y-12">

            {/* Sección 1: Adquisiciones en Proceso */}
            {reservasActivas.length > 0 && (
              <div className="flex flex-col space-y-6 text-left">
                <div className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-primary tracking-[0.2em] font-bold">
                    ADQUISICIONES EN CURSO Y PENDIENTES
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {reservasActivas.map((res) => (
                    <ReservaCard key={res.id} reserva={res} onCancelar={handleCancelar} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección 2: Historial */}
            {reservasHistorial.length > 0 && (
              <div className="flex flex-col space-y-6 text-left">
                <div className="flex items-center space-x-3 pt-6 border-t border-outline-variant/15">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-on-surface-variant/70 tracking-[0.2em] font-bold">
                    HISTORIAL DE ADQUISICIONES
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {reservasHistorial.map((res) => (
                    <ReservaCard key={res.id} reserva={res} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="py-28 border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-light">
              history_edu
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-white uppercase tracking-wider text-lg">Sin reservas</h3>
              <p className="font-body-sm text-on-surface-variant">No registra solicitudes de adquisiciones directas ni depósitos de reserva.</p>
            </div>
            <Link to="/catalogo">
              <Button variant="primary" className="px-8 py-3.5">
                VER PIEZAS PARA RESERVAR
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasPage;
