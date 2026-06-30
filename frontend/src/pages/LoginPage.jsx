import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { login } from '../features/auth/authThunks';
import { selectCurrentUser, selectAuthStatus } from '../features/auth/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthStatus) === 'loading';

  // Si ya está logueado, redirigir
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.rol === 'VENDEDOR' ? '/vendedor' : '/catalogo');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      const auth = await dispatch(login({ email, password })).unwrap();
      navigate(auth.rol === 'VENDEDOR' ? '/vendedor' : '/catalogo');
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar sesión.');
    }
  };

  return (
    <div className="flex-grow w-full flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Lado izquierdo: Imagen macro y branding */}
      <div className="md:w-1/2 relative bg-surface-container-lowest hidden md:flex flex-col justify-end p-16 text-left">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=1200"
            alt="Reloj mecánico de lujo"
            className="w-full h-full object-cover filter brightness-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40" />
        </div>
        
        {/* Título de Branding en el Fondo de la Imagen */}
        <div className="relative z-10 space-y-4 max-w-md">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
            THE COLLECTOR
          </span>
          <h2 className="font-display text-4xl text-white italic leading-tight">
            "Curando lo extraordinario para el coleccionista más exigente."
          </h2>
          <p className="font-body-sm text-on-surface-variant/80">
            Acceda a su cuenta para visualizar sus reservas seguras, realizar pujas en salas de subastas privadas o convalidar el historial de sus adquisiciones.
          </p>
        </div>
      </div>

      {/* Lado derecho: Formulario de Login */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md flex flex-col text-left space-y-8">
          <div className="space-y-2">
            <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-semibold">
              ACCESO A BÓVEDA
            </span>
            <h1 className="font-headline-md text-white uppercase tracking-wider">
              INGRESAR AL SISTEMA
            </h1>
            <p className="font-body-sm text-on-surface-variant">
              Por favor introduzca sus credenciales de seguridad registradas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="DIRECCIÓN DE CORREO"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? 'Campo obligatorio' : ''}
            />

            <div className="space-y-1">
              <Input
                label="CONTRASEÑA"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error && !password ? 'Campo obligatorio' : ''}
              />
              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Enlace de prueba. Use los botones de acceso rápido.'); }}
                  className="font-label-caps text-[9px] text-on-surface-variant hover:text-primary tracking-widest transition-colors"
                >
                  ¿OLVIDÓ SU CONTRASEÑA?
                </a>
              </div>
            </div>

            {error && !error.includes('obligatorio') && (
              <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth className="py-4" disabled={loading}>
              {loading ? 'INGRESANDO...' : 'INGRESAR A MI BÓVEDA'}
            </Button>
          </form>

          <div className="text-center pt-2">
            <span className="font-body-sm text-on-surface-variant mr-1">
              ¿No posee una cuenta autorizada?
            </span>
            <Link
              to="/register"
              className="font-label-caps text-[10px] text-primary hover:text-white tracking-widest transition-colors font-semibold"
            >
              REGÍSTRESE AQUÍ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
