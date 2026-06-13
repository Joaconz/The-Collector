// Datos Mock Estáticos para THE COLLECTOR

export const CATEGORIAS = {
  RELOJES: "RELOJES",
  JOYERIA: "JOYERIA",
  ARTE: "ARTE",
  NUMISMATICA: "NUMISMATICA"
};

export const MODO_VENTA = {
  PRECIO_FIJO: "PRECIO_FIJO",
  SUBASTA: "SUBASTA"
};

export const ESTADO_PUBLICACION = {
  ACTIVA: "ACTIVA",
  PENDIENTE: "PENDIENTE",
  VENDIDA: "VENDIDA",
  PAUSADA: "PAUSADA"
};

export const ESTADO_RESERVA = {
  PENDIENTE: "PENDIENTE",
  CONFIRMADA: "CONFIRMADA",
  COMPLETADA: "COMPLETADA",
  RECHAZADA: "RECHAZADA"
};

export const ESTADO_OFERTA = {
  EN_REVISION: "EN_REVISION",
  CONTRAOFERTA_RECIBIDA: "CONTRAOFERTA_RECIBIDA",
  ACEPTADA: "ACEPTADA",
  RECHAZADA: "RECHAZADA"
};

export const ESTADO_SUBASTA_PARTICIPACION = {
  ABIERTA: "ABIERTA",
  CERRADA: "CERRADA"
};

export const RESULTADO_SUBASTA = {
  GANADA: "GANADA",
  SUPERADA: "SUPERADA"
};

// Usuarios mock de prueba
export const mockUsuarios = [
  {
    id: 1,
    nombre: "Joaquín González",
    email: "joaquin@thecollector.com",
    rol: "COMPRADOR", // COMPRADOR | VENDEDOR
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    antiguedad: "Miembro desde 2024",
    ubicacion: "Buenos Aires, Argentina"
  },
  {
    id: 2,
    nombre: "Aura Dolce Galería",
    email: "curador@auradolce.com",
    rol: "VENDEDOR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    antiguedad: "Vendedor Verificado desde 2022",
    ubicacion: "Madrid, España"
  }
];

// Publicaciones
export const mockPublicaciones = [
  {
    id: 1,
    ref: "REF-AP-15500",
    nombre: "Rolex Cosmograph Daytona Oystersteel",
    categoria: CATEGORIAS.RELOJES,
    modo: MODO_VENTA.PRECIO_FIJO,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precio: 32500,
    imagenUrl: "/images/watch-movement-calibre.jpg",
    imagenes: [
      "/images/watch-movement-calibre.jpg",
      "/images/watch-movement-skeleton.jpg",
    ],
    descripcion: "Rolex Cosmograph Daytona en acero Oystersteel, esfera blanca 'Panda', equipado con el legendario calibre 4130 cronógrafo automático. Bisel Cerachrom negro con escala taquimétrica.",
    historia: "Adquirido originalmente por un coleccionista suizo en 2022. La pieza ha sido preservada en condiciones de bóveda, manteniendo todos sus precintos de fábrica intactos. Incluye caja, documentación original y garantía oficial de 5 años. Se acompaña de un certificado de autenticidad emitido por nuestro maestro relojero de Aura Dolce.",
    especificaciones: {
      "Año": "2022",
      "Material": "Acero Oystersteel",
      "Diámetro": "40 mm",
      "Movimiento": "Automático Cal. 4130",
      "Estado de Conservación": "Impecable (9.9/10)",
      "Procedencia": "Ginebra, Suiza"
    },
    vendedor: "Aura Dolce Galería",
    destacado: true
  },
  {
    id: 2,
    ref: "REF-PP-5711",
    nombre: "Patek Philippe Nautilus Ref. 5711/1A-010",
    categoria: CATEGORIAS.RELOJES,
    modo: MODO_VENTA.SUBASTA,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precioBase: 110000,
    pujaActual: 145000,
    incrementoMinimo: 5000,
    fechaLimiteSubasta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días a partir de hoy
    imagenUrl: "/images/watch-movement-skeleton.jpg",
    imagenes: [
      "/images/watch-movement-skeleton.jpg",
      "/images/watch-movement-calibre.jpg",
    ],
    descripcion: "El santo grial del diseño deportivo de lujo. Patek Philippe Nautilus Ref. 5711/1A con la emblemática esfera azul degradada. Bisel satinado y brazalete integrado de ajuste perfecto.",
    historia: "Esta pieza representa una de las últimas unidades producidas en 2021 antes de la descontinuación oficial de la mítica referencia 5711/1A. Proviene de una importante colección privada de Milán, habiendo sido exhibido únicamente en exhibiciones cerradas. La procedencia está 100% documentada con trazabilidad ininterrumpida.",
    especificaciones: {
      "Año": "2021",
      "Material": "Acero Inoxidable",
      "Diámetro": "40 mm",
      "Movimiento": "Automático Cal. 26-330 S C",
      "Estado de Conservación": "Excelente (9.8/10)",
      "Procedencia": "Milán, Italia"
    },
    vendedor: "Aura Dolce Galería",
    destacado: true
  },
  {
    id: 3,
    ref: "REF-CA-COLLAR",
    nombre: "Collar Cartier 'Essential Lines' Diamantes",
    categoria: CATEGORIAS.JOYERIA,
    modo: MODO_VENTA.PRECIO_FIJO,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precio: 78000,
    imagenUrl: "/images/jewelry-diamond-necklace.jpg",
    imagenes: [
      "/images/jewelry-diamond-necklace.jpg",
      "/images/jewelry-emerald-necklace.jpg",
      "/images/jewelry-diamond-set.jpg",
    ],
    descripcion: "Gargantilla Cartier de la línea de alta joyería 'Essential Lines' confeccionada en oro blanco de 18 quilates, engastada con 65 diamantes de talla brillante con un peso total de 8.52 quilates.",
    historia: "Encargado especial para una gala benéfica en Mónaco en el año 2019. Cada diamante ha sido clasificado individualmente por el GIA con color F y pureza VVS1. Se entrega en el legendario estuche rojo de Cartier con todos los papeles de tasación originales y factura de compra.",
    especificaciones: {
      "Año": "2019",
      "Material": "Oro Blanco de 18K",
      "Gemas": "65 Diamantes Brillantes (8.52 ct)",
      "Pureza/Color": "VVS1 / Color F",
      "Estado de Conservación": "Como nuevo (10/10)",
      "Procedencia": "Mónaco"
    },
    vendedor: "Joyeros de la Corte",
    destacado: false
  },
  {
    id: 4,
    ref: "REF-TF-SOLESTE",
    nombre: "Anillo de Compromiso Tiffany & Co. Soleste",
    categoria: CATEGORIAS.JOYERIA,
    modo: MODO_VENTA.PRECIO_FIJO,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precio: 18500,
    imagenUrl: "/images/jewelry-sapphire-ring.jpg",
    imagenes: [
      "/images/jewelry-sapphire-ring.jpg",
      "/images/jewelry-emerald-brooch.jpg",
    ],
    descripcion: "Anillo Soleste de Tiffany & Co. con un impresionante diamante central de talla cojín rodeado por una doble hilera de diamantes de talla brillante redonda engastados en platino.",
    historia: "Adquirido en la icónica Quinta Avenida de Nueva York en 2018. El diamante central posee certificación oficial de Tiffany con un peso de 1.25 quilates, color E y claridad VS2. Una obra de arte de simetría y brillo.",
    especificaciones: {
      "Año": "2018",
      "Material": "Platino 950",
      "Gema Central": "Diamante Talla Cojín (1.25 ct)",
      "Borde": "Doble halo de brillantes",
      "Estado de Conservación": "Pulido profesional (9.7/10)",
      "Procedencia": "Nueva York, USA"
    },
    vendedor: "Aura Dolce Galería",
    destacado: false
  },
  {
    id: 5,
    ref: "REF-JM-OISEAU",
    nombre: "Joan Miró - 'L'Oiseau au Plumage Sombre'",
    categoria: CATEGORIAS.ARTE,
    modo: MODO_VENTA.SUBASTA,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precioBase: 85000,
    pujaActual: 98000,
    incrementoMinimo: 2000,
    fechaLimiteSubasta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1.5).toISOString(), // 1.5 días
    imagenUrl: "/images/painting-landscape-museum.jpg",
    imagenes: [
      "/images/painting-landscape-museum.jpg",
      "/images/painting-seascape-museum.jpg",
      "/images/art-marble-sculpture.jpg",
    ],
    descripcion: "Litografía a color numerada y firmada a mano por Joan Miró, estampada en papel de Arches de alto gramaje. Lote de tiraje limitado a 50 copias.",
    historia: "Creada por el maestro catalán en 1973. Proviene directamente de la Colección de la Fundación de Arte de Barcelona, contando con sello seco oficial y el número de lote 12/50. La procedencia está ratificada e inscrita en el catálogo razonado de Miró.",
    especificaciones: {
      "Año": "1973",
      "Técnica": "Litografía a Color",
      "Soporte": "Papel Arches con Filigrana",
      "Dimensiones": "65 x 50 cm",
      "Firmado": "Firmado a mano con lápiz de grafito",
      "Procedencia": "Barcelona, España"
    },
    vendedor: "Aura Dolce Galería",
    destacado: true
  },
  {
    id: 6,
    ref: "REF-NUM-C3",
    nombre: "8 Escudos Carlos III de Oro (1780)",
    categoria: CATEGORIAS.NUMISMATICA,
    modo: MODO_VENTA.PRECIO_FIJO,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precio: 9500,
    imagenUrl: "/images/coin-gold-escudo.jpg",
    imagenes: [
      "/images/coin-gold-escudo.jpg",
      "/images/coin-roman-aureus.jpg",
    ],
    descripcion: "Moneda de oro de 8 Escudos acuñada en la Real Casa de Moneda de Madrid en el año 1780, bajo el reinado de Carlos III de España. Ceca 'M' y ensayador 'PJ'.",
    historia: "Hallada en una bóveda de un banco histórico de Sevilla en 1995. Ha recibido la calificación oficial de 'About Uncirculated' (AU-58) por el prestigioso servicio de graduación NGC, lo que representa un estado de conservación excepcional para su edad y tipo.",
    especificaciones: {
      "Año": "1780",
      "Material": "Oro Ley 0.901",
      "Peso": "27.07 gramos",
      "Ceca": "Madrid (M coronada)",
      "Certificado": "NGC AU-58 (Nro 4839201)",
      "Procedencia": "Sevilla, España"
    },
    vendedor: "Aura Dolce Galería",
    destacado: false
  },
  {
    id: 7,
    ref: "REF-NUM-MS93",
    nombre: "Dólar de Plata Morgan 1893-S Leyenda",
    categoria: CATEGORIAS.NUMISMATICA,
    modo: MODO_VENTA.SUBASTA,
    estado: ESTADO_PUBLICACION.ACTIVA,
    precioBase: 40000,
    pujaActual: 45000,
    incrementoMinimo: 1000,
    fechaLimiteSubasta: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // Termina en 12 horas
    imagenUrl: "/images/coin-silver-denarius.jpg",
    imagenes: [
      "/images/coin-silver-denarius.jpg",
      "/images/coin-silver-athena.jpg",
      "/images/coin-silver-cross.jpg",
    ],
    descripcion: "La moneda reina de las acuñaciones de dólares Morgan. El dólar de plata Morgan acuñado en San Francisco en 1893 (1893-S). Acuñación extremadamente limitada.",
    historia: "Proviene de la famosa colección privada 'Red River' de Texas. Esta pieza ha sido certificada por la PCGS con graduación VF-35, garantizando su autenticidad y excelente preservación. Solo se acuñaron 100,000 unidades de este lote.",
    especificaciones: {
      "Año": "1893",
      "Ceca": "San Francisco (S)",
      "Graduación": "PCGS VF-35",
      "Material": "Plata Ley 0.900",
      "Peso": "26.73 gramos",
      "Procedencia": "Texas, USA"
    },
    vendedor: "Numismática Real",
    destacado: false
  },
  {
    id: 8,
    ref: "REF-AP-RO",
    nombre: "Audemars Piguet Royal Oak 'Jumbo' 15202ST",
    categoria: CATEGORIAS.RELOJES,
    modo: MODO_VENTA.PRECIO_FIJO,
    estado: ESTADO_PUBLICACION.VENDIDA,
    precio: 42000,
    imagenUrl: "/images/watch-pocket-enamel.jpg",
    imagenes: [
      "/images/watch-pocket-enamel.jpg",
      "/images/watch-movement-calibre.jpg",
    ],
    descripcion: "Audemars Piguet Royal Oak Ultra-Thin 'Jumbo' en acero inoxidable con la clásica esfera azul 'Petite Tapisserie'. Calibre manufactura 2121.",
    historia: "Comprado originalmente en la boutique AP de Ginebra en 2020. Adjudicado y transferido a un coleccionista argentino. La pieza cuenta con su set completo de estuche de madera lacada, manuales y garantía internacional vigente.",
    especificaciones: {
      "Año": "2020",
      "Material": "Acero Inoxidable",
      "Diámetro": "39 mm",
      "Calibre": "AP 2121 (Extra-plano)",
      "Estado de Conservación": "Perfecto (9.9/10)",
      "Procedencia": "Ginebra, Suiza"
    },
    vendedor: "Aura Dolce Galería",
    destacado: false
  }
];

// Lista de Deseos (Favoritos / "Carrito")
// Inicializada con algunas piezas del usuario 1
export const mockFavoritos = [1, 3, 5];

// Reservas Realizadas
export const mockReservas = [
  {
    id: 101,
    piezaId: 1, // Rolex Daytona
    ref: "RES-2026-001",
    estado: ESTADO_RESERVA.CONFIRMADA,
    precioAcordado: 32500,
    fecha: "2026-05-15",
    vendedor: "Aura Dolce Galería",
    tipo: "Adquisición Directa"
  },
  {
    id: 102,
    piezaId: 6, // 8 Escudos Carlos III
    ref: "RES-2026-002",
    estado: ESTADO_RESERVA.PENDIENTE,
    precioAcordado: 9500,
    fecha: "2026-05-27",
    vendedor: "Aura Dolce Galería",
    tipo: "Reserva Bajo Aprobación"
  },
  {
    id: 103,
    piezaId: 8, // AP Royal Oak
    ref: "RES-2026-003",
    estado: ESTADO_RESERVA.COMPLETADA,
    precioAcordado: 42000,
    fecha: "2026-04-10",
    vendedor: "Aura Dolce Galería",
    tipo: "Adquisición Directa - Liquidada"
  }
];

// Ofertas Privadas Realizadas
export const mockOfertas = [
  {
    id: 201,
    piezaId: 3, // Collar Cartier
    ref: "OFE-502-01",
    precioOriginal: 78000,
    precioOfertado: 72000,
    precioContraoferta: 75000,
    estado: ESTADO_OFERTA.CONTRAOFERTA_RECIBIDA,
    vendedor: "Joyeros de la Corte",
    fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString() // Termina en 18 horas
  },
  {
    id: 202,
    piezaId: 4, // Anillo Tiffany
    ref: "OFE-502-02",
    precioOriginal: 18500,
    precioOfertado: 17000,
    precioContraoferta: null,
    estado: ESTADO_OFERTA.EN_REVISION,
    vendedor: "Aura Dolce Galería",
    fechaLimite: null
  }
];

// Pujas en vivo de Subasta
export const mockPujas = [
  { id: 1, usuario: "Coleccionista_GVA", monto: 120000, fecha: "Hace 2 horas" },
  { id: 2, usuario: "PrestigeArt", monto: 125000, fecha: "Hace 1 hora" },
  { id: 3, usuario: "NumisLover", monto: 130000, fecha: "Hace 45 min" },
  { id: 4, usuario: "PrestigeArt", monto: 135000, fecha: "Hace 20 min" },
  { id: 5, usuario: "Joaquín González", monto: 145000, fecha: "Hace 5 min" } // El usuario actual tiene la mejor puja
];

// Participación del usuario actual en Subastas (Mis Subastas - Comprador)
export const mockMisSubastas = [
  {
    id: 401,
    piezaId: 2, // Patek Philippe Nautilus
    ref: "SUB-2026-001",
    pujaUsuario: 145000,
    pujaLider: 145000,
    estado: ESTADO_SUBASTA_PARTICIPACION.ABIERTA,
    resultado: null,
    fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días
    vendedor: "Aura Dolce Galería"
  },
  {
    id: 402,
    piezaId: 5, // Joan Miró
    ref: "SUB-2026-002",
    pujaUsuario: 92000,
    pujaLider: 98000,
    estado: ESTADO_SUBASTA_PARTICIPACION.ABIERTA,
    resultado: null,
    fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1.5).toISOString(), // 1.5 días
    vendedor: "Aura Dolce Galería"
  },
  {
    id: 403,
    piezaId: 7, // Dólar Morgan
    ref: "SUB-2026-003",
    pujaUsuario: 44000,
    pujaLider: 45000,
    estado: ESTADO_SUBASTA_PARTICIPACION.ABIERTA,
    resultado: null,
    fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 horas
    vendedor: "Numismática Real"
  },
  {
    id: 404,
    piezaId: 5, // Joan Miró - subasta anterior ganada
    ref: "SUB-2025-010",
    pujaUsuario: 102000,
    pujaLider: 102000,
    estado: ESTADO_SUBASTA_PARTICIPACION.CERRADA,
    resultado: RESULTADO_SUBASTA.GANADA,
    fechaLimite: "2025-11-20T18:00:00.000Z",
    vendedor: "Aura Dolce Galería"
  },
  {
    id: 405,
    piezaId: 7, // Dólar Morgan - subasta anterior perdida
    ref: "SUB-2025-011",
    pujaUsuario: 38000,
    pujaLider: 42000,
    estado: ESTADO_SUBASTA_PARTICIPACION.CERRADA,
    resultado: RESULTADO_SUBASTA.SUPERADA,
    fechaLimite: "2025-10-05T18:00:00.000Z",
    vendedor: "Numismática Real"
  }
];

// Historial de Ventas Completadas (Vendedor: "Aura Dolce Galería")
export const TIPO_OPERACION = {
  VENTA_DIRECTA: "VENTA_DIRECTA",
  OFERTA_ACEPTADA: "OFERTA_ACEPTADA",
  SUBASTA_ADJUDICADA: "SUBASTA_ADJUDICADA"
};

export const mockVentas = [
  {
    id: 301,
    piezaId: 8, // AP Royal Oak — VENDIDA
    ref: "VTA-2026-001",
    comprador: "Joaquín González",
    precioFinal: 42000,
    tipoOperacion: TIPO_OPERACION.VENTA_DIRECTA,
    fechaVenta: "2026-04-10",
    comision: 2100 // 5% sobre el precio final
  },
  {
    id: 302,
    piezaId: 1, // Rolex Daytona — reserva confirmada
    ref: "VTA-2026-002",
    comprador: "Coleccionista_GVA",
    precioFinal: 32500,
    tipoOperacion: TIPO_OPERACION.VENTA_DIRECTA,
    fechaVenta: "2026-05-15",
    comision: 1625
  },
  {
    id: 303,
    piezaId: 5, // Joan Miró — subasta anterior adjudicada
    ref: "VTA-2025-014",
    comprador: "PrestigeArt",
    precioFinal: 102000,
    tipoOperacion: TIPO_OPERACION.SUBASTA_ADJUDICADA,
    fechaVenta: "2025-11-20",
    comision: 5100
  },
  {
    id: 304,
    piezaId: 4, // Anillo Tiffany — oferta aceptada anterior
    ref: "VTA-2025-009",
    comprador: "Elena Martínez",
    precioFinal: 17200,
    tipoOperacion: TIPO_OPERACION.OFERTA_ACEPTADA,
    fechaVenta: "2025-08-05",
    comision: 860
  }
];

// Base de datos reactiva simulada con almacenamiento local
// para permitir manipulación básica de estado en la sesión actual
let publicaciones = [...mockPublicaciones];
let favoritos = [...mockFavoritos];
let reservas = [...mockReservas];
let ofertas = [...mockOfertas];
let pujas = [...mockPujas];
let misSubastas = [...mockMisSubastas];

export const getPublicaciones = () => publicaciones;
export const getPublicacionById = (id) => publicaciones.find(p => p.id === parseInt(id));
export const getFavoritos = () => publicaciones.filter(p => favoritos.includes(p.id));
export const toggleFavorito = (id) => {
  const pId = parseInt(id);
  if (favoritos.includes(pId)) {
    favoritos = favoritos.filter(f => f !== pId);
    return false;
  } else {
    favoritos.push(pId);
    return true;
  }
};
export const getReservas = () => reservas;
export const addReserva = (reserva) => {
  const newRes = {
    id: reservas.length + 101,
    ref: `RES-2026-00${reservas.length + 1}`,
    estado: ESTADO_RESERVA.PENDIENTE,
    fecha: new Date().toISOString().split('T')[0],
    ...reserva
  };
  reservas.unshift(newRes);
  return newRes;
};

export const getOfertas = () => ofertas;
export const addOferta = (oferta) => {
  const newOf = {
    id: ofertas.length + 201,
    ref: `OFE-502-0${ofertas.length + 1}`,
    estado: ESTADO_OFERTA.EN_REVISION,
    precioContraoferta: null,
    fechaLimite: null,
    ...oferta
  };
  ofertas.unshift(newOf);
  return newOf;
};

export const updateOfertaEstado = (id, nuevoEstado) => {
  const of = ofertas.find(o => o.id === parseInt(id));
  if (of) {
    of.estado = nuevoEstado;
    if (nuevoEstado === ESTADO_OFERTA.ACEPTADA) {
      // Si se acepta la oferta, crear una reserva confirmada
      addReserva({
        piezaId: of.piezaId,
        precioAcordado: of.precioContraoferta || of.precioOfertado,
        vendedor: of.vendedor,
        tipo: "Adquisición por Oferta Aceptada",
        estado: ESTADO_RESERVA.CONFIRMADA
      });
    }
  }
};

export const responderOferta = (id, accion, montoContraoferta = null) => {
  const of = ofertas.find(o => o.id === parseInt(id));
  if (!of) return;
  if (accion === 'ACEPTAR') {
    of.estado = ESTADO_OFERTA.ACEPTADA;
    addReserva({
      piezaId: of.piezaId,
      precioAcordado: of.precioOfertado,
      vendedor: of.vendedor,
      tipo: 'Adquisición por Oferta Aceptada',
      estado: ESTADO_RESERVA.CONFIRMADA
    });
  } else if (accion === 'RECHAZAR') {
    of.estado = ESTADO_OFERTA.RECHAZADA;
  } else if (accion === 'CONTRAOFERTA') {
    of.estado = ESTADO_OFERTA.CONTRAOFERTA_RECIBIDA;
    of.precioContraoferta = montoContraoferta;
    of.fechaLimite = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  }
};

export const getMisSubastas = () => misSubastas;

export const getPujas = () => pujas;
export const addPuja = (monto, usuario = "Joaquín González") => {
  const newPuja = {
    id: pujas.length + 1,
    usuario,
    monto,
    fecha: "Hace unos instantes"
  };
  pujas.unshift(newPuja);
  // Actualizar la puja en la publicación
  const p = publicaciones.find(pub => pub.id === 2); // Simulación ligada al Patek Nautilus (id 2)
  if (p) {
    p.pujaActual = monto;
  }
  return newPuja;
};
export const resetPujas = () => {
  pujas = [...mockPujas];
};
export const getVendedorPublicaciones = () => {
  return publicaciones.filter(p => p.vendedor === "Aura Dolce Galería");
};
export const addPublicacion = (pub) => {
  const newPub = {
    id: publicaciones.length + 1,
    ref: `REF-VEND-${1000 + publicaciones.length}`,
    estado: ESTADO_PUBLICACION.PENDIENTE,
    vendedor: "Aura Dolce Galería",
    imagenUrl: pub.imagenUrl || "/images/watch-movement.jpg",
    imagenes: [pub.imagenUrl || "/images/watch-movement.jpg"],
    ...pub
  };
  publicaciones.unshift(newPub);
  return newPub;
};
export const updatePublicacion = (id, updatedPub) => {
  const index = publicaciones.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    publicaciones[index] = {
      ...publicaciones[index],
      ...updatedPub
    };
    return publicaciones[index];
  }
  return null;
};

// Funciones de Ventas (read-only, el historial no muta en el mock)
export const getVentas = () => [...mockVentas];
export const getVentasByVendedor = () => [...mockVentas]; // Todas son de Aura Dolce en el mock
