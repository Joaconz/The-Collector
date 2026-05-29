import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage = () => {
  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center px-6 md:px-20">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1600&h=1000"
            alt="Rolex Daytona Close Up"
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/50" />
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 max-w-3xl flex flex-col text-left space-y-6">
          <span className="font-label-caps text-primary text-[11px] tracking-[0.3em] font-semibold animate-fade-in">
            MARKETPLACE DE PROCEDENCIA
          </span>
          <h1 className="font-display-lg text-white select-none leading-none">
            EL PINÁCULO DE LA PROCEDENCIA
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-lg">
            Una curaduría exclusiva de piezas con historia impecable, custodiadas y autenticadas por expertos mundiales para el coleccionista más exigente.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/catalogo">
              <Button variant="primary" className="px-8 py-4">EXPLORAR ADQUISICIONES</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-4">SOLICITAR CONSIGNACIÓN</Button>
            </Link>
          </div>
        </div>
        
        {/* Indicador de scroll */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50 hidden md:flex">
          <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant">DESLIZAR</span>
          <span className="w-[1px] h-10 bg-outline-variant animate-pulse" />
        </div>
      </section>

      {/* 2. Categorías Principales */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto w-full text-center">
        <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold block mb-3">
          CATEGORÍAS DE BÓVEDA
        </span>
        <h2 className="font-headline-md text-white mb-16 uppercase tracking-wider">
          CURACIÓN EXCLUSIVA
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              name: 'RELOJES',
              img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=300',
              path: '/catalogo?cat=RELOJES'
            },
            {
              name: 'JOYERÍA',
              img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300&h=300',
              path: '/catalogo?cat=JOYERIA'
            },
            {
              name: 'ARTE',
              img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300&h=300',
              path: '/catalogo?cat=ARTE'
            },
            {
              name: 'NUMISMÁTICA',
              img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=300&h=300',
              path: '/catalogo?cat=NUMISMATICA'
            }
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex flex-col items-center space-y-4 group cursor-pointer"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 overflow-hidden bg-surface-container border border-outline-variant/30 transition-all duration-500 transform group-hover:border-primary">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
              </div>
              <span className="font-label-caps text-[11px] tracking-[0.2em] text-on-surface-variant group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Sección Destacados: Arte Alternado */}
      <section className="py-20 border-t border-outline-variant/15 w-full bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Lado Imagen */}
          <div className="relative group overflow-hidden border border-outline-variant/30">
            <img
              src="https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=800&h=800"
              alt="Joan Miro Masterpiece"
              className="w-full aspect-square object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
          
          {/* Lado Texto */}
          <div className="flex flex-col text-left space-y-6">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
              PIEZAS MAESTRAS DE AUTOR
            </span>
            <h3 className="font-headline-md text-white uppercase tracking-wider leading-snug">
              OBRAS MAESTRAS QUE TRASCIENDEN EL TIEMPO
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Nuestra sección de arte cuenta con litografías y lienzos originales verificados. Cada adquisición incluye un reporte notariado de procedencia, trazabilidad de galerías previas e informe de conservación forense.
            </p>
            <div className="pt-2">
              <Link to="/catalogo?cat=ARTE">
                <Button variant="outline" className="px-8 py-3.5">EXPLORAR ARTE</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección Destacados: Joyería Invertida */}
      <section className="py-20 border-t border-outline-variant/15 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Lado Texto */}
          <div className="flex flex-col text-left space-y-6 order-2 md:order-1">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
              CONFECCIÓN DE ALTA JOYERÍA
            </span>
            <h3 className="font-headline-md text-white uppercase tracking-wider leading-snug">
              BRILLANTEZ MÁS ALLÁ DEL ENGASTE
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Explore collares de alta gama y sortijas de compromiso que reflejan la maestría de casas de diseño legendarias como Cartier, Tiffany & Co. y Van Cleef & Arpels. Pureza garantizada mediante certificados GIA y de laboratorio autorizados.
            </p>
            <div className="pt-2">
              <Link to="/catalogo?cat=JOYERIA">
                <Button variant="outline" className="px-8 py-3.5">VER COLECCIÓN</Button>
              </Link>
            </div>
          </div>

          {/* Lado Imagen */}
          <div className="relative group overflow-hidden border border-outline-variant/30 order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800&h=800"
              alt="Tiffany Ring"
              className="w-full aspect-square object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 5. Boletín Editorial */}
      <section className="py-28 px-6 bg-surface-container border-t border-outline-variant/20 text-center w-full flex flex-col items-center">
        <div className="max-w-2xl flex flex-col space-y-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.3em] font-semibold">
            ACCESO BAJO MEMBRESÍA
          </span>
          <h3 className="font-headline-md text-white uppercase tracking-widest">
            SOLICITAR INGRESO EDITORIAL
          </h3>
          <p className="font-body-md text-on-surface-variant max-w-lg mx-auto">
            Únase a nuestro círculo de coleccionistas privados. Reciba notificaciones prioritarias de piezas en consignación directa y pases exclusivos a salas de subastas virtuales.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 w-full max-w-md mx-auto">
            <input
              type="email"
              placeholder="Dirección de correo electrónico"
              className="bg-[#131313] border border-outline-variant text-on-surface font-body-sm text-sm px-4 py-3.5 flex-grow focus:outline-none focus:border-primary placeholder-outline-variant/50"
            />
            <Button variant="primary" className="px-6 py-3.5">UNIRSE AHORA</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
