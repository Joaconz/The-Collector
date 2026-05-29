import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicacionCard from '../components/cards/PublicacionCard';
import Button from '../components/ui/Button';
import { getPublicaciones } from '../data/mockData';

const FavoritosPage = ({ favoritos, onToggleFavorito }) => {
  const [itemsFavoritos, setItemsFavoritos] = useState([]);

  // Sincronizar favoritos con la base de datos mock local al cargar/cambiar
  useEffect(() => {
    const todos = getPublicaciones();
    const guardados = todos.filter((p) => favoritos.includes(p.id));
    setItemsFavoritos(guardados);
  }, [favoritos]);

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
            {favoritos.length === 1
              ? '1 ARTÍCULO GUARDADO EN SU BÓVEDA PRIVADA'
              : `${favoritos.length} ARTÍCULOS GUARDADOS EN SU BÓVEDA PRIVADA`}
          </p>
        </div>

        {itemsFavoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsFavoritos.map((pub) => (
              <div key={pub.id} className="flex flex-col space-y-3">
                {/* PublicacionCard base */}
                <PublicacionCard
                  publicacion={pub}
                  onToggleFavorito={onToggleFavorito}
                  isFavorito={true}
                />
                
                {/* Botón de Acción Adicional según el diseño Stitch */}
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
