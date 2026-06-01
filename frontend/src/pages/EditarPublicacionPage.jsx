import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getPublicacionById, updatePublicacion, CATEGORIAS } from '../data/mockData';

const EditarPublicacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pub, setPub] = useState(null);
  
  // Tab activa
  const [tabActiva, setTabActiva] = useState('DETALLES'); // 'DETALLES' | 'MODALIDAD'

  // Detalles Form Estados
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [historia, setHistoria] = useState('');
  const [material, setMaterial] = useState('');
  const [anio, setAnio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  // Modalidad Form Estados
  const [precio, setPrecio] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  const [incrementoMinimo, setIncrementoMinimo] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    const item = getPublicacionById(id);
    if (item) {
      setPub(item);
      setNombre(item.nombre);
      setCategoria(item.categoria);
      setHistoria(item.historia);
      setMaterial(item.especificaciones.Material || '');
      setAnio(item.especificaciones.Año || '');
      setImagenUrl(item.imagenUrl);

      setPrecio(item.precio || '');
      setPrecioBase(item.precioBase || '');
      setIncrementoMinimo(item.incrementoMinimo || '');
      
      if (item.fechaLimiteSubasta) {
        // Formatear fecha para datetime-local input (YYYY-MM-DDTHH:MM)
        const date = new Date(item.fechaLimiteSubasta);
        const formattedDate = date.toISOString().slice(0, 16);
        setFechaLimite(formattedDate);
      }
    }
  }, [id]);

  if (!pub) {
    return (
      <div className="py-24 px-6 text-center max-w-md mx-auto flex flex-col items-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-error font-light">warning</span>
        <h2 className="font-headline-sm text-white uppercase tracking-wider">PIEZA NO ENCONTRADA</h2>
        <p className="font-body-sm text-on-surface-variant">El artículo que intenta editar no figura en los registros.</p>
        <Link to="/vendedor">
          <Button variant="outline">VOLVER AL PANEL</Button>
        </Link>
      </div>
    );
  }

  const handleGuardar = (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !historia || !material || !anio) {
      setError('Por favor complete todos los campos requeridos de la pestaña Detalles.');
      return;
    }

    // Armar objeto editado
    const editado = {
      nombre,
      categoria,
      historia,
      imagenUrl,
      especificaciones: {
        ...pub.especificaciones,
        "Año": anio,
        "Material": material
      },
      ...(pub.modo === 'PRECIO_FIJO'
        ? { precio: parseFloat(precio) }
        : {
            precioBase: parseFloat(precioBase),
            incrementoMinimo: parseFloat(incrementoMinimo),
            fechaLimiteSubasta: new Date(fechaLimite).toISOString()
          })
    };

    updatePublicacion(pub.id, editado);
    toast.success('Cambios guardados. La publicación ha sido actualizada.');
    navigate('/vendedor');
  };

  return (
    <div className="w-full bg-background min-h-screen py-10 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col space-y-10 text-left">
        
        {/* Header Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/30 pb-5 gap-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/vendedor"
              className="font-label-caps text-[9px] text-on-surface-variant/75 hover:text-primary tracking-widest flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm font-light">arrow_back</span>
              <span>VOLVER AL PANEL</span>
            </Link>
            <h1 className="font-headline-sm text-white uppercase tracking-wider mt-2">
              EDITAR PUBLICACIÓN #{pub.ref}
            </h1>
          </div>
          
          <Badge status={pub.estado}>{pub.estado}</Badge>
        </div>

        {/* Pestañas de Edición de Diseño Stitch */}
        <div className="flex border-b border-outline-variant/20">
          {[
            { key: 'DETALLES', label: '1. DETALLES DE LA PIEZA' },
            { key: 'MODALIDAD', label: '2. CONFIGURAR CANAL Y VALOR' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className={`
                font-label-caps text-[10px] tracking-widest pb-3 px-6 relative cursor-pointer transition-all duration-300
                ${tabActiva === tab.key ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'}
              `}
            >
              {tab.label}
              {tabActiva === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleGuardar} className="flex flex-col space-y-8">
          
          {tabActiva === 'DETALLES' ? (
            /* CONTENIDO TAB DETALLES */
            <div key="DETALLES" className="animate-fade-in-up grid grid-cols-1 md:grid-cols-12 gap-8">

              {/* Imagen — sticky sidebar */}
              <div className="md:col-span-5 flex flex-col space-y-4 md:sticky md:top-10 md:self-start">
                <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">
                  PREVISUALIZACIÓN DE PIEZA
                </span>
                <div className="relative group w-full aspect-[4/5] bg-black border border-outline-variant overflow-hidden">
                  <img src={imagenUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="font-label-caps text-[10px] text-white border border-white/40 px-4 py-2 hover:bg-white/10 transition-colors active:scale-[0.97]">
                      CAMBIAR IMAGEN
                    </span>
                  </div>
                </div>
                <Input
                  label="URL DE FOTOGRAFÍA"
                  type="text"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                />
              </div>

              {/* Formulario técnico */}
              <div className="md:col-span-7 flex flex-col space-y-8">

                {/* IDENTIFICACIÓN */}
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-3">
                    <span className="font-label-caps text-[9px] text-outline tracking-[0.2em]">IDENTIFICACIÓN</span>
                    <div className="flex-1 h-px bg-outline-variant/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="TITULO DE LA PIEZA"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      error={error && !nombre ? 'Campo obligatorio' : ''}
                    />
                    <div className="flex flex-col text-left">
                      <label htmlFor="edit-categoria" className="font-label-caps text-on-surface-variant mb-2.5 text-[11px] tracking-wider">
                        CATEGORÍA
                      </label>
                      <select
                        id="edit-categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="bg-transparent border-b border-outline-variant py-2 px-0 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {Object.values(CATEGORIAS).map(cat => (
                          <option key={cat} value={cat} className="bg-surface-container text-white">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* MATERIALIDAD */}
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-3">
                    <span className="font-label-caps text-[9px] text-outline tracking-[0.2em]">MATERIALIDAD</span>
                    <div className="flex-1 h-px bg-outline-variant/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="MATERIAL DE CONFECCIÓN"
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      error={error && !material ? 'Campo obligatorio' : ''}
                    />
                    <Input
                      label="AÑO DE PRODUCCIÓN"
                      type="text"
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      error={error && !anio ? 'Campo obligatorio' : ''}
                    />
                  </div>
                </div>

                {/* HISTORIA Y PROCEDENCIA */}
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-3">
                    <span className="font-label-caps text-[9px] text-outline tracking-[0.2em]">HISTORIA Y PROCEDENCIA</span>
                    <div className="flex-1 h-px bg-outline-variant/20" />
                  </div>
                  <div className="flex flex-col text-left">
                    <label htmlFor="edit-textarea" className="font-label-caps text-on-surface-variant mb-2.5 text-[11px] tracking-wider">
                      CRÓNICA, HISTORIA Y PROCEDENCIA DE LA PIEZA
                    </label>
                    <textarea
                      id="edit-textarea"
                      rows="6"
                      value={historia}
                      onChange={(e) => setHistoria(e.target.value)}
                      className="bg-transparent border-b border-outline-variant py-2 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* CONTENIDO TAB MODALIDAD */
            <div key="MODALIDAD" className="animate-fade-in-up flex flex-col space-y-6">

              {/* Bloqueo de Modalidad */}
              <div className="p-4 border border-primary/30 bg-primary/5 flex items-start space-x-3 text-left">
                <span className="material-symbols-outlined text-primary text-2xl font-light">lock</span>
                <div className="flex flex-col space-y-1">
                  <span className="font-label-caps text-primary text-[10px] tracking-widest font-bold">
                    CANAL DE COMERCIALIZACIÓN ACTIVO Y ASEGURADO
                  </span>
                  <p className="font-body-sm text-on-surface-variant/80 text-xs">
                    El artículo se encuentra en circulación bajo el canal {pub.modo === 'SUBASTA' ? 'SUBASTA EN VIVO' : 'PRECIO FIJO'}. Para salvaguardar la integridad de las pujas y de las solicitudes de reserva de coleccionistas, no se admite la mutación del canal. Puede ajustar los montos y fechas de cierre.
                  </p>
                </div>
              </div>

              {/* Inputs de Precios correspondientes */}
              <div className="bg-surface-container/30 border border-outline-variant/30 p-6 text-left">
                {pub.modo === 'PRECIO_FIJO' ? (
                  <div className="max-w-md">
                    <Input
                      label="PRECIO DE LISTA FINAL (USD)"
                      type="number"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                    <span className="text-on-surface-variant/50 text-[10px] font-body-sm mt-1.5 block">
                      Las reservas activas previas conservarán el precio pactado original.
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="VALOR BASE DE SALIDA (USD)"
                      type="number"
                      value={precioBase}
                      onChange={(e) => setPrecioBase(e.target.value)}
                    />
                    <Input
                      label="INCREMENTO MÍNIMO (USD)"
                      type="number"
                      value={incrementoMinimo}
                      onChange={(e) => setIncrementoMinimo(e.target.value)}
                    />
                    <Input
                      label="FECHA Y HORA DE CIERRE"
                      type="datetime-local"
                      value={fechaLimite}
                      onChange={(e) => setFechaLimite(e.target.value)}
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {error && (
            <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm">
              {error}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
            <Link to="/vendedor">
              <Button type="button" variant="outline" className="px-8">
                CANCELAR EDICIÓN
              </Button>
            </Link>
            
            <Button type="submit" variant="primary" className="px-10">
              GUARDAR CAMBIOS
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditarPublicacionPage;
