import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const PerfilPage = ({ currentUser, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(currentUser?.nombre || '');
  const [email] = useState(currentUser?.email || '');
  const [rol] = useState(currentUser?.rol || 'COMPRADOR');
  
  // Contraseñas
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [error, setError] = useState('');

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    setError('');

    if (!nombre) {
      setError('El nombre completo es requerido.');
      return;
    }

    if (passNueva || passConfirm || passActual) {
      if (!passActual) {
        setError('Debe ingresar su contraseña actual para establecer una nueva.');
        return;
      }
      if (passNueva !== passConfirm) {
        setError('La nueva contraseña y su confirmación no coinciden.');
        return;
      }
      if (passNueva.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    // Actualizar usuario en sesión
    const updated = {
      ...currentUser,
      nombre
    };

    onLogin(updated);
    alert('¡Perfil actualizado con éxito! Los cambios se han registrado en su bóveda segura.');
    setPassActual('');
    setPassNueva('');
    setPassConfirm('');
  };

  const handleCerrarSesion = () => {
    onLogout();
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
            CONFIGURACIÓN DE PERFIL
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            ADMINISTRE SUS DATOS CIVILES DE CONTACTO Y LA SEGURIDAD DE SUS FIRMAS DIGITALES.
          </p>
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleGuardarCambios} className="flex flex-col space-y-10 text-left">
          
          {/* Ficha Visual de Usuario */}
          <div className="bg-surface-container/30 border border-outline-variant/40 p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant/60">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.nombre}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => alert('La carga de fotografía requiere integración con servicios multimedia en fase posterior.')}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>

            <div className="flex-grow text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-sans text-lg font-semibold text-white">{nombre}</span>
                <div className="self-center sm:self-auto">
                  <Badge status={rol}>{rol}</Badge>
                </div>
              </div>
              <p className="font-sans text-[11px] text-on-surface-variant/80">
                {currentUser?.ubicacion || 'Argentina'} • {currentUser?.antiguedad}
              </p>
            </div>
          </div>

          {/* Sección 1: Datos Civiles */}
          <div className="flex flex-col space-y-6">
            <h3 className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-bold border-b border-outline-variant/10 pb-2">
              DATOS DE CONTACTO
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="NOMBRE COMPLETO"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={error && !nombre ? 'Campo obligatorio' : ''}
              />
              <Input
                label="DIRECCIÓN DE CORREO (BLOQUEADO)"
                type="email"
                value={email}
                disabled
                helperText="El correo electrónico de bóveda no puede modificarse por motivos de seguridad registral."
              />
            </div>
          </div>

          {/* Sección 2: Claves de Firma */}
          <div className="flex flex-col space-y-6">
            <h3 className="font-label-caps text-primary text-[10px] tracking-[0.2em] font-bold border-b border-outline-variant/10 pb-2">
              CLAVES DE SEGURIDAD Y FIRMA
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="CONTRASEÑA ACTUAL"
                type="password"
                placeholder="••••••••"
                value={passActual}
                onChange={(e) => setPassActual(e.target.value)}
              />
              <Input
                label="NUEVA CONTRASEÑA"
                type="password"
                placeholder="••••••••"
                value={passNueva}
                onChange={(e) => setPassNueva(e.target.value)}
              />
              <Input
                label="CONFIRMAR NUEVA CLAVE"
                type="password"
                placeholder="••••••••"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs font-body-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={handleCerrarSesion}
              className="font-label-caps text-[11px] tracking-[0.2em] text-error hover:text-error/80 transition-colors cursor-pointer"
            >
              CERRAR SESIÓN
            </button>
            <Button type="submit" variant="primary" className="px-10 py-3.5">
              GUARDAR CAMBIOS DEL PERFIL
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PerfilPage;
