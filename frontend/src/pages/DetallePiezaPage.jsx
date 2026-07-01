import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import OfertaModal from '../components/forms/OfertaModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { PageLoader, PageError } from '../components/ui/Spinner';
import { fetchPublicacionById } from '../features/publicaciones/publicacionesThunks';
import { selectDetalle } from '../features/publicaciones/publicacionesSlice';
import { crearReserva } from '../features/reservas/reservasThunks';
import { crearOferta } from '../features/ofertas/ofertasThunks';
import { registrarPuja } from '../features/subastas/subastasThunks';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useFavoritos } from '../hooks/useFavoritos';
import { useCountdown } from '../hooks/useCountdown';
import { MODO_VENTA, ESTADO_PUBLICACION } from '../data/mockData';

const DetallePiezaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { favoritos, onToggleFavorito } = useFavoritos();
  const [imagenActiva, setImagenActiva] = useState(0);
  const [ofertaModalOpen, setOfertaModalOpen] = useState(false);

  const { data: pub, status, error } = useSelector(selectDetalle);
  const loading = status === 'loading' || status === 'idle';
  const refetch = () => dispatch(fetchPublicacionById(id));

  useEffect(() => {
    dispatch(fetchPublicacionById(id));
  }, [dispatch, id]);

  // Estado del modal de confirmación (unificado para reserva y puja)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    details: [],
    confirmText: 'CONFIRMAR',
    icon: 'verified',
    variant: 'success',
    onConfirm: null,
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  // Estados para subasta
  const [pujaMonto, setPujaMonto] = useState('');
  const [pujaError, setPujaError] = useState('');

  useEffect(() => {
    setImagenActiva(0);
    setPujaMonto('');
  }, [id]);

  // Sugerencia inicial de puja (puja actual + incremento mínimo)
  useEffect(() => {
    if (pub && pub.modo === MODO_VENTA.SUBASTA && pujaMonto === '') {
      const basePrice = pub.pujaActual || pub.precioBase;
      setPujaMonto(basePrice + pub.incrementoMinimo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pub]);

  // Countdown reactivo — se llama incondicionalmente (hook) y usa null cuando no hay pub
  const countdown = useCountdown(pub?.fechaLimiteSubasta ?? null);

  if (loading) {
    return <PageLoader label="Cargando detalle de la pieza..." />;
  }

  if (error) {
    if (error.status === 404) {
      return (
        <div className="py-24 px-6 text-center max-w-md mx-auto flex flex-col items-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-error font-light">warning</span>
          <h2 className="font-headline-sm text-white uppercase tracking-wider">PIEZA NO ENCONTRADA</h2>
          <p className="font-body-sm text-on-surface-variant">El artículo solicitado no figura en los registros de nuestra bóveda digital.</p>
          <Link to="/catalogo">
            <Button variant="outline">VOLVER AL CATÁLOGO</Button>
          </Link>
        </div>
      );
    }
    return <PageError message="No se pudo cargar la pieza solicitada." onRetry={refetch} />;
  }

  if (!pub) return null;

  const isFav = favoritos.includes(pub.id);
  const esSubasta = pub.modo === MODO_VENTA.SUBASTA;
  // subastaAbierta se deriva del countdown reactivo para que el botón cambie en vivo al llegar a 0
  const subastaAbierta =
    pub.estadoSubasta === 'ABIERTA' &&
    (!pub.fechaLimiteSubasta || !countdown.finalizada);

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Manejo de Reserva Directa — abre confirmación antes de ejecutar
  const handleReservaDirecta = () => {
    if (!currentUser) {
      toast.error('Debe iniciar sesión para realizar transacciones.');
      navigate('/login');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Solicitud de Reserva',
      description: 'Está por iniciar una reserva directa sobre esta pieza. El curador recibirá su solicitud y deberá confirmarla para completar la adquisición.',
      details: [
        { label: 'PIEZA', value: pub.nombre },
        { label: 'VENDEDOR', value: pub.vendedor },
        { label: 'VALOR DE ADQUISICIÓN', value: `${formatCurrency(pub.precio)} USD` },
        { label: 'TIPO', value: 'Reserva Directa' },
      ],
      confirmText: 'SOLICITAR RESERVA',
      cancelText: 'CANCELAR',
      icon: 'bookmark_added',
      variant: 'success',
      onConfirm: async () => {
        try {
          await dispatch(crearReserva(pub.id)).unwrap();
          toast.success('Su solicitud de reserva fue enviada al curador.');
          closeConfirmModal();
          navigate('/reservas');
        } catch (err) {
          toast.error(err?.message || 'No se pudo crear la reserva.');
          closeConfirmModal();
        }
      },
    });
  };

  // Manejo de Oferta
  const handleOfertaSubmit = async (monto) => {
    if (!currentUser) {
      toast.error('Debe iniciar sesión para realizar transacciones.');
      navigate('/login');
      return;
    }

    try {
      await dispatch(crearOferta({ publicacionId: pub.id, precioOfertado: monto })).unwrap();
      setOfertaModalOpen(false);
      toast.success(`Su oferta privada por ${formatCurrency(monto)} USD ha sido enviada al curador.`);
      navigate('/ofertas');
    } catch (err) {
      toast.error(err?.message || 'No se pudo enviar la oferta.');
    }
  };

  // Manejo de Puja (Subasta) — valida primero, luego abre confirmación
  const handleRegistrarPuja = (e) => {
    e.preventDefault();
    setPujaError('');

    if (!currentUser) {
      toast.error('Debe iniciar sesión para realizar pujas en salas en vivo.');
      navigate('/login');
      return;
    }

    const monto = parseFloat(pujaMonto);
    const precioReferencia = pub.pujaActual || pub.precioBase;
    const minRequerido = precioReferencia + pub.incrementoMinimo;

    if (isNaN(monto) || monto < minRequerido) {
      setPujaError(`La puja mínima obligatoria debe ser de ${formatCurrency(minRequerido)} USD.`);
      return;
    }

    // Abrir modal de confirmación antes de registrar
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Puja en Vivo',
      description: '¿Confirma el registro de esta puja? Si es aceptada, quedará como el postor líder de la subasta.',
      details: [
        { label: 'PIEZA', value: pub.nombre },
        { label: 'PUJA ACTUAL LÍDER', value: `${formatCurrency(precioReferencia)} USD` },
        { label: 'SU PUJA', value: `${formatCurrency(monto)} USD` },
        { label: 'INCREMENTO', value: `+${formatCurrency(monto - precioReferencia)} USD` },
      ],
      confirmText: 'REGISTRAR PUJA',
      cancelText: 'REVISAR',
      icon: 'gavel',
      variant: 'success',
      onConfirm: async () => {
        try {
          await dispatch(registrarPuja({ publicacionId: pub.id, monto })).unwrap();
          toast.success('Su puja fue registrada como la líder de la subasta.');
          closeConfirmModal();
          setPujaMonto(monto + pub.incrementoMinimo);
          await dispatch(fetchPublicacionById(pub.id));
        } catch (err) {
          toast.error(err?.message || 'No se pudo registrar la puja.');
          closeConfirmModal();
        }
      },
    });
  };

  return (
    <div className="w-full bg-background min-h-screen py-10 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-10">

        {/* 1. Breadcrumbs & Navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/20 pb-4 gap-4 text-left">
          <div className="flex items-center space-x-2 font-label-caps text-[9px] tracking-wider text-on-surface-variant/70">
            <Link to="/" className="hover:text-primary transition-colors">INICIO</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-primary transition-colors">CATÁLOGO</Link>
            <span>/</span>
            <Link to={`/catalogo?cat=${pub.categoria}`} className="hover:text-primary transition-colors">{pub.categoria}</Link>
            <span>/</span>
            <span className="text-primary truncate max-w-[200px]">{pub.nombre}</span>
          </div>

          <button
            onClick={() => onToggleFavorito(pub.id)}
            className="flex items-center space-x-2 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer self-start"
          >
            <span className={`material-symbols-outlined text-lg ${isFav ? 'text-primary fill-1' : ''}`}>
              favorite
            </span>
            <span>{isFav ? 'PIEZA GUARDADA' : 'GUARDAR EN LISTA DE DESEOS'}</span>
          </button>
        </div>

        {/* 2. Cuerpo de Detalle (Grid 2 columnas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Lado Izquierdo: Galería de Imágenes (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Imagen Principal */}
            <div className="w-full aspect-[4/5] bg-surface-container border border-outline-variant/30 overflow-hidden relative">
              <img
                src={pub.imagenes[imagenActiva] || pub.imagenUrl}
                alt={pub.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10">
                <Badge status={pub.estado}>{pub.estado}</Badge>
              </div>
            </div>

            {/* Miniaturas */}
            {pub.imagenes && pub.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {pub.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagenActiva(idx)}
                    className={`
                      aspect-[4/5] overflow-hidden bg-surface-container border cursor-pointer transition-all duration-300
                      ${imagenActiva === idx ? 'border-primary' : 'border-outline-variant/30 hover:border-outline'}
                    `}
                  >
                    <img src={img} alt={`${pub.nombre} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lado Derecho: Transacción e Información Básica (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-8">

            {/* Metadatos Básicos */}
            <div className="space-y-3">
              <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold block">
                {esSubasta ? 'SUBASTA EXCLUSIVA' : 'PIEZA DE ADQUISICIÓN DIRECTA'}
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-white font-semibold leading-tight">
                {pub.nombre}
              </h1>
              <p className="font-label-caps text-on-surface-variant/60 text-[10px] tracking-wider">
                REF: {pub.ref} • CURADO POR: {pub.vendedor}
              </p>
            </div>

            {/* Panel de Transacción según Modo */}
            <div className="p-6 bg-surface-container border border-outline-variant/60 flex flex-col space-y-6">

              {!esSubasta ? (
                <>
                  {/* Precio Fijo Layout */}
                  <div className="flex flex-col space-y-1">
                    <span className="font-label-caps text-on-surface-variant text-[10px] tracking-widest">
                      VALOR DE ADQUISICIÓN
                    </span>
                    <span className="font-display text-3xl font-semibold text-primary">
                      {formatCurrency(pub.precio)} USD
                    </span>
                    <span className="font-body-sm text-on-surface-variant/50">
                      Incluye custodia y transferencia notarizada de procedencia.
                    </span>
                  </div>

                  <div className="flex flex-col space-y-3 pt-4 border-t border-outline-variant/20">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleReservaDirecta}
                      disabled={pub.estado !== ESTADO_PUBLICACION.ACTIVA}
                    >
                      SOLICITAR RESERVA DIRECTA
                    </Button>

                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setOfertaModalOpen(true)}
                      disabled={pub.estado !== ESTADO_PUBLICACION.ACTIVA}
                    >
                      HACER OFERTA PRIVADA
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Subasta Layout */}
                  <div className="grid grid-cols-2 gap-4 border-b border-outline-variant/30 pb-4">
                    <div className="flex flex-col text-left">
                      <span className="font-label-caps text-on-surface-variant text-[9px] tracking-widest">
                        PUJA LÍDER
                      </span>
                      <span className="font-display text-2xl font-semibold text-primary">
                        {formatCurrency(pub.pujaActual || pub.precioBase)}
                      </span>
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-label-caps text-on-surface-variant text-[9px] tracking-widest">
                        TIEMPO RESTANTE
                      </span>
                      <span className={`font-body-md text-base flex items-center space-x-1.5 mt-1 font-semibold ${countdown.finalizada ? 'text-on-surface-variant' : 'text-error'}`}>
                        {!countdown.finalizada && <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping" />}
                        <span>{countdown.texto}</span>
                      </span>
                    </div>
                  </div>

                  {/* Formulario de Puja */}
                  <form onSubmit={handleRegistrarPuja} className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="monto-puja" className="font-label-caps text-on-surface-variant text-[10px] tracking-wider mb-2">
                        REGISTRAR NUEVA PUJA (USD)
                      </label>
                      <div className="flex bg-[#131313] border border-outline-variant/60 py-1.5 px-3">
                        <span className="text-on-surface-variant mr-1 font-body-md">$</span>
                        <input
                          id="monto-puja"
                          type="number"
                          value={pujaMonto}
                          onChange={(e) => setPujaMonto(e.target.value)}
                          placeholder="Monto a pujar"
                          className="bg-transparent border-none text-on-surface font-body-md w-full focus:outline-none focus:ring-0 p-0"
                          disabled={pub.estado !== ESTADO_PUBLICACION.ACTIVA || !subastaAbierta}
                        />
                      </div>
                      <span className="text-on-surface-variant/40 text-[9px] font-body-sm mt-1 block">
                        Incremento mínimo: +{formatCurrency(pub.incrementoMinimo)} USD (Puja min: {formatCurrency((pub.pujaActual || pub.precioBase) + pub.incrementoMinimo)} USD)
                      </span>
                    </div>

                    {pujaError && (
                      <div className="text-error text-xs font-body-sm bg-error-container/10 p-2 border border-error/20">
                        {pujaError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={pub.estado !== ESTADO_PUBLICACION.ACTIVA || !subastaAbierta}
                    >
                      {subastaAbierta ? 'REGISTRAR PUJA EN VIVO' : 'SUBASTA FINALIZADA'}
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Certificado de Procedencia Box */}
            <div className="p-4 border border-primary/20 bg-primary/5 flex items-start space-x-3 text-left">
              <span className="material-symbols-outlined text-primary text-2xl font-light">verified_user</span>
              <div className="flex flex-col space-y-1">
                <span className="font-label-caps text-primary text-[10px] tracking-widest font-semibold">
                  GARANTÍA DE AUTENTICIDAD Y TRANSFERENCIA DE TÍTULO
                </span>
                <p className="font-body-sm text-on-surface-variant/80 text-xs">
                  Esta pieza goza del protocolo de verificación de procedencia y trazabilidad asegurada. Aura Dolce garantiza un informe legal de procedencia.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Historia y Especificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-outline-variant/20">
          {/* Historia (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-4">
            <h3 className="font-headline-sm text-white uppercase tracking-wider">
              HISTORIA Y PROCEDENCIA DE LA PIEZA
            </h3>
            <p className="font-body-md text-on-surface-variant/90 whitespace-pre-line leading-relaxed">
              {pub.historia || pub.descripcion}
            </p>
          </div>

          {/* Especificaciones Técnicas (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-4">
            <h3 className="font-headline-sm text-white uppercase tracking-wider">
              ESPECIFICACIONES DEL CURADOR
            </h3>
            <div className="border border-outline-variant/30 bg-surface-container/20 flex flex-col">
              {Object.entries(pub.especificaciones || {}).map(([key, val], idx) => (
                <div
                  key={key}
                  className={`
                    grid grid-cols-2 p-3.5 text-xs font-body-sm border-outline-variant/10
                    ${idx !== 0 ? 'border-t' : ''}
                    ${idx % 2 === 0 ? 'bg-surface-container/30' : ''}
                  `}
                >
                  <span className="font-label-caps text-on-surface-variant text-[10px] tracking-wider">{key}</span>
                  <span className="text-white font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal para Ofertas Privadas */}
      <OfertaModal
        isOpen={ofertaModalOpen}
        onClose={() => setOfertaModalOpen(false)}
        publicacion={pub}
        onConfirm={handleOfertaSubmit}
      />

      {/* Modal de Confirmación Transaccional */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        details={confirmModal.details}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        icon={confirmModal.icon}
        variant={confirmModal.variant}
      />
    </div>
  );
};

export default DetallePiezaPage;
