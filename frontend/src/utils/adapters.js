import { MODO_VENTA } from '../data/mockData';

const CATEGORIA_BACKEND_TO_FRONTEND = {
  RELOJ: 'RELOJES',
};

const CATEGORIA_FRONTEND_TO_BACKEND = {
  RELOJES: 'RELOJ',
};

export function mapCategoriaToFrontend(categoria) {
  return CATEGORIA_BACKEND_TO_FRONTEND[categoria] || categoria;
}

export function mapCategoriaToBackend(categoria) {
  return CATEGORIA_FRONTEND_TO_BACKEND[categoria] || categoria;
}

const ESTADO_OFERTA_BACKEND_TO_FRONTEND = {
  PENDIENTE: 'EN_REVISION',
  CONTRAOFERTA: 'CONTRAOFERTA_RECIBIDA',
};

export function mapEstadoOfertaToFrontend(estado) {
  return ESTADO_OFERTA_BACKEND_TO_FRONTEND[estado] || estado;
}

const ORIGEN_RESERVA_LABELS = {
  DIRECTA: 'Adquisición Directa',
  OFERTA: 'Adquisición por Oferta Aceptada',
  SUBASTA: 'Adjudicación de Subasta',
};

export function mapOrigenReservaLabel(origen) {
  return ORIGEN_RESERVA_LABELS[origen] || ORIGEN_RESERVA_LABELS.DIRECTA;
}

export function toPublicacion(dto) {
  if (!dto) return null;
  const producto = dto.producto || {};
  const esSubasta = dto.modo === MODO_VENTA.SUBASTA;
  const precio = esSubasta ? dto.pujaActual ?? dto.precioBase ?? producto.precio : producto.precio;

  return {
    id: dto.id,
    ref: dto.ref,
    nombre: producto.nombre,
    categoria: mapCategoriaToFrontend(producto.categoria),
    modo: dto.modo,
    estado: dto.estado,
    estadoSubasta: dto.estadoSubasta,
    precio,
    precioBase: dto.precioBase,
    pujaActual: dto.pujaActual,
    incrementoMinimo: dto.incrementoMinimo,
    fechaLimiteSubasta: dto.fechaLimiteSubasta,
    fechaPublicacion: dto.fechaPublicacion,
    imagenUrl: producto.imagenUrl || (producto.imagenes && producto.imagenes[0]) || null,
    imagenes: producto.imagenes && producto.imagenes.length ? producto.imagenes : [producto.imagenUrl].filter(Boolean),
    descripcion: producto.descripcion,
    historia: producto.historia,
    especificaciones: producto.especificaciones || {},
    stock: producto.stock,
    vendedor: dto.vendedorNombre,
    vendedorId: dto.vendedorId,
    destacado: Boolean(dto.destacado),
  };
}

export function toPublicacionRequest(form) {
  const esSubasta = form.modo === MODO_VENTA.SUBASTA;

  const request = {
    modo: form.modo,
    producto: {
      nombre: form.nombre,
      descripcion: form.descripcion,
      historia: form.historia,
      precio: esSubasta ? form.precioBase : form.precio,
      stock: form.stock ?? 1,
      categoria: mapCategoriaToBackend(form.categoria),
      imagenUrl: form.imagenUrl,
      imagenes: form.imagenes,
      especificaciones: form.especificaciones,
    },
  };

  if (esSubasta) {
    request.precioBase = form.precioBase;
    request.fechaLimiteSubasta = form.fechaLimiteSubasta;
    request.incrementoMinimo = form.incrementoMinimo;
  }

  if (form.destacado !== undefined) {
    request.destacado = form.destacado;
  }

  return request;
}

export function toUpdatePublicacionRequest(form) {
  const esSubasta = form.modo === MODO_VENTA.SUBASTA;

  const request = {
    nombre: form.nombre,
    descripcion: form.descripcion,
    historia: form.historia,
    imagenUrl: form.imagenUrl,
    categoria: mapCategoriaToBackend(form.categoria),
    precio: esSubasta ? form.precioBase : form.precio,
    imagenes: form.imagenes,
    especificaciones: form.especificaciones,
  };

  if (esSubasta) {
    request.fechaLimiteSubasta = form.fechaLimiteSubasta;
    request.incrementoMinimo = form.incrementoMinimo;
  }

  if (form.destacado !== undefined) {
    request.destacado = form.destacado;
  }

  return request;
}

export function toReserva(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    piezaId: dto.publicacionId,
    ref: `RES-${dto.id}`,
    estado: dto.estado,
    precioAcordado: dto.precioAcordado,
    fecha: dto.fechaReserva,
    fechaRespuesta: dto.fechaRespuesta,
    nombreProducto: dto.nombreProducto,
    compradorId: dto.compradorId,
    compradorNombre: dto.compradorNombre,
    origen: dto.origen,
    tipo: mapOrigenReservaLabel(dto.origen),
  };
}

export function toOferta(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    piezaId: dto.publicacionId,
    ref: `OFE-${dto.id}`,
    nombreProducto: dto.nombreProducto,
    precioOfertado: dto.precioOfertado,
    precioContraoferta: dto.precioContraoferta,
    estado: mapEstadoOfertaToFrontend(dto.estado),
    compradorId: dto.compradorId,
    compradorNombre: dto.compradorNombre,
    fecha: dto.fechaOferta,
  };
}

export function toFavorito(dto) {
  if (!dto) return null;
  return {
    favoritoId: dto.id,
    fechaAgregado: dto.fechaAgregado,
    ...toPublicacion(dto.publicacion),
  };
}

export function toCarritoItem(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    piezaId: dto.publicacionId,
    nombre: dto.nombreProducto,
    precio: dto.precio,
    imagenUrl: dto.imagenUrl,
    fechaAgregado: dto.fechaAgregado,
  };
}

export function toPuja(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    usuario: dto.pujadorNombre,
    monto: dto.monto,
    fecha: dto.fechaPuja,
  };
}
