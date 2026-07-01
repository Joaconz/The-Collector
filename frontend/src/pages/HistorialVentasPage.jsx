import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import { PageLoader, PageError, AccessDenied } from '../components/ui/Spinner';
import { TIPO_OPERACION } from '../data/mockData';
import { fetchReservasVendedor } from '../features/reservas/reservasThunks';
import { selectReservasVendedor } from '../features/reservas/reservasSlice';
import { fetchMisPublicaciones } from '../features/publicaciones/publicacionesThunks';
import { selectMisPublicaciones } from '../features/publicaciones/publicacionesSlice';

const ORIGEN_TO_TIPO_OPERACION = {
  DIRECTA: TIPO_OPERACION.VENTA_DIRECTA,
  OFERTA: TIPO_OPERACION.OFERTA_ACEPTADA,
  SUBASTA: TIPO_OPERACION.SUBASTA_ADJUDICADA,
};

// Configuración de badges por tipo de operación
const TIPO_CONFIG = {
  [TIPO_OPERACION.VENTA_DIRECTA]: {
    label: 'VENTA DIRECTA',
    className: 'bg-[#142319] text-[#a3deba] border border-[#a3deba]/30',
    icon: 'point_of_sale',
  },
  [TIPO_OPERACION.SUBASTA_ADJUDICADA]: {
    label: 'SUBASTA ADJUDICADA',
    className: 'bg-[#1a1628] text-[#c4b5fd] border border-[#c4b5fd]/30',
    icon: 'gavel',
  },
  [TIPO_OPERACION.OFERTA_ACEPTADA]: {
    label: 'OFERTA ACEPTADA',
    className: 'bg-[#221a10] text-[#dec2a3] border border-[#dec2a3]/30',
    icon: 'handshake',
  },
};

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val || 0);

const formatFecha = (fechaStr) => {
  if (!fechaStr) return '-';
  const date = new Date(fechaStr);
  const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
};

const HistorialVentasPage = () => {
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const dispatch = useDispatch();
  const { data: reservas, status: resStatus, error: resError } = useSelector(selectReservasVendedor);
  const { data: misPublicaciones, status: pubStatus } = useSelector(selectMisPublicaciones);

  const loading = resStatus === 'loading' || resStatus === 'idle' || pubStatus === 'loading' || pubStatus === 'idle';
  const error = resError;

  const cargarHistorial = () => {
    dispatch(fetchReservasVendedor());
    dispatch(fetchMisPublicaciones());
  };

  useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (loading) return <PageLoader label="Cargando historial de ventas..." />;

  if (error) {
    if (error.status === 401 || error.status === 403) {
      return <AccessDenied message="Inicie sesión como vendedor para acceder al historial de ventas." />;
    }
    return <PageError message="No se pudo cargar el historial de ventas." onRetry={cargarHistorial} />;
  }

  // Ventas confirmadas, enriquecidas con datos de la pieza y comisión de plataforma
  const ventas = reservas
    .filter((r) => r.estado === 'CONFIRMADA')
    .map((r) => ({
      ...r,
      tipoOperacion: ORIGEN_TO_TIPO_OPERACION[r.origen] || TIPO_OPERACION.VENTA_DIRECTA,
      precioFinal: r.precioAcordado,
      comision: (r.precioAcordado || 0) * 0.05,
      fechaVenta: r.fechaRespuesta || r.fecha,
      comprador: r.compradorNombre,
      pieza: misPublicaciones.find((p) => p.id === r.piezaId),
    }));

  // Ventas filtradas según el tab activo
  const ventasFiltradas = filtroTipo === 'TODOS' ? ventas : ventas.filter((v) => v.tipoOperacion === filtroTipo);

  // Estadísticas de resumen
  const totalVendido = ventas.reduce((acc, v) => acc + v.precioFinal, 0);
  const totalComision = ventas.reduce((acc, v) => acc + v.comision, 0);
  const ticketPromedio = ventas.length > 0 ? totalVendido / ventas.length : 0;
  const stats = { totalVendido, totalComision, ticketPromedio, cantidad: ventas.length };

  const tabs = [
    { id: 'TODOS', label: 'TODAS' },
    { id: TIPO_OPERACION.VENTA_DIRECTA, label: 'DIRECTAS' },
    { id: TIPO_OPERACION.OFERTA_ACEPTADA, label: 'POR OFERTA' },
    { id: TIPO_OPERACION.SUBASTA_ADJUDICADA, label: 'SUBASTAS' },
  ];

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/35 pb-6">
          <div className="text-left flex flex-col space-y-2">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
              ÁREA CORPORATIVA
            </span>
            <h1 className="font-headline-md text-white uppercase tracking-wider">
              HISTORIAL DE VENTAS
            </h1>
            <p className="font-body-sm text-on-surface-variant">
              REGISTRO COMPLETO DE TODAS LAS TRANSACCIONES COMPLETADAS: VENTAS DIRECTAS,
              OFERTAS ACEPTADAS Y SUBASTAS ADJUDICADAS.
            </p>
          </div>

          <Link to="/vendedor" className="self-start md:self-auto flex-shrink-0">
            <Button variant="outline" className="py-3 px-6 flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm font-light">arrow_back</span>
              <span>VOLVER AL PANEL</span>
            </Button>
          </Link>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'TOTAL RECAUDADO',
              value: formatCurrency(stats.totalVendido),
              sub: 'Valor bruto de operaciones',
              icon: 'payments',
            },
            {
              label: 'PIEZAS VENDIDAS',
              value: stats.cantidad,
              sub: 'Consignaciones completadas',
              icon: 'inventory_2',
            },
            {
              label: 'TICKET PROMEDIO',
              value: formatCurrency(stats.ticketPromedio),
              sub: 'Valor medio por operación',
              icon: 'analytics',
            },
            {
              label: 'COMISIONES NETAS',
              value: formatCurrency(stats.totalComision),
              sub: 'Comisión plataforma (5%)',
              icon: 'account_balance',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container border border-outline-variant/30 p-5 flex flex-col space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-on-surface-variant/70 text-[9px] tracking-widest">
                  {stat.label}
                </span>
                <span className="material-symbols-outlined text-lg font-light text-primary/50">
                  {stat.icon}
                </span>
              </div>
              <span className="font-display text-2xl font-semibold text-white leading-none">
                {stat.value}
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant/50">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Tabs de filtro */}
        <div className="flex items-center space-x-1 border-b border-outline-variant/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroTipo(tab.id)}
              className={`
                relative py-3 px-5 font-label-caps text-[10px] tracking-widest transition-colors duration-200 cursor-pointer
                ${filtroTipo === tab.id
                  ? 'text-primary'
                  : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                }
              `}
            >
              {tab.label}
              {filtroTipo === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tabla de ventas */}
        {ventasFiltradas.length > 0 ? (
          <div className="flex flex-col space-y-3 text-left">
            <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-wider">
              {ventasFiltradas.length} OPERACIÓN{ventasFiltradas.length !== 1 ? 'ES' : ''} ENCONTRADA{ventasFiltradas.length !== 1 ? 'S' : ''}
            </span>

            <div className="border border-outline-variant/30 bg-surface-container/10 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 font-label-caps text-[9px] text-on-surface-variant/60 bg-surface-container/50 tracking-widest">
                    <th className="p-4 pl-6">PIEZA</th>
                    <th className="p-4">TIPO</th>
                    <th className="p-4">COMPRADOR</th>
                    <th className="p-4 text-right">PRECIO FINAL</th>
                    <th className="p-4 text-right">COMISIÓN</th>
                    <th className="p-4 pr-6 text-right">FECHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {ventasFiltradas.map((venta) => {
                    const tipoConf = TIPO_CONFIG[venta.tipoOperacion];
                    return (
                      <tr
                        key={venta.id}
                        className="hover:bg-surface-container/30 transition-colors group"
                      >
                        {/* Pieza */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative flex-shrink-0 w-10 h-12 overflow-hidden bg-surface-container">
                              {venta.pieza?.imagenUrl ? (
                                <img
                                  src={venta.pieza.imagenUrl}
                                  alt={venta.pieza.nombre}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant/30 text-2xl flex items-center justify-center h-full">
                                  hide_image
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-sans text-sm font-semibold text-white truncate max-w-[200px]">
                                {venta.pieza?.nombre || venta.nombreProducto || 'Pieza no disponible'}
                              </span>
                              <span className="font-label-caps text-[8px] text-on-surface-variant/40 tracking-wider mt-0.5">
                                {venta.ref}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Tipo de operación */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-2 py-1 font-label-caps text-[9px] tracking-wider ${tipoConf?.className}`}
                          >
                            <span className="material-symbols-outlined text-[12px] font-light">
                              {tipoConf?.icon}
                            </span>
                            <span>{tipoConf?.label}</span>
                          </span>
                        </td>

                        {/* Comprador */}
                        <td className="p-4">
                          <span className="font-sans text-sm text-on-surface-variant">
                            {venta.comprador}
                          </span>
                        </td>

                        {/* Precio final */}
                        <td className="p-4 text-right">
                          <span className="font-sans text-sm font-semibold text-white">
                            {formatCurrency(venta.precioFinal)} USD
                          </span>
                        </td>

                        {/* Comisión */}
                        <td className="p-4 text-right">
                          <span className="font-sans text-xs text-on-surface-variant/70">
                            {formatCurrency(venta.comision)} USD
                          </span>
                        </td>

                        {/* Fecha */}
                        <td className="p-4 pr-6 text-right">
                          <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-wider">
                            {formatFecha(venta.fechaVenta)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totales de la vista actual */}
            <div className="flex justify-end pt-2">
              <div className="bg-surface-container border border-outline-variant/30 px-6 py-3 flex items-center space-x-8">
                <div className="flex flex-col text-right">
                  <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">
                    SUBTOTAL FILTRO
                  </span>
                  <span className="font-sans text-sm font-semibold text-primary">
                    {formatCurrency(
                      ventasFiltradas.reduce((acc, v) => acc + v.precioFinal, 0)
                    )}{' '}
                    USD
                  </span>
                </div>
                <div className="w-px h-8 bg-outline-variant/30" />
                <div className="flex flex-col text-right">
                  <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">
                    COMISIÓN FILTRO
                  </span>
                  <span className="font-sans text-sm font-medium text-on-surface-variant">
                    {formatCurrency(
                      ventasFiltradas.reduce((acc, v) => acc + v.comision, 0)
                    )}{' '}
                    USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Estado vacío
          <div className="py-28 border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-light">
              sell
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-white uppercase tracking-wider text-lg">
                Sin ventas en este filtro
              </h3>
              <p className="font-body-sm text-on-surface-variant">
                No se registran transacciones completadas del tipo seleccionado.
              </p>
            </div>
            <button
              onClick={() => setFiltroTipo('TODOS')}
              className="font-label-caps text-[10px] tracking-widest text-primary hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              VER TODAS LAS VENTAS
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HistorialVentasPage;
