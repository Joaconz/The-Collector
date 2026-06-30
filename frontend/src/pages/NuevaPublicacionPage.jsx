import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CATEGORIAS, MODO_VENTA } from '../data/mockData';
import { createPublicacion } from '../features/publicaciones/publicacionesThunks';
import { selectPublicacionMutacion } from '../features/publicaciones/publicacionesSlice';
import { toPublicacionRequest } from '../utils/adapters';

const NuevaPublicacionPage = () => {
  const [paso, setPaso] = useState(1); // 1 | 2
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const publicando = useSelector(selectPublicacionMutacion).status === 'loading';

  // Paso 1 Form Estados
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS.RELOJES);
  const [historia, setHistoria] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [material, setMaterial] = useState('');
  const [anio, setAnio] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Paso 2 Form Estados
  const [modo, setModo] = useState(MODO_VENTA.PRECIO_FIJO); // PRECIO_FIJO | SUBASTA
  const [precio, setPrecio] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  const [incrementoMinimo, setIncrementoMinimo] = useState('500');
  const [fechaLimite, setFechaLimite] = useState('');
  const [step2Error, setStep2Error] = useState('');

  const handleSiguiente = (e) => {
    e.preventDefault();
    setStep1Error('');

    if (!nombre || !historia || !material || !anio) {
      setStep1Error('Por favor complete todos los campos obligatorios.');
      return;
    }

    setPaso(2);
  };

  const handlePublicar = async (e) => {
    e.preventDefault();
    setStep2Error('');

    if (modo === MODO_VENTA.PRECIO_FIJO) {
      if (!precio || parseFloat(precio) <= 0) {
        setStep2Error('Por favor especifique un precio de venta directo válido.');
        return;
      }
    } else {
      if (!precioBase || parseFloat(precioBase) <= 0 || !fechaLimite) {
        setStep2Error('Por favor especifique la base de subasta y una fecha de cierre válida.');
        return;
      }
    }

    // Armar especificaciones
    const especificaciones = {
      "Año": anio,
      "Material": material,
      "Procedencia": "Registro de Consignatario",
      "Estado de Conservación": "Excelente (Inspección Pendiente)"
    };

    const imagen = imagenUrl || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600&h=750";

    const form = {
      nombre,
      categoria,
      modo,
      especificaciones,
      descripcion: historia.slice(0, 150),
      historia,
      imagenUrl: imagen,
      imagenes: [imagen],
      stock: 1,
      ...(modo === MODO_VENTA.PRECIO_FIJO
        ? { precio: parseFloat(precio) }
        : {
            precioBase: parseFloat(precioBase),
            incrementoMinimo: parseFloat(incrementoMinimo),
            fechaLimiteSubasta: new Date(fechaLimite).toISOString()
          })
    };

    try {
      await dispatch(createPublicacion(toPublicacionRequest(form))).unwrap();
      toast.success('¡Publicación creada con éxito! Su artículo ya figura en su panel.');
      navigate('/vendedor');
    } catch (err) {
      setStep2Error(err?.message || 'No se pudo crear la publicación. Intente nuevamente.');
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-10 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col space-y-10 text-left">
        
        {/* Header Superior del Asistente */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/30 pb-5 gap-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/vendedor"
              className="font-label-caps text-[9px] text-on-surface-variant/75 hover:text-primary tracking-widest flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-sm font-light">arrow_back</span>
              <span>CANCELAR PUBLICACIÓN</span>
            </Link>
            <h1 className="font-headline-sm text-white uppercase tracking-wider mt-2">
              CONSIGNAR NUEVO ARTÍCULO
            </h1>
          </div>

          {/* Estado Borrador */}
          <div className="flex items-center space-x-2 text-primary font-label-caps text-[9px] tracking-wider bg-primary/10 border border-primary/25 py-1 px-3 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span>BORRADOR GUARDADO EN SESIÓN</span>
          </div>
        </div>

        {/* Stepper Visual */}
        <div className="grid grid-cols-2 gap-4 border-b border-outline-variant/15 pb-6">
          <div className="flex flex-col space-y-2">
            <span className="font-label-caps text-[9px] text-primary tracking-widest font-bold">PASO 1</span>
            <span className="font-sans text-xs font-semibold text-white">DETALLES DE LA PIEZA</span>
            <div className={`h-1 w-full ${paso >= 1 ? 'bg-primary' : 'bg-outline-variant/40'}`} />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">PASO 2</span>
            <span className="font-sans text-xs font-semibold text-white">CONFIGURAR MODALIDAD</span>
            <div className={`h-1 w-full ${paso >= 2 ? 'bg-primary' : 'bg-outline-variant/40'}`} />
          </div>
        </div>

        {/* Formulario Dinámico por Paso */}
        {paso === 1 ? (
          /* PASO 1: DETALLES */
          <form onSubmit={handleSiguiente} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Carga de Imagen Mock (md:col-span-4) */}
            <div className="md:col-span-4 flex flex-col space-y-4">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">REGISTRO FOTOGRÁFICO</span>
              
              {/* Box de Carga */}
              <div className="border border-dashed border-outline-variant hover:border-primary w-full aspect-[4/5] bg-surface-container/20 flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer">
                {imagenUrl ? (
                  <img src={imagenUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-outline font-light mb-3">photo_camera</span>
                    <span className="font-label-caps text-[9px] text-white tracking-widest font-semibold">ARRASTRE SU FOTOGRAFÍA</span>
                    <span className="font-body-sm text-[10px] text-on-surface-variant/50 mt-1">Resolución sugerida: 4:5</span>
                  </>
                )}
              </div>

              {/* Input URL Directa de Imagen para Pruebas Rápida */}
              <Input
                label="O PEGAR URL DE IMAGEN (PLACEHOLDER)"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                helperText="Puede pegar cualquier enlace directo de imagen o dejar vacío para usar uno por defecto."
              />
            </div>

            {/* Datos Técnicos de la Pieza (md:col-span-8) */}
            <div className="md:col-span-8 flex flex-col space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="TITULO DE LA PUBLICACIÓN"
                  type="text"
                  placeholder="Ej. Rolex GMT-Master II Pepsi"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  error={step1Error && !nombre ? 'Campo obligatorio' : ''}
                />
                
                <div className="flex flex-col text-left">
                  <label htmlFor="select-categoria" className="font-label-caps text-on-surface-variant mb-2.5 text-[11px] tracking-wider">
                    CATEGORÍA DEL ARTÍCULO
                  </label>
                  <select
                    id="select-categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="bg-transparent border-b border-outline-variant py-2 px-0 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value={CATEGORIAS.RELOJES} className="bg-surface-container text-white">RELOJES DE LUJO</option>
                    <option value={CATEGORIAS.JOYERIA} className="bg-surface-container text-white">ALTA JOYERÍA</option>
                    <option value={CATEGORIAS.ARTE} className="bg-surface-container text-white">OBRAS DE ARTE</option>
                    <option value={CATEGORIAS.NUMISMATICA} className="bg-surface-container text-white">NUMISMÁTICA HISTÓRICA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="MATERIAL DE CONFECCIÓN"
                  type="text"
                  placeholder="Ej. Oro Amarillo 18K, Platino..."
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  error={step1Error && !material ? 'Campo obligatorio' : ''}
                />
                <Input
                  label="AÑO DE PRODUCCIÓN"
                  type="text"
                  placeholder="Ej. 1982, 2021..."
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  error={step1Error && !anio ? 'Campo obligatorio' : ''}
                />
              </div>

              <div className="flex flex-col text-left">
                <label htmlFor="textarea-historia" className="font-label-caps text-on-surface-variant mb-2.5 text-[11px] tracking-wider">
                  CRÓNICA, HISTORIA Y PROCEDENCIA DE LA PIEZA
                </label>
                <textarea
                  id="textarea-historia"
                  rows="5"
                  placeholder="Describa el origen cronológico de la pieza, dueños anteriores, reportes de subasta pasados o cualquier detalle de autenticidad destacable."
                  value={historia}
                  onChange={(e) => setHistoria(e.target.value)}
                  className={`bg-transparent border-b border-outline-variant py-2 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors resize-none ${step1Error && !historia ? 'border-error' : ''}`}
                />
                {step1Error && !historia && (
                  <span className="text-error text-xs mt-1.5 font-body-sm block">Campo obligatorio</span>
                )}
              </div>

              {step1Error && (
                <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm">
                  {step1Error}
                </div>
              )}

              <div className="pt-6 border-t border-outline-variant/20 flex justify-end">
                <Button type="submit" variant="primary" className="px-10 py-3.5">
                  DEFINIR MODALIDAD DE VENTA →
                </Button>
              </div>

            </div>

          </form>
        ) : (
          /* PASO 2: MODALIDAD */
          <form onSubmit={handlePublicar} className="flex flex-col space-y-8">
            
            {/* Cards Selector de Modo */}
            <div className="flex flex-col space-y-3">
              <span className="font-label-caps text-on-surface-variant text-[11px] tracking-wider">SELECCIONAR CANAL DE NEGOCIACIÓN</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fixed Price Card */}
                <button
                  type="button"
                  onClick={() => setModo(MODO_VENTA.PRECIO_FIJO)}
                  className={`
                    border p-6 flex flex-col items-center justify-center space-y-3 bg-surface-container/20 hover:bg-surface-container/40 transition-all cursor-pointer text-center
                    ${modo === MODO_VENTA.PRECIO_FIJO ? 'border-primary' : 'border-outline-variant/60'}
                  `}
                >
                  <span className="material-symbols-outlined text-4xl text-primary font-light">sell</span>
                  <span className="font-label-caps text-sm text-white font-semibold">PRECIO FIJO DIRECTO</span>
                  <p className="font-body-sm text-[11px] text-on-surface-variant/80 max-w-[280px]">
                    El artículo se vende de forma directa. Los compradores pueden solicitar reserva o proponer ofertas privadas de negociación.
                  </p>
                </button>

                {/* Auction Card */}
                <button
                  type="button"
                  onClick={() => setModo(MODO_VENTA.SUBASTA)}
                  className={`
                    border p-6 flex flex-col items-center justify-center space-y-3 bg-surface-container/20 hover:bg-surface-container/40 transition-all cursor-pointer text-center
                    ${modo === MODO_VENTA.SUBASTA ? 'border-primary' : 'border-outline-variant/60'}
                  `}
                >
                  <span className="material-symbols-outlined text-4xl text-primary font-light">gavel</span>
                  <span className="font-label-caps text-sm text-white font-semibold">SUBASTA EN VIVO</span>
                  <p className="font-body-sm text-[11px] text-on-surface-variant/80 max-w-[280px]">
                    La pieza entra en sala de pujas públicas con precio base. El coleccionista con la oferta más alta al finalizar el reloj se la adjudica.
                  </p>
                </button>

              </div>
            </div>

            {/* Inputs Condicionales */}
            <div className="bg-surface-container/30 border border-outline-variant/30 p-6">
              {modo === MODO_VENTA.PRECIO_FIJO ? (
                <div className="max-w-md text-left">
                  <Input
                    label="PRECIO DE LISTA FINAL (USD)"
                    type="number"
                    placeholder="Ej. 25000"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    error={step2Error && !precio ? 'Campo obligatorio' : ''}
                  />
                  <span className="text-on-surface-variant/50 text-[10px] font-body-sm mt-1.5 block">
                    Defina el precio público en el catálogo. Las propuestas recibidas nunca serán menores al 80% de este valor.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <Input
                    label="VALOR BASE DE SALIDA (USD)"
                    type="number"
                    placeholder="Ej. 80000"
                    value={precioBase}
                    onChange={(e) => setPrecioBase(e.target.value)}
                    error={step2Error && !precioBase ? 'Campo obligatorio' : ''}
                  />
                  <Input
                    label="INCREMENTO MÍNIMO (USD)"
                    type="number"
                    placeholder="Ej. 1000"
                    value={incrementoMinimo}
                    onChange={(e) => setIncrementoMinimo(e.target.value)}
                    error={step2Error && !incrementoMinimo ? 'Campo obligatorio' : ''}
                  />
                  <Input
                    label="FECHA Y HORA DE CIERRE"
                    type="datetime-local"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    error={step2Error && !fechaLimite ? 'Campo obligatorio' : ''}
                  />
                </div>
              )}
            </div>

            {step2Error && (
              <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm text-left">
                {step2Error}
              </div>
            )}

            {/* Navegación Stepper */}
            <div className="pt-6 border-t border-outline-variant/20 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setPaso(1)} className="px-8" disabled={publicando}>
                ← VOLVER A DETALLES
              </Button>
              <Button type="submit" variant="primary" className="px-10" disabled={publicando}>
                {publicando ? 'PUBLICANDO...' : 'PUBLICAR EN EL MARKETPLACE'}
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default NuevaPublicacionPage;
