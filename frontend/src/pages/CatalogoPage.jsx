import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicacionCard from '../components/cards/PublicacionCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getPublicaciones, CATEGORIAS, MODO_VENTA } from '../data/mockData';

const CatalogoPage = ({ favoritos, onToggleFavorito }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [publicacionesList, setPublicacionesList] = useState([]);
  
  // Estados para filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [modoFiltro, setModoFiltro] = useState('TODOS'); // 'TODOS' | 'PRECIO_FIJO' | 'SUBASTA'

  // Sincronizar filtro de categoría con query parameters (ej: ?cat=RELOJES)
  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam && CATEGORIAS[catParam.toUpperCase()]) {
      setCategoriaFiltro(catParam.toUpperCase());
    } else {
      setCategoriaFiltro('TODAS');
    }
  }, [searchParams]);

  // Cargar publicaciones
  useEffect(() => {
    setPublicacionesList(getPublicaciones());
  }, []);

  // Manejar cambio de pestaña de categoría
  const handleCategoryTab = (catKey) => {
    if (catKey === 'TODAS') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catKey);
    }
    setSearchParams(searchParams);
  };

  // Filtrado de publicaciones
  const publicacionesFiltradas = publicacionesList.filter((pub) => {
    // 1. Filtrado por categoría
    const matchesCategory =
      categoriaFiltro === 'TODAS' || pub.categoria === categoriaFiltro;

    // 2. Filtrado por modo de venta
    const matchesModo =
      modoFiltro === 'TODOS' || pub.modo === modoFiltro;

    // 3. Filtrado por búsqueda de texto (nombre, ref o descripción)
    const text = busqueda.toLowerCase().trim();
    const matchesSearch =
      !text ||
      pub.nombre.toLowerCase().includes(text) ||
      pub.ref.toLowerCase().includes(text) ||
      pub.descripcion.toLowerCase().includes(text);

    return matchesCategory && matchesModo && matchesSearch;
  });

  return (
    <div className="w-full bg-background min-h-screen py-16 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col space-y-12">
        {/* Header de Galería */}
        <div className="text-center flex flex-col space-y-3">
          <span className="font-label-caps text-primary text-[10px] tracking-[0.3em] font-semibold">
            BÓVEDA DE ADQUISICIONES
          </span>
          <h1 className="font-headline-md text-white uppercase tracking-[0.15em]">
            OBRAS MAESTRAS Y COLECCIONABLES
          </h1>
          <p className="font-body-sm text-on-surface-variant max-w-xl mx-auto">
            Explore nuestro catálogo curado de relojes, alta joyería, obras maestras de arte de procedencia registrada y monedas históricas graduadas.
          </p>
        </div>

        {/* Panel de Filtros & Búsqueda */}
        <div className="flex flex-col space-y-6 border-y border-outline-variant/20 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Buscador */}
            <div className="w-full md:w-96">
              <Input
                label="BUSCAR EN LA BÓVEDA"
                type="text"
                placeholder="Ej. Rolex, Cartier, 1780..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Selector de Modalidad */}
            <div className="flex items-center space-x-3 text-left">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">
                MODALIDAD:
              </span>
              <div className="flex bg-surface-container border border-outline-variant p-0.5">
                {[
                  { key: 'TODOS', label: 'TODAS' },
                  { key: MODO_VENTA.PRECIO_FIJO, label: 'PRECIO FIJO' },
                  { key: MODO_VENTA.SUBASTA, label: 'SUBASTAS' }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setModoFiltro(mode.key)}
                    className={`
                      font-label-caps text-[9px] tracking-widest px-3 py-1.5 cursor-pointer transition-all duration-300
                      ${modoFiltro === mode.key ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-white'}
                    `}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Selector de Categorías (Tabs de Diseño Stitch) */}
          <div className="flex overflow-x-auto border-t border-outline-variant/10 pt-4 scrollbar-none">
            <div className="flex space-x-6 min-w-max pb-2">
              {[
                { key: 'TODAS', label: 'TODAS LAS PIEZAS' },
                { key: CATEGORIAS.RELOJES, label: 'RELOJES DE LUJO' },
                { key: CATEGORIAS.JOYERIA, label: 'ALTA JOYERÍA' },
                { key: CATEGORIAS.ARTE, label: 'OBRAS DE ARTE' },
                { key: CATEGORIAS.NUMISMATICA, label: 'NUMISMÁTICA' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleCategoryTab(tab.key)}
                  className={`
                    font-label-caps text-[10px] tracking-[0.2em] relative pb-2 transition-all duration-300 cursor-pointer
                    ${categoriaFiltro === tab.key ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'}
                  `}
                >
                  {tab.label}
                  {categoriaFiltro === tab.key && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteo de Resultados */}
        <div className="text-left">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">
            {publicacionesFiltradas.length} PIEZAS REGISTRADAS
          </span>
        </div>

        {/* Grid de Cards */}
        {publicacionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicacionesFiltradas.map((pub) => (
              <PublicacionCard
                key={pub.id}
                publicacion={pub}
                onToggleFavorito={onToggleFavorito}
                isFavorito={favoritos.includes(pub.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 border border-dashed border-outline-variant/40 text-center flex flex-col items-center justify-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-outline-variant font-light">
              search_off
            </span>
            <span className="font-label-caps text-[11px] tracking-wider text-on-surface-variant">
              No se encontraron piezas con los filtros seleccionados
            </span>
            <button
              onClick={() => {
                setBusqueda('');
                setModoFiltro('TODOS');
                handleCategoryTab('TODAS');
              }}
              className="font-label-caps text-[10px] text-primary hover:text-white tracking-widest transition-colors font-semibold underline cursor-pointer"
            >
              RESTABLECER FILTROS
            </button>
          </div>
        )}

        {/* Paginación estática estilizada */}
        {publicacionesFiltradas.length > 0 && (
          <div className="flex justify-center items-center space-x-6 pt-12 border-t border-outline-variant/10">
            <button className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 cursor-pointer" disabled>
              <span className="material-symbols-outlined text-lg font-light">arrow_back</span>
            </button>
            <span className="font-label-caps text-[10px] tracking-widest text-primary font-bold">
              PÁGINA 1 DE 1
            </span>
            <button className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 cursor-pointer" disabled>
              <span className="material-symbols-outlined text-lg font-light">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoPage;
