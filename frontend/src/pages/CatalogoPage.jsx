import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import StaggerReveal from '../components/ui/StaggerReveal';
import { PageLoader, PageError } from '../components/ui/Spinner';
import { useFetch } from '../hooks/useFetch';
import { publicacionService } from '../services/publicacionService';
import { toPublicacion, mapCategoriaToBackend } from '../utils/adapters';
import { CATEGORIAS, MODO_VENTA } from '../data/mockData';

// ── Helpers ────────────────────────────────────────────────────────────────

const formatPrice = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const truncate = (str, max = 130) =>
  str.length <= max ? str : str.slice(0, max).trimEnd() + '…';

// First 4 specs only
const topSpecs = (specs) => Object.entries(specs).slice(0, 4);

// ── PiezaSection ────────────────────────────────────────────────────────────

const PiezaSection = ({ pieza, index, isLast, isFavorito, onToggleFavorito, sectionRef }) => {
  const isEven = index % 2 === 0;
  const isSubasta = pieza.modo === MODO_VENTA.SUBASTA;
  const isVendida = pieza.estado === 'VENDIDA';

  return (
    <section
      ref={sectionRef}
      className="snap-start relative w-full h-full flex-shrink-0 flex items-center overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background fade gradient that ties image into dark bg */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {isEven ? (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background" style={{ left: '30%' }} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" style={{ right: '30%' }} />
        )}
      </div>

      {/* ── Image column ── */}
      <div
        className={`absolute top-0 bottom-0 w-full md:w-[58%] overflow-hidden ${
          isEven ? 'left-0' : 'right-0'
        }`}
      >
        <img
          src={pieza.imagenUrl}
          alt={pieza.nombre}
          loading={index < 2 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-center transition-transform duration-700 scale-[1.02] hover:scale-[1.05]"
        />

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
          <span
            className={`font-label-caps text-[9px] tracking-[0.15em] px-2 py-1 ${
              isVendida
                ? 'bg-outline-variant/80 text-on-surface-variant'
                : 'bg-surface-container/80 text-on-surface'
            } backdrop-blur-sm`}
          >
            {pieza.estado}
          </span>
        </div>

        <div className="absolute top-5 right-5 z-20">
          {isSubasta ? (
            <span className="flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.15em] bg-error-container/80 text-error backdrop-blur-sm px-2 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full bg-error opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-error" />
              </span>
              SUBASTA
            </span>
          ) : (
            <span className="font-label-caps text-[9px] tracking-[0.15em] bg-primary/20 text-primary backdrop-blur-sm border border-primary/30 px-2 py-1">
              PRECIO FIJO
            </span>
          )}
        </div>
      </div>

      {/* ── Text column ── */}
      <div
        className={`relative z-20 w-full md:w-[48%] px-6 md:px-12 py-12 flex flex-col justify-center ${
          isEven
            ? 'ml-auto pl-8 md:pl-0 md:pr-16 md:translate-x-10 lg:translate-x-30'
            : 'mr-auto pr-8 md:pr-0 md:pl-16'
        }`}
      >
        {/* Mobile image strip */}
        <div className="md:hidden w-full aspect-[3/2] overflow-hidden mb-8 -mx-6 w-[calc(100%+3rem)]">
          <img
            src={pieza.imagenUrl}
            alt={pieza.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        <StaggerReveal staggerDelay={0.06} once={false} className="flex flex-col space-y-4">
          {/* Category + ref */}
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.25em]">
              {pieza.categoria.replace('_', ' ')}
            </span>
            <span className="font-label-caps text-outline text-[9px] tracking-wider">
              {pieza.ref}
            </span>
          </div>

          {/* Name */}
          <h2
            className="font-display text-white uppercase leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 600 }}
          >
            {pieza.nombre}
          </h2>

          {/* Description */}
          <p className="font-body-md text-on-surface-variant max-w-sm leading-relaxed">
            {truncate(pieza.descripcion || '')}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1 border-t border-outline-variant/15">
            {topSpecs(pieza.especificaciones).map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <span className="font-label-caps text-[8px] tracking-[0.15em] text-outline/70">{key}</span>
                <span className="font-body-sm text-on-surface-variant text-[13px]">{val}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="pt-2">
            {isSubasta ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-label-caps text-[9px] tracking-[0.15em] text-outline/70">PUJA ACTUAL</span>
                <span
                  className="font-display text-primary"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600 }}
                >
                  {formatPrice(pieza.pujaActual ?? pieza.precioBase)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <span className="font-label-caps text-[9px] tracking-[0.15em] text-outline/70">PRECIO</span>
                <span
                  className="font-display text-primary"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600 }}
                >
                  {formatPrice(pieza.precio)}
                </span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4 pt-1">
            <Link to={`/publicaciones/${pieza.id}`}>
              <Button variant="primary" className="px-7 py-3 text-xs">
                VER PIEZA COMPLETA
              </Button>
            </Link>
            <button
              onClick={() => onToggleFavorito(pieza.id)}
              aria-label={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/40 hover:border-primary text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-[0.92] cursor-pointer"
            >
              <span className={`material-symbols-outlined text-xl font-light ${isFavorito ? 'text-primary' : ''}`}
                style={{ fontVariationSettings: isFavorito ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </div>
        </StaggerReveal>
      </div>

      {/* Scroll indicator (not on last) */}
      {!isLast && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          <div className="relative w-[1px] h-8 bg-outline-variant/20 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-full bg-primary/50 animate-scroll-line" />
          </div>
          <span className="font-label-caps text-[8px] tracking-widest text-on-surface-variant/30">
            {index + 2} / {/* will be filled by parent */}
          </span>
        </div>
      )}
    </section>
  );
};

// ── CatalogoPage ────────────────────────────────────────────────────────────

const CatalogoPage = ({ favoritos = [], onToggleFavorito }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [modoFiltro, setModoFiltro] = useState('TODOS');
  const [activePieza, setActivePieza] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const scrollContainerRef = useRef(null);
  const sectionRefs = useRef([]);

  // Sync category from URL
  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam && CATEGORIAS[catParam.toUpperCase()]) {
      setCategoriaFiltro(catParam.toUpperCase());
    } else {
      setCategoriaFiltro('TODAS');
    }
  }, [searchParams]);

  const { data, loading, error, refetch } = useFetch(
    () =>
      publicacionService
        .getCatalogo({
          categoria: categoriaFiltro !== 'TODAS' ? mapCategoriaToBackend(categoriaFiltro) : undefined,
          size: 100,
        })
        .then((res) => (res?.content || []).map(toPublicacion)),
    [categoriaFiltro]
  );

  const publicacionesList = data || [];

  const handleCategoryTab = (catKey) => {
    if (catKey === 'TODAS') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catKey);
    }
    setSearchParams(searchParams);
    setActivePieza(0);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  };

  const publicacionesFiltradas = publicacionesList.filter((pub) => {
    const matchesModo = modoFiltro === 'TODOS' || pub.modo === modoFiltro;
    const text = busqueda.toLowerCase().trim();
    const matchesSearch =
      !text ||
      pub.nombre.toLowerCase().includes(text) ||
      pub.ref.toLowerCase().includes(text) ||
      (pub.descripcion || '').toLowerCase().includes(text);
    return matchesModo && matchesSearch;
  });

  // IntersectionObserver to track active section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || publicacionesFiltradas.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target);
            if (idx !== -1) setActivePieza(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [publicacionesFiltradas.length]);

  const scrollToSection = useCallback((idx) => {
    const el = sectionRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const totalPiezas = publicacionesFiltradas.length;

  const FILTER_BAR_H = 'h-[3rem]'; // 48px

  return (
    <div className="flex flex-col w-full bg-background" style={{ height: 'calc(100dvh - 4rem)' }}>

      {/* ── Filter bar (sticky, outside snap container) ── */}
      <div className={`flex-shrink-0 sticky top-16 z-30 ${FILTER_BAR_H} bg-background/95 backdrop-blur-md border-b border-outline-variant/15 flex items-center gap-0`}>

        {/* Category tabs */}
        <div className="flex items-center overflow-x-auto flex-1 px-4 md:px-10 gap-5 scrollbar-none h-full">
          {[
            { key: 'TODAS', label: 'TODAS' },
            { key: CATEGORIAS.RELOJES,      label: 'RELOJES' },
            { key: CATEGORIAS.JOYERIA,      label: 'JOYERÍA' },
            { key: CATEGORIAS.ARTE,         label: 'ARTE' },
            { key: CATEGORIAS.NUMISMATICA,  label: 'NUMISMÁTICA' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleCategoryTab(tab.key)}
              className={`relative flex-shrink-0 font-label-caps text-[10px] tracking-[0.18em] pb-0.5 transition-colors duration-200 cursor-pointer ${
                categoriaFiltro === tab.key ? 'text-primary' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {tab.label}
              {categoriaFiltro === tab.key && (
                <span className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-outline-variant/20 flex-shrink-0" />

        {/* Mode selector */}
        <div className="flex items-center gap-1 px-4 flex-shrink-0">
          {[
            { key: 'TODOS',              label: 'TODOS' },
            { key: MODO_VENTA.PRECIO_FIJO, label: 'FIJO' },
            { key: MODO_VENTA.SUBASTA,     label: 'SUBASTA' },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setModoFiltro(mode.key)}
              className={`font-label-caps text-[9px] tracking-widest px-2.5 py-1 transition-all duration-200 cursor-pointer ${
                modoFiltro === mode.key
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-outline-variant/20 flex-shrink-0" />

        {/* Search toggle + input */}
        <div className="flex items-center px-4 gap-2 flex-shrink-0">
          <AnimatePresence>
            {showSearch && (
              <motion.input
                key="search"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 160, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
                className="bg-transparent border-b border-outline-variant focus:border-primary text-on-surface font-body-sm text-xs px-1 py-0.5 focus:outline-none placeholder-outline-variant/50 transition-colors"
                style={{ overflow: 'hidden' }}
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => { setShowSearch((v) => !v); if (showSearch) setBusqueda(''); }}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-[0.92]"
            aria-label="Buscar"
          >
            <span className="material-symbols-outlined text-lg font-light">
              {showSearch ? 'close' : 'search'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-outline-variant/20 flex-shrink-0" />

        {/* Count */}
        <div className="px-4 flex-shrink-0">
          <span className="font-label-caps text-[9px] tracking-[0.15em] text-outline whitespace-nowrap">
            {loading ? '...' : `${totalPiezas} PIEZAS`}
          </span>
        </div>
      </div>

      {/* ── Content area ── */}
      {loading ? (
        <PageLoader label="Cargando catálogo..." />
      ) : error ? (
        <PageError message="No se pudo cargar el catálogo. Verifique su conexión." onRetry={refetch} />
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth', overscrollBehaviorY: 'contain' }}
        >
          {publicacionesFiltradas.length > 0 ? (
            publicacionesFiltradas.map((pieza, i) => (
              <div
                key={pieza.id}
                ref={(el) => (sectionRefs.current[i] = el)}
                style={{ scrollSnapAlign: 'start', height: 'calc(100dvh - 4rem - 3rem)' }}
                className="relative flex-shrink-0"
              >
                <PiezaSection
                  pieza={pieza}
                  index={i}
                  isLast={i === totalPiezas - 1}
                  isFavorito={favoritos.includes(pieza.id)}
                  onToggleFavorito={onToggleFavorito}
                />
              </div>
            ))
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-5 text-center"
              style={{ height: 'calc(100dvh - 4rem - 3rem)' }}
            >
              <span className="material-symbols-outlined text-5xl text-outline-variant/40 font-light">search_off</span>
              <span className="font-label-caps text-[11px] tracking-wider text-on-surface-variant">
                No se encontraron piezas con los filtros seleccionados
              </span>
              <button
                onClick={() => { setBusqueda(''); setModoFiltro('TODOS'); handleCategoryTab('TODAS'); setShowSearch(false); }}
                className="font-label-caps text-[10px] text-primary hover:text-white tracking-widest transition-colors underline cursor-pointer"
              >
                RESTABLECER FILTROS
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation dots (fixed right side) ── */}
      {totalPiezas > 1 && totalPiezas <= 20 && (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
          {publicacionesFiltradas.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              aria-label={`Ir a pieza ${i + 1}`}
              className="relative flex items-center justify-center cursor-pointer group"
            >
              <span
                className={`block transition-all duration-300 ${
                  activePieza === i
                    ? 'w-1.5 h-4 bg-primary'
                    : 'w-1 h-1 bg-outline-variant/50 group-hover:bg-outline'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogoPage;
