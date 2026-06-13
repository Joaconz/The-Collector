import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ScrollReveal from '../components/ui/ScrollReveal';
import StaggerReveal from '../components/ui/StaggerReveal';
import ParallaxImage from '../components/ui/ParallaxImage';
import Marquee from '../components/ui/Marquee';

const CATEGORIES = [
  {
    index: '01',
    slug: 'RELOJES',
    label: 'RELOJERÍA DE BÓVEDA',
    headline: 'LA PRECISIÓN COMO ARTE',
    description:
      'Piezas horlogeras de las manufacturas más prestigiosas del mundo. Cada movimiento, una declaración de ingenio humano que trasciende su función utilitaria.',
    img: '/images/watch-movement-calibre.jpg',
    path: '/catalogo?cat=RELOJES',
    cta: 'EXPLORAR RELOJES',
  },
  {
    index: '02',
    slug: 'JOYERIA',
    label: 'ALTA JOYERÍA',
    headline: 'BRILLANTEZ MÁS ALLÁ DEL ENGASTE',
    description:
      'Collares, sortijas y piezas únicas de Cartier, Tiffany & Co. y Van Cleef & Arpels. Pureza certificada por laboratorios GIA autorizados.',
    img: '/images/jewelry-emerald-necklace.jpg',
    path: '/catalogo?cat=JOYERIA',
    cta: 'VER COLECCIÓN',
  },
  {
    index: '03',
    slug: 'ARTE',
    label: 'PIEZAS MAESTRAS DE AUTOR',
    headline: 'OBRAS QUE TRASCIENDEN EL TIEMPO',
    description:
      'Litografías y lienzos originales verificados. Cada adquisición incluye reporte notariado de procedencia, trazabilidad de galerías previas e informe de conservación forense.',
    img: '/images/painting-museum.jpg',
    path: '/catalogo?cat=ARTE',
    cta: 'EXPLORAR ARTE',
  },
  {
    index: '04',
    slug: 'NUMISMATICA',
    label: 'NUMISMÁTICA HISTÓRICA',
    headline: 'HISTORIA ACUÑADA EN METAL',
    description:
      'Monedas y medallas que sobrevivieron imperios. Cada pieza certificada por la American Numismatic Association con ficha técnica de rareza y conservación.',
    img: '/images/coin-roman-aureus.jpg',
    path: '/catalogo?cat=NUMISMATICA',
    cta: 'VER MONEDAS',
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">

      {/* ═══════════════════════════════════════════
          1. HERO — Pieza como protagonista centrada
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between -mt-16 pt-24 pb-12 overflow-hidden">

        {/* Vignette lateral oscura para profundidad */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 50% 48%, rgba(20,20,19,0) 30%, #131313 85%)',
          }}
        />

        {/* Resplandor dorado muy sutil bajo la pieza */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            top: '28%', left: '50%',
            transform: 'translateX(-50%)',
            width: '520px', height: '520px',
            background: 'radial-gradient(ellipse at center, rgba(222,194,163,0.055) 0%, transparent 68%)',
          }}
        />

        {/* — Eyebrow label — */}
        <StaggerReveal staggerDelay={0.08} className="relative z-10 flex flex-col items-center text-center space-y-5 px-6">
          <span className="font-label-caps text-primary text-[11px] tracking-[0.35em]">
            MARKETPLACE DE PROCEDENCIA
          </span>

          <h1
            className="font-display text-white select-none leading-[1.0] tracking-tight text-center"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            El Pináculo de la Procedencia
          </h1>
        </StaggerReveal>

        {/* — Pieza principal — */}
        <ScrollReveal direction="up" delay={0.2} duration={1.2} distance={50} className="relative z-10 flex-1 flex items-center justify-center w-full px-6">
          <img
            src="/images/watch-pocket-enamel.jpg"
            alt="Reloj de bolsillo de colección — The Collector"
            fetchPriority="high"
            className="animate-float w-[280px] sm:w-[360px] md:w-[440px] lg:w-[500px] aspect-square object-cover rounded-full border border-outline-variant/30 shadow-[0_32px_96px_rgba(0,0,0,0.95)]"
          />
        </ScrollReveal>

        {/* — CTAs — */}
        <StaggerReveal staggerDelay={0.1} delay={0.5} className="relative z-10 flex flex-col sm:flex-row items-center gap-4 px-6">
          <Link to="/catalogo">
            <Button variant="outline" className="px-10 py-3.5 min-w-[200px] text-center">
              VISITAR MERCADO
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-10 py-3.5 min-w-[200px] text-center">
              VENDER PIEZA
            </Button>
          </Link>
        </StaggerReveal>

        {/* Scroll indicator — bottom center */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2">
          <div className="relative w-[1px] h-10 bg-outline-variant/20 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-full bg-primary/60 animate-scroll-line" />
          </div>
          <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/40">
            DESLIZAR
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. MANIFIESTO — Frase con marquee de fondo
      ═══════════════════════════════════════════ */}
      <section className="relative py-36 md:py-52 px-6 md:px-20 overflow-hidden border-t border-outline-variant/10">

        {/* Marquee decorativo de fondo */}
        <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
          <Marquee
            duration={45}
            className="w-full opacity-[0.025]"
            contentClassName="items-center"
          >
            <span
              className="font-display font-semibold text-on-surface whitespace-nowrap"
              style={{ fontSize: 'clamp(5rem, 12vw, 11rem)', letterSpacing: '-0.04em' }}
            >
              PROCEDENCIA&nbsp;&nbsp;·&nbsp;&nbsp;AUTENTICIDAD&nbsp;&nbsp;·&nbsp;&nbsp;HISTORIA&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          </Marquee>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 max-w-5xl">
          <ScrollReveal direction="left" delay={0} duration={0.6}>
            <div className="w-16 h-[1px] bg-primary mb-10" />
          </ScrollReveal>

          <StaggerReveal staggerDelay={0.1} className="flex flex-col space-y-8">
            <blockquote
              className="font-display text-white/90 leading-snug tracking-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
            >
              "El verdadero coleccionista no posee objetos.
            </blockquote>
            <blockquote
              className="font-display text-white/90 leading-snug tracking-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
            >
              Custodia fragmentos de historia
            </blockquote>
            <blockquote
              className="font-display text-primary/80 leading-snug tracking-tight italic"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
            >
              que el tiempo le confió."
            </blockquote>
            <p className="font-label-caps text-primary text-[10px] tracking-[0.35em] pt-4">
              — THE COLLECTOR
            </p>
          </StaggerReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. CATEGORÍAS INMERSIVAS
      ═══════════════════════════════════════════ */}
      {CATEGORIES.map((cat, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={cat.slug}
            className="relative border-t border-outline-variant/10 py-20 md:py-32 px-6 md:px-16 w-full"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center min-h-[70vh]">

              {/* Columna imagen */}
              <ScrollReveal
                direction="up"
                duration={1}
                delay={0.05}
                className={`${isEven ? 'md:order-1' : 'md:order-2'} order-1`}
              >
                <ParallaxImage
                  src={cat.img}
                  alt={cat.headline}
                  speed={0.12}
                  loading="lazy"
                  className="aspect-[4/5] border border-outline-variant/20 w-full"
                  imgClassName="h-[120%]"
                />
              </ScrollReveal>

              {/* Columna texto */}
              <div
                className={`relative ${isEven ? 'md:order-2' : 'md:order-1'} order-2`}
              >
                {/* Número de índice como watermark */}
                <span
                  className="font-display font-semibold text-on-surface/[0.04] select-none absolute -top-6 -left-2 leading-none pointer-events-none"
                  style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
                  aria-hidden="true"
                >
                  {cat.index}
                </span>

                <StaggerReveal staggerDelay={0.07} className="relative z-10 flex flex-col space-y-5">
                  <span className="font-label-caps text-primary text-[10px] tracking-[0.25em]">
                    {cat.label}
                  </span>
                  <h2 className="font-headline-md text-white uppercase tracking-wider leading-snug">
                    {cat.headline}
                  </h2>
                  <p className="font-body-md text-on-surface-variant max-w-md">
                    {cat.description}
                  </p>
                  <div className="pt-3">
                    <Link to={cat.path}>
                      <Button variant="outline" className="px-8 py-3.5">
                        {cat.cta}
                      </Button>
                    </Link>
                  </div>
                </StaggerReveal>
              </div>

            </div>
          </section>
        );
      })}

      {/* ═══════════════════════════════════════════
          4. NEWSLETTER — Layout asimétrico
      ═══════════════════════════════════════════ */}
      <section className="py-28 md:py-36 px-6 md:px-16 bg-surface-container border-t border-outline-variant/20 w-full">
        <ScrollReveal direction="up" duration={0.9}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            {/* Texto izquierda */}
            <div className="flex flex-col space-y-5">
              <span className="font-label-caps text-primary text-[10px] tracking-[0.3em]">
                ACCESO BAJO MEMBRESÍA
              </span>
              <h3 className="font-headline-md text-white uppercase tracking-widest">
                SOLICITAR INGRESO EDITORIAL
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-md">
                Únase a nuestro círculo de coleccionistas privados. Reciba notificaciones prioritarias de piezas en consignación directa y pases exclusivos a salas de subastas virtuales.
              </p>
            </div>

            {/* Formulario derecha */}
            <div className="flex flex-col justify-center md:pt-16">
              <div className="flex flex-col sm:flex-row gap-0 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Dirección de correo electrónico"
                  className="bg-background border border-outline-variant text-on-surface font-body-sm text-sm px-4 py-3.5 flex-grow focus:outline-none focus:border-primary placeholder-outline-variant/50 transition-colors duration-300"
                />
                <Button variant="primary" className="px-6 py-3.5 whitespace-nowrap">
                  UNIRSE AHORA
                </Button>
              </div>
              <p className="font-label-caps text-outline text-[9px] tracking-wider mt-4">
                SIN SPAM · SOLO PIEZAS EXTRAORDINARIAS
              </p>
            </div>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};

export default HomePage;
