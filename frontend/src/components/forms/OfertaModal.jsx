import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const OfertaModal = ({
  isOpen,
  onClose,
  publicacion,
  onConfirm
}) => {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');

  // Reiniciar estado al abrir/cerrar
  useEffect(() => {
    if (isOpen && publicacion) {
      // Sugerir oferta de -5% para facilitar pruebas rápidas
      const sugerencia = Math.round(publicacion.precio * 0.95);
      setMonto(sugerencia);
      setError('');
    }
  }, [isOpen, publicacion]);

  if (!publicacion) return null;

  // Formateador de moneda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleMontoChange = (e) => {
    const val = e.target.value;
    setMonto(val);
    
    const numVal = parseFloat(val);
    if (isNaN(numVal) || numVal <= 0) {
      setError('Por favor ingrese un monto de oferta válido.');
    } else if (numVal >= publicacion.precio) {
      setError(`Su oferta privada debe ser inferior al precio publicado de ${formatCurrency(publicacion.precio)}. De lo contrario, solicite una Reserva Directa.`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numVal = parseFloat(monto);
    if (!error && numVal > 0) {
      onConfirm(numVal);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hacer Oferta Privada">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        
        {/* Info Contexto */}
        <div className="bg-[#1b1c1b] border border-outline-variant/30 p-4 space-y-2 text-left">
          <p className="font-label-caps text-[9px] text-on-surface-variant/75 tracking-wider">ARTÍCULO</p>
          <p className="font-sans text-sm font-semibold text-white truncate">{publicacion.nombre}</p>
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
            <span className="font-label-caps text-[9px] text-on-surface-variant">VALOR DE LISTA:</span>
            <span className="font-body-md text-sm font-semibold text-primary">{formatCurrency(publicacion.precio)} USD</span>
          </div>
        </div>

        {/* Input Monto */}
        <div className="space-y-1">
          <Input
            label="SU PROPUESTA ECONÓMICA (USD)"
            type="number"
            value={monto}
            onChange={handleMontoChange}
            placeholder="Ingrese el monto ofertado"
            error={error}
          />
          <p className="font-body-sm text-[10px] text-on-surface-variant/40 text-left">
            Las ofertas son analizadas individualmente por el curador de Aura Dolce. Recibirá una respuesta en menos de 24 horas.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex space-x-4 pt-4 border-t border-outline-variant/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            CANCELAR
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!!error || !monto || parseFloat(monto) <= 0}
            className="flex-1"
          >
            ENVIAR OFERTA
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default OfertaModal;
