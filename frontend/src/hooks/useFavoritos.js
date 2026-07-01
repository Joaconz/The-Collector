import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { selectCurrentUser } from '../features/auth/authSlice';
import { selectFavoritoIds } from '../features/favoritos/favoritosSlice';
import { toggleFavorito } from '../features/favoritos/favoritosThunks';

/**
 * Encapsula el acceso a los favoritos desde el store y la acción de alternar
 * un favorito (con su validación de rol y feedback al usuario). Reemplaza el
 * antiguo prop-drilling de `favoritos` / `onToggleFavorito` desde App.jsx.
 */
export function useFavoritos() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const favoritos = useSelector(selectFavoritoIds);

  const handleToggleFavorito = useCallback(
    async (id) => {
      if (!user || user.rol !== 'COMPRADOR') {
        toast.error('Inicie sesión como coleccionista para guardar favoritos.');
        return;
      }
      try {
        await dispatch(toggleFavorito(id)).unwrap();
      } catch (err) {
        toast.error(err?.message || 'No se pudo actualizar sus favoritos.');
      }
    },
    [dispatch, user]
  );

  return {
    favoritos,
    isFavorito: (id) => favoritos.includes(Number(id)),
    onToggleFavorito: handleToggleFavorito,
  };
}

export default useFavoritos;
