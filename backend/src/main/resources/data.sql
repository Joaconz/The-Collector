-- =========================================================
-- Usuarios de prueba
-- (idempotente: el email es único, se omite si ya existe)
-- =========================================================
INSERT INTO usuarios (nombre, email, password, rol, fecha_registro)
VALUES ('Juan Perez', 'juan.perez@example.com', '$2a$10$uWbkDJT.2KD8x1FJx7FJIuL8HNh.J3bYF1yI/TE2JllKoSL3VKZUC', 'COMPRADOR', '2026-03-26')
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (nombre, email, password, rol, fecha_registro)
VALUES ('Maria Garcia', 'maria.g@example.com', '$2a$10$uWbkDJT.2KD8x1FJx7FJIuL8HNh.J3bYF1yI/TE2JllKoSL3VKZUC', 'VENDEDOR', '2026-03-25')
ON CONFLICT (email) DO NOTHING;

-- =========================================================
-- Productos
-- (idempotente: se omite si ya existe un producto con ese nombre)
-- =========================================================
INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Reloj Omega Seamaster 1960', 'Reloj vintage en excelentes condiciones.', 'Usado por un comandante de navío en los 60.', 2500.00, 1, 'RELOJ', '/images/watch-movement-calibre.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Reloj Omega Seamaster 1960');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Moneda Romana', 'Denario de plata de la época de Augusto.', 'Encontrada en excavaciones cerca de Roma en 1980.', 800.50, 3, 'NUMISMATICA', '/images/coin-roman.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Moneda Romana');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Collar de Esmeraldas Art Decó', 'Collar de esmeraldas colombianas talla esmeralda engastadas en oro blanco de 18k.', 'Pieza de colección perteneciente a una familia noble europea, adquirida en una subasta en Ginebra en 2015.', 15000.00, 1, 'JOYERIA', '/images/jewelry-emerald-necklace.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Collar de Esmeraldas Art Decó');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Litografía "Paisaje Urbano"', 'Litografía numerada y firmada, tirada limitada de 75 copias.', 'Editada en Barcelona en 1978, forma parte de una serie sobre la memoria urbana.', 3000.00, 1, 'ARTE', '/images/painting-landscape-museum.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Litografía "Paisaje Urbano"');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Reloj Patek Philippe Calatrava 1965', 'Reloj de vestir en oro rosa 18k con esfera plateada y manecillas dauphine.', 'Adquirido originalmente en Ginebra, conserva su movimiento manual original sin reparaciones mayores.', 12000.00, 1, 'RELOJ', '/images/watch-pocket-enamel.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Reloj Patek Philippe Calatrava 1965');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Anillo Solitario Diamante 2ct', 'Anillo solitario con diamante central de 2 quilates talla brillante, engastado en platino.', 'Certificado GIA color D, claridad VVS2, adquirido en una boutique de la Quinta Avenida.', 22000.00, 1, 'JOYERIA', '/images/jewelry-diamond-set.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Anillo Solitario Diamante 2ct');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT '8 Escudos Carlos III de Oro (1780)', 'Moneda de oro de 8 escudos acuñada en Madrid bajo el reinado de Carlos III.', 'Hallada en una bóveda bancaria histórica de Sevilla, certificada NGC AU-58.', 9500.00, 1, 'NUMISMATICA', '/images/coin-gold-escudo.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = '8 Escudos Carlos III de Oro (1780)');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo)
SELECT 'Escultura de Bronce "El Pensador" (Réplica de Taller)', 'Escultura en bronce patinado, fundición de taller autorizada a tamaño reducido.', 'Fundida en un taller parisino especializado en réplicas durante la primera mitad del siglo XX.', 5200.00, 1, 'ARTE', '/images/art-marble-sculpture.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Escultura de Bronce "El Pensador" (Réplica de Taller)');

-- =========================================================
-- Imágenes adicionales por producto
-- =========================================================
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/watch-movement-calibre.jpg' FROM productos p WHERE p.nombre = 'Reloj Omega Seamaster 1960'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/watch-movement-skeleton.jpg' FROM productos p WHERE p.nombre = 'Reloj Omega Seamaster 1960'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/coin-roman.jpg' FROM productos p WHERE p.nombre = 'Moneda Romana'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/coin-roman-aureus.jpg' FROM productos p WHERE p.nombre = 'Moneda Romana'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/jewelry-emerald-necklace.jpg' FROM productos p WHERE p.nombre = 'Collar de Esmeraldas Art Decó'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/jewelry-emerald-brooch.jpg' FROM productos p WHERE p.nombre = 'Collar de Esmeraldas Art Decó'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/painting-landscape-museum.jpg' FROM productos p WHERE p.nombre = 'Litografía "Paisaje Urbano"'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/painting-seascape-museum.jpg' FROM productos p WHERE p.nombre = 'Litografía "Paisaje Urbano"'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/watch-pocket-enamel.jpg' FROM productos p WHERE p.nombre = 'Reloj Patek Philippe Calatrava 1965'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/watch-movement.jpg' FROM productos p WHERE p.nombre = 'Reloj Patek Philippe Calatrava 1965'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/jewelry-diamond-set.jpg' FROM productos p WHERE p.nombre = 'Anillo Solitario Diamante 2ct'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/jewelry-diamonds.jpg' FROM productos p WHERE p.nombre = 'Anillo Solitario Diamante 2ct'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/coin-gold-escudo.jpg' FROM productos p WHERE p.nombre = '8 Escudos Carlos III de Oro (1780)'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/coin-silver-cross.jpg' FROM productos p WHERE p.nombre = '8 Escudos Carlos III de Oro (1780)'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 0, '/images/art-marble-sculpture.jpg' FROM productos p WHERE p.nombre = 'Escultura de Bronce "El Pensador" (Réplica de Taller)'
AND NOT EXISTS (SELECT 1 FROM producto_imagenes pi WHERE pi.producto_id = p.id);
INSERT INTO producto_imagenes (producto_id, orden, url)
SELECT p.id, 1, '/images/art-manuscript-illuminated.jpg' FROM productos p WHERE p.nombre = 'Escultura de Bronce "El Pensador" (Réplica de Taller)'
AND (SELECT COUNT(*) FROM producto_imagenes pi WHERE pi.producto_id = p.id) < 2;

-- =========================================================
-- Especificaciones técnicas por producto
-- =========================================================
INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '1962'),
	('Material', 'Acero inoxidable'),
	('Diámetro', '38 mm'),
	('Movimiento', 'Automático Cal. 552'),
	('Procedencia', 'Marina de Guerra, Reino Unido')
) AS specs(k, v)
WHERE p.nombre = 'Reloj Omega Seamaster 1960'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '27 a.C. - 14 d.C.'),
	('Material', 'Plata'),
	('Peso', '3.8 gramos'),
	('Ceca', 'Roma'),
	('Procedencia', 'Excavación cerca de Roma, 1980')
) AS specs(k, v)
WHERE p.nombre = 'Moneda Romana'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '1925'),
	('Material', 'Oro blanco 18K'),
	('Gemas', 'Esmeraldas colombianas (12.4 ct)'),
	('Estilo', 'Art Decó'),
	('Procedencia', 'Ginebra, Suiza')
) AS specs(k, v)
WHERE p.nombre = 'Collar de Esmeraldas Art Decó'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '1978'),
	('Técnica', 'Litografía a color'),
	('Tirada', '75 ejemplares numerados'),
	('Dimensiones', '60 x 45 cm'),
	('Procedencia', 'Barcelona, España')
) AS specs(k, v)
WHERE p.nombre = 'Litografía "Paisaje Urbano"'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '1965'),
	('Material', 'Oro rosa 18K'),
	('Diámetro', '35 mm'),
	('Movimiento', 'Manual Cal. 27-460'),
	('Procedencia', 'Ginebra, Suiza')
) AS specs(k, v)
WHERE p.nombre = 'Reloj Patek Philippe Calatrava 1965'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '2010'),
	('Material', 'Platino 950'),
	('Gema Central', 'Diamante talla brillante (2.0 ct)'),
	('Pureza/Color', 'VVS2 / Color D'),
	('Procedencia', 'Nueva York, USA')
) AS specs(k, v)
WHERE p.nombre = 'Anillo Solitario Diamante 2ct'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', '1780'),
	('Material', 'Oro Ley 0.901'),
	('Peso', '27.07 gramos'),
	('Ceca', 'Madrid (M coronada)'),
	('Certificado', 'NGC AU-58')
) AS specs(k, v)
WHERE p.nombre = '8 Escudos Carlos III de Oro (1780)'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

INSERT INTO producto_especificaciones (producto_id, clave, valor)
SELECT p.id, k, v FROM productos p, (VALUES
	('Año', 'c. 1930'),
	('Material', 'Bronce patinado'),
	('Altura', '45 cm'),
	('Técnica', 'Fundición a la cera perdida'),
	('Procedencia', 'París, Francia')
) AS specs(k, v)
WHERE p.nombre = 'Escultura de Bronce "El Pensador" (Réplica de Taller)'
AND NOT EXISTS (SELECT 1 FROM producto_especificaciones pe WHERE pe.producto_id = p.id);

-- =========================================================
-- Publicaciones (idempotente: solo si el producto no tiene publicación)
-- Vendedor: Maria Garcia
-- =========================================================
INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), false, NULL
FROM productos p, usuarios u
WHERE p.nombre = 'Reloj Omega Seamaster 1960' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), false, NULL
FROM productos p, usuarios u
WHERE p.nombre = 'Moneda Romana' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), true, NULL
FROM productos p, usuarios u
WHERE p.nombre = 'Collar de Esmeraldas Art Decó' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'SUBASTA', 3000.00, NOW() + INTERVAL '5 days', 'ABIERTA', NOW(), true, 100.00
FROM productos p, usuarios u
WHERE p.nombre = 'Litografía "Paisaje Urbano"' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'SUBASTA', 12000.00, NOW() + INTERVAL '3 days', 'ABIERTA', NOW(), false, 500.00
FROM productos p, usuarios u
WHERE p.nombre = 'Reloj Patek Philippe Calatrava 1965' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), false, NULL
FROM productos p, usuarios u
WHERE p.nombre = 'Anillo Solitario Diamante 2ct' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), true, NULL
FROM productos p, usuarios u
WHERE p.nombre = '8 Escudos Carlos III de Oro (1780)' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

INSERT INTO publicaciones (activo, producto_id, vendedor_id, estado, modo, precio_base, fecha_limite_subasta, estado_subasta, fecha_publicacion, destacado, incremento_minimo)
SELECT true, p.id, u.id, 'ACTIVA', 'PRECIO_FIJO', NULL, NULL, NULL, NOW(), false, NULL
FROM productos p, usuarios u
WHERE p.nombre = 'Escultura de Bronce "El Pensador" (Réplica de Taller)' AND u.email = 'maria.g@example.com'
AND NOT EXISTS (SELECT 1 FROM publicaciones pub WHERE pub.producto_id = p.id);

-- =========================================================
-- Pujas de ejemplo para las publicaciones en modo SUBASTA
-- Pujador: Juan Perez
-- =========================================================
INSERT INTO pujas (publicacion_id, pujador_id, monto, fecha_puja)
SELECT pub.id, u.id, 3200.00, NOW()
FROM publicaciones pub
JOIN productos p ON p.id = pub.producto_id
JOIN usuarios u ON u.email = 'juan.perez@example.com'
WHERE p.nombre = 'Litografía "Paisaje Urbano"'
AND NOT EXISTS (SELECT 1 FROM pujas pj WHERE pj.publicacion_id = pub.id);

INSERT INTO pujas (publicacion_id, pujador_id, monto, fecha_puja)
SELECT pub.id, u.id, 12500.00, NOW()
FROM publicaciones pub
JOIN productos p ON p.id = pub.producto_id
JOIN usuarios u ON u.email = 'juan.perez@example.com'
WHERE p.nombre = 'Reloj Patek Philippe Calatrava 1965'
AND NOT EXISTS (SELECT 1 FROM pujas pj WHERE pj.publicacion_id = pub.id);
