import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Badge from '../components/ui/Badge';
import { selectCurrentUser, logout } from '../features/auth/authSlice';

const PerfilPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const handleCerrarSesion = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-3xl w-full flex flex-col space-y-12">
        {/* Header */}
        <div className="text-left flex flex-col space-y-2 border-b border-outline-variant/35 pb-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
            ÁREA DE MEMBRESÍA
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-wider">
            MI PERFIL
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            DATOS REGISTRADOS DE SU CUENTA EN LA PLATAFORMA.
          </p>
        </div>

        {/* Ficha de Usuario */}
        <div className="bg-surface-container/30 border border-outline-variant/40 p-6 flex flex-col space-y-6 text-left">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant/60 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl text-primary font-light">person</span>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="font-sans text-lg font-semibold text-white">{currentUser?.nombre}</span>
              <Badge status={currentUser?.rol}>{currentUser?.rol}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-outline-variant/10">
            <div className="flex flex-col space-y-1.5">
              <span className="font-label-caps text-on-surface-variant text-[10px] tracking-wider">NOMBRE COMPLETO</span>
              <span className="font-body-md text-white">{currentUser?.nombre}</span>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="font-label-caps text-on-surface-variant text-[10px] tracking-wider">CORREO ELECTRÓNICO</span>
              <span className="font-body-md text-white">{currentUser?.email}</span>
            </div>
          </div>
        </div>

        {/* Cerrar sesión */}
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="font-label-caps text-[11px] tracking-[0.2em] text-error hover:text-error/80 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-base font-light">logout</span>
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
