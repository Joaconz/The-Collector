import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ currentUser, onLogout, favoritosCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/30 h-16 flex items-center justify-between px-6 md:px-16 transition-all duration-300">
      {/* Lado izquierdo: Hamburguesa móvil */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-on-surface hover:text-primary transition-colors focus:outline-none cursor-pointer"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined text-2xl font-light">
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Marca / Logo */}
      <div className="flex-1 md:flex-initial text-center md:text-left">
        <Link
          to="/"
          className="font-display text-lg tracking-[0.2em] font-semibold text-primary hover:text-white transition-colors select-none"
        >
          THE COLLECTOR
        </Link>
      </div>

      {/* Categorías centrales (Desktop) */}
      <div className="hidden md:flex items-center space-x-8">
        {[
          { name: 'RELOJES', path: '/catalogo?cat=RELOJES' },
          { name: 'JOYERÍA', path: '/catalogo?cat=JOYERIA' },
          { name: 'ARTE', path: '/catalogo?cat=ARTE' },
          { name: 'NUMISMÁTICA', path: '/catalogo?cat=NUMISMATICA' }
        ].map((cat) => (
          <NavLink
            key={cat.name}
            to={cat.path}
            className={({ isActive }) => `
              font-label-caps text-[11px] tracking-widest relative py-2 transition-colors duration-300
              ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}
            `}
          >
            {({ isActive }) => (
              <>
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary animate-fade-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Iconos de Acción e Información (Derecha) */}
      <div className="flex items-center space-x-6">
        {/* Catálogo de exploración general */}
        <Link
          to="/catalogo"
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          title="Ver Catálogo"
        >
          <span className="material-symbols-outlined text-2xl font-light">explore</span>
        </Link>

        {/* Lista de deseos / Favoritos (Carrito de compras) */}
        <Link
          to="/favoritos"
          className="text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer"
          title="Lista de Deseos"
        >
          <span className="material-symbols-outlined text-2xl font-light">favorite</span>
          {favoritosCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary font-sans text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-background">
              {favoritosCount}
            </span>
          )}
        </Link>

        {/* Menú de Usuario / Acceso */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.nombre}
                className="w-7 h-7 object-cover border border-outline/50 bg-surface-container"
              />
              <span className="hidden lg:inline font-label-caps text-[10px] tracking-wider text-on-surface-variant">
                {currentUser.nombre.split(' ')[0]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-56 bg-surface-container border border-outline-variant/60 shadow-xl z-20 transition-[transform,opacity] duration-200 ease-out origin-top-right scale-100 opacity-100 starting:scale-95 starting:opacity-0 flex flex-col py-1 text-left">
                  <div className="px-4 py-3 border-b border-outline-variant/40 bg-surface-container-high/30">
                    <p className="font-sans text-xs font-semibold text-on-surface">{currentUser.nombre}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant/70 mt-0.5 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-2 font-label-caps text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 border border-primary/30">
                      {currentUser.rol}
                    </span>
                  </div>

                  {currentUser.rol === 'VENDEDOR' ? (
                    <Link
                      to="/vendedor"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.98]"
                    >
                      Panel de Control
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/reservas"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.98]"
                      >
                        Mis Reservas
                      </Link>
                      <Link
                        to="/ofertas"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.98]"
                      >
                        Mis Ofertas
                      </Link>
                    </>
                  )}

                  <Link
                    to="/perfil"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.98]"
                  >
                    Configurar Perfil
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="px-4 py-2.5 font-label-caps text-[10px] tracking-wider text-error hover:bg-error-container/20 transition-[transform,background-color] duration-150 ease-out border-t border-outline-variant/30 text-left w-full cursor-pointer active:scale-[0.98]"
                  >
                    Cerrar Bóveda
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 border border-outline/40 py-1.5 px-3.5 hover:border-primary text-on-surface hover:text-primary transition-all duration-300 font-label-caps text-[10px] tracking-widest cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-light">lock</span>
            <span>ACCEDER</span>
          </Link>
        )}
      </div>

      {/* Drawer Móvil (Mobile Menu Overlay) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/80 backdrop-blur-sm z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 w-full bg-surface-container border-b border-outline-variant z-40 p-6 flex flex-col space-y-6 md:hidden animate-slide-down">
            {[
              { name: 'RELOJES', path: '/catalogo?cat=RELOJES' },
              { name: 'JOYERÍA', path: '/catalogo?cat=JOYERIA' },
              { name: 'ARTE', path: '/catalogo?cat=ARTE' },
              { name: 'NUMISMÁTICA', path: '/catalogo?cat=NUMISMATICA' }
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-caps text-[13px] tracking-widest text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                {cat.name}
              </Link>
            ))}
            
            {currentUser && (
              <div className="pt-4 border-t border-outline-variant/40 flex flex-col space-y-4 text-left">
                {currentUser.rol === 'VENDEDOR' ? (
                  <Link
                    to="/vendedor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-label-caps text-[11px] tracking-widest text-on-surface hover:text-primary"
                  >
                    PANEL DE CONTROL
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/reservas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-label-caps text-[11px] tracking-widest text-on-surface hover:text-primary"
                    >
                      MIS RESERVAS
                    </Link>
                    <Link
                      to="/ofertas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-label-caps text-[11px] tracking-widest text-on-surface hover:text-primary"
                    >
                      MIS OFERTAS
                    </Link>
                  </>
                )}
                <Link
                  to="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-label-caps text-[11px] tracking-widest text-on-surface hover:text-primary"
                >
                  CONFIGURAR PERFIL
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="font-label-caps text-[11px] tracking-widest text-error text-left cursor-pointer"
                >
                  CERRAR BÓVEDA
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
