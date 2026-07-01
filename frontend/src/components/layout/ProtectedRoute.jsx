import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

/**
 * Guard de rutas basado en el store de auth.
 * - Sin sesión → redirige a /login.
 * - Con `rol` requerido y rol distinto → redirige a `/`.
 */
const ProtectedRoute = ({ rol, children }) => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (rol && user.rol !== rol) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
