import React from 'react';
import { Link } from 'react-router-dom';
import PublicacionCard from '../components/cards/PublicacionCard';
import Button from '../components/ui/Button';
import { PageLoader, PageError, AccessDenied } from '../components/ui/Spinner';
import { useFetch } from '../hooks/useFetch';
import { favoritoService } from '../services/favoritoService';
import { toFavorito } from '../utils/adapters';

const FavoritosPage = ({ onToggleFavorito }) => {
  const { data, loading, error, refetch, setData } = useFetch(() =>
    favoritoService.getMisFavoritos().then((list) => (list || []).map(toFavorito))
  );

  if (loading) return <PageLoader label="Cargando su lista de deseos..." />;

  if (error) {
    if (error.status === 401 || error.status === 403) {
      return <AccessDenied message="Inicie sesión como coleccionista para ver su lista de deseos." />;
    }
    return <PageError message="No se pudo cargar su lista de deseos." onRetry={refetch} />;
  }

  const itemsFavoritos = data || [];

  const handleQuitar = async (id) => {
    await onToggleFavorito(id);
    setData((prev) => (prev || []).filter((p) => p.id !== id));
  };

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        {/* Header */}
        <div className="text-left flex flex-col space-y-2 border-b border-outline-variant/35 pb-6">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.25em] font-semibold">
            ÁREA DE COLECCIONISTA
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-wider">
            LISTA DE DESEOS
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            {itemsFavoritos.length === 1
              ? '1 ARTÍCULO GUARDADO EN SU BÓVEDA PRIVADA'
              : `${itemsFavoritos.length} ARTÍCULOS GUARDADOS EN SU BÓVEDA PRIVADA`}
          </p>
        </div>

        {itemsFavoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsFavoritos.map((pub) => (
              <div key={pub.id} className="flex flex-col space-y-3">
                {/* PublicacionCard base */}
                <PublicacionCard
                  publicacion={pub}
                  onToggleFavorito={handleQuitar}
                  isFavorito={true}
                />

                {/* Botón de Acción Adicional */}
                <div className="w-full bg-surface-container/30 border-x border-b border-outline-variant/30 p-4">
                  <Link to={`/publicaciones/${pub.id}`} className="w-full block">
                    {pub.modo === 'SUBASTA' ? (
                      <Button variant="outline" fullWidth className="py-2.5 text-[10px]">
                        INGRESAR A LA SUBASTA
                      </Button>
                    ) : (
                      <Button variant="primary" fullWidth className="py-2.5 text-[10px]">
                        SOLICITAR ADQUISICIÓN
                      </Button>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-28 border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-light">
              folder_special
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-white uppercase tracking-wider text-lg">Bóveda vacía</h3>
              <p className="font-body-sm text-on-surface-variant">No posee piezas guardadas en su lista de deseos en este momento.</p>
            </div>
            <Link to="/catalogo">
              <Button variant="primary" className="px-8 py-3.5">
                EXPLORAR EL CATÁLOGO
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritosPage;
