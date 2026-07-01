import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { register } from '../features/auth/authThunks';
import { selectCurrentUser, selectAuthStatus } from '../features/auth/authSlice';

const RegisterPage = () => {
  const [rol, setRol] = useState('COMPRADOR'); // 'COMPRADOR' | 'VENDEDOR'
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthStatus) === 'loading';

  // Redirigir si ya tiene sesión activa
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.rol === 'VENDEDOR' ? '/vendedor' : '/catalogo');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password) {
      setError('Por favor complete todos los campos requeridos.');
      return;
    }

    try {
      const auth = await dispatch(register({ nombre, email, password, rol })).unwrap();
      navigate(auth.rol === 'VENDEDOR' ? '/vendedor' : '/catalogo');
    } catch (err) {
      setError(err?.message || 'No se pudo completar el registro.');
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Lado izquierdo: Branding */}
      <div className="md:w-1/2 relative bg-surface-container-lowest hidden md:flex flex-col justify-end p-16 text-left">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800&h=1200"
            alt="Lienzo de arte abstracto"
            className="w-full h-full object-cover filter brightness-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-md">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
            THE COLLECTOR
          </span>
          <h2 className="font-display text-4xl text-white italic leading-tight">
            "El arte de coleccionar comienza con la certeza de la procedencia."
          </h2>
          <p className="font-body-sm text-on-surface-variant/80">
            Regístrese para solicitar acceso y formar parte de nuestra selecta comunidad de coleccionistas privados y prestigiosas galerías de arte del mundo.
          </p>
        </div>
      </div>

      {/* Lado derecho: Formulario de Registro */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md flex flex-col text-left space-y-8">
          <div className="space-y-2">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
              MEMBRESÍA EXCLUSIVA
            </span>
            <h1 className="font-headline-md text-white uppercase tracking-wider">
              CREAR NUEVA CUENTA
            </h1>
            <p className="font-body-sm text-on-surface-variant">
              Complete la solicitud para abrir su cuenta y acceder al marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Rol */}
            <div className="flex flex-col space-y-2">
              <span className="font-label-caps text-on-surface-variant text-[11px] tracking-wider">
                SELECCIONAR ROL DEL PERFIL
              </span>
              <div className="grid grid-cols-2 gap-4">
                {/* Opción Comprador */}
                <button
                  type="button"
                  onClick={() => setRol('COMPRADOR')}
                  className={`
                    border p-4 flex flex-col items-center justify-center space-y-2 bg-surface-container/20 hover:bg-surface-container/40 transition-all cursor-pointer text-center
                    ${rol === 'COMPRADOR' ? 'border-primary' : 'border-outline-variant/60'}
                  `}
                >
                  <span className="material-symbols-outlined text-3xl font-light text-primary">person</span>
                  <span className="font-label-caps text-[11px] text-white font-semibold">COLECCIONISTA</span>
                  <span className="font-sans text-[9px] text-on-surface-variant">Comprar piezas exclusivas</span>
                </button>

                {/* Opción Vendedor */}
                <button
                  type="button"
                  onClick={() => setRol('VENDEDOR')}
                  className={`
                    border p-4 flex flex-col items-center justify-center space-y-2 bg-surface-container/20 hover:bg-surface-container/40 transition-all cursor-pointer text-center
                    ${rol === 'VENDEDOR' ? 'border-primary' : 'border-outline-variant/60'}
                  `}
                >
                  <span className="material-symbols-outlined text-3xl font-light text-primary">storefront</span>
                  <span className="font-label-caps text-[11px] text-white font-semibold">GALERÍA / VENDEDOR</span>
                  <span className="font-sans text-[9px] text-on-surface-variant">Consignar piezas y subastar</span>
                </button>
              </div>
            </div>

            <Input
              label="NOMBRE COMPLETO"
              type="text"
              placeholder="Ej. Joaquín González"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={error && !nombre ? 'Campo obligatorio' : ''}
            />

            <Input
              label="DIRECCIÓN DE CORREO"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? 'Campo obligatorio' : ''}
            />

            <Input
              label="CONTRASEÑA DE SEGURIDAD"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error && !password ? 'Campo obligatorio' : ''}
            />

            {error && !error.includes('obligatorio') && (
              <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth className="py-4" disabled={loading}>
              {loading ? 'PROCESANDO...' : 'SOLICITAR ACCESO A BÓVEDA'}
            </Button>
          </form>

          <div className="text-center pt-2">
            <span className="font-body-sm text-on-surface-variant mr-1">
              ¿Ya posee una membresía?
            </span>
            <Link
              to="/login"
              className="font-label-caps text-[10px] text-primary hover:text-white tracking-widest transition-colors font-semibold"
            >
              INGRESAR AQUÍ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
