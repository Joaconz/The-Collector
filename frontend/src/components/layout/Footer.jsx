import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-outline-variant/30 py-16 px-6 md:px-16 text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Marca / Branding */}
        <div className="flex flex-col space-y-4">
          <span className="font-display text-lg tracking-[0.2em] font-semibold text-primary select-none">
            THE COLLECTOR
          </span>
          <p className="font-body-sm text-on-surface-variant/75 max-w-xs">
            El destino definitivo para coleccionistas distinguidos. Curando autenticidad, historia y procedencia en cada adquisición.
          </p>
        </div>

        {/* Explorar */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-label-caps text-[11px] text-primary tracking-widest mb-2">EXPLORAR</h4>
          <Link to="/catalogo?cat=RELOJES" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Relojes de Bóveda</Link>
          <Link to="/catalogo?cat=JOYERIA" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Alta Joyería</Link>
          <Link to="/catalogo?cat=ARTE" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Obras de Arte</Link>
          <Link to="/catalogo?cat=NUMISMATICA" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Numismática Histórica</Link>
        </div>

        {/* Legal y Procedencia */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-label-caps text-[11px] text-primary tracking-widest mb-2">TRANSPARENCIA</h4>
          <a href="#" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Protocolo de Procedencia</a>
          <a href="#" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Términos del Servicio</a>
          <a href="#" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Políticas de Privacidad</a>
          <a href="#" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Métodos de Custodia</a>
        </div>

        {/* Suscribirse / Acceso */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-label-caps text-[11px] text-primary tracking-widest">BOLETÍN EDITORIAL</h4>
          <p className="font-body-sm text-on-surface-variant/70">
            Reciba notificaciones exclusivas sobre nuevos ingresos y subastas privadas de aura excepcional.
          </p>
          <div className="flex border-b border-outline-variant py-1">
            <input
              type="email"
              placeholder="Su correo de contacto"
              className="bg-transparent text-sm w-full text-on-surface focus:outline-none placeholder-outline-variant/60 font-body-sm border-none px-0 py-1"
            />
            <button className="text-primary hover:text-white transition-colors cursor-pointer" aria-label="Suscribirse">
              <span className="material-symbols-outlined font-light text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
          © {new Date().getFullYear()} THE COLLECTOR. TODOS LOS DERECHOS RESERVADOS.
        </span>
        <span className="font-label-caps text-[9px] text-primary/60 tracking-widest">
          CURACIÓN EXCLUSIVA • UADE 2026
        </span>
      </div>
    </footer>
  );
};

export default Footer;
