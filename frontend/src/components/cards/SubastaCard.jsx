import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useCountdown } from '../../hooks/useCountdown';

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const SubastaCard = ({ subasta }) => {
  const { pieza, ref, pujaUsuario, pujaLider, estado, resultado, fechaLimite, vendedor } = subasta;
  const countdown = useCountdown(estado === 'ABIERTA' ? fechaLimite : null);

  if (!pieza) return null;

  const esLider = Number(pujaUsuario) >= Number(pujaLider);
  const diferencia = Number(pujaLider) - Number(pujaUsuario);

  const bordeClase =
    estado === 'ABIERTA'
      ? esLider
        ? 'border-[#77dd77]/40'
        : 'border-error/40'
      : 'border-outline-variant/40 hover:border-outline';

  return (
    <div className={`bg-surface-container border text-left flex flex-col md:flex-row transition-all duration-300 ${bordeClase}`}>

      {/* Imagen miniatura */}
      <div className="w-full md:w-44 bg-black aspect-square md:aspect-auto md:h-44 border-b md:border-b-0 md:border-r border-outline-variant/20 overflow-hidden relative flex-shrink-0">
        <img
          src={pieza.imagenUrl}
          alt={pieza.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2 items-start">
          <Badge status={estado}>{estado}</Badge>
          {estado === 'ABIERTA' && (
            esLider ? (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-[#142319] text-[#77dd77] border border-[#1b3d2b] px-1.5 py-0.5 font-bold">
                PUJA LÍDER
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 font-label-caps text-[8px] bg-error text-black px-1.5 py-0.5 font-bold">
                <span className="w-1 h-1 bg-black rounded-full animate-ping" />
                <span>SUPERADA</span>
              </span>
            )
          )}
          {estado === 'CERRADA' && resultado && (
            <Badge status={resultado}>{resultado === 'GANADA' ? 'ADJUDICADA' : 'NO ADJUDICADA'}</Badge>
          )}
        </div>
      </div>

      {/* Cuerpo de detalles */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4 md:space-y-0">

        {/* Superior: Ref & Título */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider">
              {ref} • {estado === 'ABIERTA' ? 'SALA DE SUBASTA EN VIVO' : 'SALA DE SUBASTA CERRADA'}
            </span>
            <Link to={`/publicaciones/${pieza.id}`}>
              <h3 className="font-headline-sm text-lg text-white hover:text-primary transition-colors mt-0.5 font-semibold">
                {pieza.nombre}
              </h3>
            </Link>
            {vendedor && (
              <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1">
                Consignatario: {vendedor}
              </p>
            )}
          </div>

          {estado === 'ABIERTA' && (
            <div className="text-left md:text-right">
              <span className={`font-label-caps text-[8px] tracking-wider block font-bold ${countdown.urgente ? 'text-error' : 'text-on-surface-variant/60'}`}>
                TIEMPO RESTANTE
              </span>
              <span className={`font-body-sm text-[12px] font-semibold flex items-center space-x-1 justify-start md:justify-end mt-0.5 ${countdown.urgente ? 'text-error' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm font-light">schedule</span>
                <span>{countdown.texto}</span>
                {countdown.urgente && <span className="w-1 h-1 bg-error rounded-full animate-ping" />}
              </span>
            </div>
          )}

          {estado === 'CERRADA' && (
            <div className="text-left md:text-right">
              <span className="font-label-caps text-[8px] tracking-wider block font-bold text-on-surface-variant/40">
                SUBASTA FINALIZADA
              </span>
            </div>
          )}
        </div>

        {/* Inferior: Valores y Acciones */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col md:flex-row md:items-end justify-between gap-6">

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">SU PUJA MÁS ALTA</span>
              <span className="font-body-md text-sm text-on-surface-variant">{formatCurrency(pujaUsuario)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">PUJA LÍDER ACTUAL</span>
              <span className="font-body-md text-[17px] font-semibold text-[#dec2a3]">{formatCurrency(pujaLider)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-on-surface-variant/60 text-[8px] tracking-widest">DIFERENCIA</span>
              {diferencia <= 0 ? (
                <span className="font-sans text-[12px] text-[#77dd77] font-semibold">$0 — USTED LIDERA</span>
              ) : (
                <span className="font-sans text-[12px] text-error font-semibold">{formatCurrency(diferencia)} para superar</span>
              )}
            </div>
          </div>

          <div className="flex space-x-3 w-full md:w-auto">
            {estado === 'ABIERTA' ? (
              <Link to={`/publicaciones/${pieza.id}`} className="w-full md:w-auto">
                <Button variant="primary" className="w-full md:w-auto py-2 px-5 text-[9px]">
                  VER SALA DE SUBASTA
                </Button>
              </Link>
            ) : resultado === 'GANADA' ? (
              <Link to="/reservas" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto py-2 px-4 text-[9px] border-primary text-primary">
                  VER ADQUISICIÓN EN RESERVAS
                </Button>
              </Link>
            ) : (
              <span className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-wider py-2 select-none">
                SUBASTA FINALIZADA — NO ADJUDICADA
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubastaCard;
