import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SubastaCard from '../components/cards/SubastaCard';
import Button from '../components/ui/Button';
import { PageLoader, PageError } from '../components/ui/Spinner';
import { fetchMisSubastas } from '../features/subastas/subastasThunks';
import { selectMisSubastas } from '../features/subastas/subastasSlice';

const MisSubastasPage = () => {
  const dispatch = useDispatch();
  const { data: misSubastas, status, error } = useSelector(selectMisSubastas);

  useEffect(() => {
    dispatch(fetchMisSubastas());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <PageLoader label="Cargando mis subastas..." />;
  }

  if (status === 'failed') {
    return <PageError message="No se pudieron cargar tus subastas." onRetry={() => dispatch(fetchMisSubastas())} />;
  }

  const pujasActivas = misSubastas.filter((s) => s.estado === 'ABIERTA');
  const historial = misSubastas.filter((s) => s.estado === 'CERRADA');
  const pujasSuperadas = pujasActivas.filter((s) => Number(s.pujaUsuario) < Number(s.pujaLider));
  const pujasLider = pujasActivas.filter((s) => Number(s.pujaUsuario) >= Number(s.pujaLider));

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        {/* Header */}
        <div className="text-left flex flex-col space-y-2 border-b border-outline-variant/35 pb-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
            ÁREA DE COLECCIONISTA
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-wider">
            MIS SUBASTAS
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            SEGUIMIENTO DE PUJAS EN SALAS DE SUBASTA EN VIVO, POSICIONES ACTIVAS Y ADJUDICACIONES HISTÓRICAS.
          </p>
        </div>

        {misSubastas.length > 0 ? (
          <div className="flex flex-col space-y-12">

            {/* Sección 1: Pujas Superadas */}
            {pujasSuperadas.length > 0 && (
              <div className="flex flex-col space-y-6 text-left animate-pulse-subtle">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-error rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-error tracking-[0.2em] font-bold">
                    SUPERADAS — ACCIÓN REQUERIDA
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {pujasSuperadas.map((s) => (
                    <SubastaCard key={s.id} subasta={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección 2: Puja Líder */}
            {pujasLider.length > 0 && (
              <div className="flex flex-col space-y-6 text-left">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[#77dd77] rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-[#77dd77] tracking-[0.2em] font-bold">
                    PUJA LÍDER — POSICIÓN ASEGURADA
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {pujasLider.map((s) => (
                    <SubastaCard key={s.id} subasta={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección 3: Historial */}
            {historial.length > 0 && (
              <div className="flex flex-col space-y-6 text-left">
                <div className="flex items-center space-x-3 pt-6 border-t border-outline-variant/15">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full" />
                  <h2 className="font-label-caps text-[11px] text-on-surface-variant/70 tracking-[0.2em] font-bold">
                    HISTORIAL DE SUBASTAS FINALIZADAS
                  </h2>
                </div>
                <div className="flex flex-col space-y-4">
                  {historial.map((s) => (
                    <SubastaCard key={s.id} subasta={s} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="py-28 border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-light">
              gavel
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-white uppercase tracking-wider text-lg">Sin participación en subastas</h3>
              <p className="font-body-sm text-on-surface-variant">No registra pujas en salas de subasta en vivo actualmente.</p>
            </div>
            <Link to="/catalogo">
              <Button variant="primary" className="px-8 py-3.5">
                VER SUBASTAS ACTIVAS
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisSubastasPage;
