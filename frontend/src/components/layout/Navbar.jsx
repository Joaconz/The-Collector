import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const DRAWER_EASE = [0.32, 0.72, 0, 1];

const SectionLabel = ({ children }) => (
  <p className="font-label-caps text-[9px] tracking-[0.2em] text-outline/60 px-6 pt-6 pb-1 select-none">
    {children}
  </p>
);

const UserAvatar = ({ user, className = '' }) => {
  if (user?.avatar) {
    return <img src={user.avatar} alt={user.nombre} className={className} />;
  }
  const initial = user?.nombre?.trim()?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className={`${className} flex items-center justify-center font-label-caps text-primary`}>
      {initial}
    </div>
  );
};

const DrawerLink = ({ to, onClick, children, danger = false }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block font-label-caps text-[12px] tracking-[0.15em] py-3 px-6 border-l-2 transition-colors duration-200 active:scale-[0.98] ${
        danger
          ? 'text-error border-transparent hover:border-error/40 hover:bg-error-container/10'
          : isActive
          ? 'text-primary border-primary bg-primary/5'
          : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40 hover:bg-surface-container-high/40'
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = ({ currentUser, onLogout, favoritosCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus first element when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleLogout = () => {
    close();
    onLogout();
    navigate('/');
  };

  const handleLinkClick = () => close();

  // Stagger variants for drawer items
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: 0.12 } },
    exit: {},
  };
  const itemVariants = {
    hidden: { opacity: 0, transform: 'translateX(-16px)' },
    visible: { opacity: 1, transform: 'translateX(0px)', transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } },
    exit: { opacity: 0, transition: { duration: 0 } },
  };

  return (
    <>
      {/* ── Barra fija ── */}
      <nav className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-16 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 transition-all duration-300">

        {/* Hamburger */}
        <button
          onClick={open}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-[0.95] focus:outline-none"
        >
          <span className="material-symbols-outlined text-2xl font-light">menu</span>
        </button>

        {/* Logo — centrado absoluto */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-display text-lg tracking-[0.2em] font-semibold text-primary hover:text-white transition-colors select-none whitespace-nowrap"
        >
          THE COLLECTOR
        </Link>

        {/* Derecha — avatar o login */}
        {currentUser ? (
          <Link to="/perfil" title="Mi perfil" className="flex items-center">
            <UserAvatar
              user={currentUser}
              className="w-8 h-8 object-cover rounded-full border border-outline/40 bg-surface-container hover:border-primary transition-colors"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 border border-outline/40 py-1.5 px-3.5 hover:border-primary text-on-surface hover:text-primary transition-all duration-300 font-label-caps text-[10px] tracking-widest cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-light">lock</span>
            <span>ACCEDER</span>
          </Link>
        )}
      </nav>

      {/* ── Drawer lateral ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.aside
              key="drawer"
              initial={{ transform: 'translateX(-100%)' }}
              animate={{ transform: 'translateX(0%)' }}
              exit={{ transform: 'translateX(-100%)' }}
              transition={{ type: 'tween', ease: DRAWER_EASE, duration: 0.35 }}
              className="fixed top-0 left-0 h-full w-80 md:w-96 bg-surface-container border-r border-outline-variant/30 z-50 flex flex-col overflow-y-auto"
              aria-label="Menú de navegación"
            >
              {/* Header del drawer */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-outline-variant/15 flex-shrink-0">
                <span
                  className="font-display text-sm tracking-[0.25em] text-primary/50 select-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  THE COLLECTOR
                </span>
                <button
                  ref={closeButtonRef}
                  onClick={close}
                  aria-label="Cerrar menú"
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-[0.95] focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl font-light">close</span>
                </button>
              </div>

              {/* Navegación con stagger */}
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col py-2"
              >
                {/* Principal */}
                <motion.div variants={itemVariants}>
                  <DrawerLink to="/" onClick={handleLinkClick}>INICIO</DrawerLink>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <DrawerLink to="/catalogo" onClick={handleLinkClick}>CATÁLOGO COMPLETO</DrawerLink>
                </motion.div>

                {/* Categorías */}
                <motion.div variants={itemVariants}><SectionLabel>CATEGORÍAS</SectionLabel></motion.div>
                {[
                  { name: 'RELOJES',     path: '/catalogo?cat=RELOJES' },
                  { name: 'JOYERÍA',     path: '/catalogo?cat=JOYERIA' },
                  { name: 'ARTE',        path: '/catalogo?cat=ARTE' },
                  { name: 'NUMISMÁTICA', path: '/catalogo?cat=NUMISMATICA' },
                ].map((cat) => (
                  <motion.div key={cat.name} variants={itemVariants}>
                    <DrawerLink to={cat.path} onClick={handleLinkClick}>{cat.name}</DrawerLink>
                  </motion.div>
                ))}

                {/* Mi Bóveda (solo si logueado) */}
                {currentUser && (
                  <>
                    <motion.div variants={itemVariants}><SectionLabel>MI BÓVEDA</SectionLabel></motion.div>

                    {currentUser.rol === 'VENDEDOR' ? (
                      <>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/vendedor" onClick={handleLinkClick}>PANEL DE CONTROL</DrawerLink>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/vendedor/nueva" onClick={handleLinkClick}>NUEVA PUBLICACIÓN</DrawerLink>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/vendedor/historial" onClick={handleLinkClick}>HISTORIAL DE VENTAS</DrawerLink>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/favoritos" onClick={handleLinkClick}>
                            FAVORITOS{favoritosCount > 0 ? ` (${favoritosCount})` : ''}
                          </DrawerLink>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/reservas" onClick={handleLinkClick}>MIS RESERVAS</DrawerLink>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DrawerLink to="/ofertas" onClick={handleLinkClick}>MIS OFERTAS</DrawerLink>
                        </motion.div>
                      </>
                    )}
                  </>
                )}

                {/* Cuenta */}
                <motion.div variants={itemVariants}><SectionLabel>CUENTA</SectionLabel></motion.div>
                {currentUser ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <DrawerLink to="/perfil" onClick={handleLinkClick}>CONFIGURAR PERFIL</DrawerLink>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block font-label-caps text-[12px] tracking-[0.15em] py-3 px-6 border-l-2 border-transparent text-error hover:border-error/40 hover:bg-error-container/10 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
                      >
                        CERRAR BÓVEDA
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={itemVariants}>
                    <DrawerLink to="/login" onClick={handleLinkClick}>INICIAR SESIÓN</DrawerLink>
                  </motion.div>
                )}
              </motion.div>

              {/* Footer — info de usuario */}
              {currentUser && (
                <div className="mt-auto border-t border-outline-variant/20 flex-shrink-0">
                  <Link
                    to="/perfil"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 px-6 py-5 hover:bg-surface-container-high/40 transition-colors duration-200 group"
                  >
                    <UserAvatar
                      user={currentUser}
                      className="w-8 h-8 object-cover rounded-full border border-outline/40 bg-surface-container-high group-hover:border-primary transition-colors flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{currentUser.nombre}</p>
                      <p className="font-sans text-[10px] text-on-surface-variant/60 truncate">{currentUser.email}</p>
                    </div>
                    <span className="ml-auto flex-shrink-0 font-label-caps text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 border border-primary/30">
                      {currentUser.rol}
                    </span>
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
