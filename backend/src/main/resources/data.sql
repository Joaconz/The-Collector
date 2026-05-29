INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES ('Juan Perez', 'juan.perez@example.com', '$2a$10$uWbkDJT.2KD8x1FJx7FJIuL8HNh.J3bYF1yI/TE2JllKoSL3VKZUC', 'COMPRADOR', '2026-03-26');
INSERT INTO usuarios (nombre, email, password, rol, fecha_registro) VALUES ('Maria Garcia', 'maria.g@example.com', '$2a$10$uWbkDJT.2KD8x1FJx7FJIuL8HNh.J3bYF1yI/TE2JllKoSL3VKZUC', 'VENDEDOR', '2026-03-25');

INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo) VALUES ('Reloj Omega Seamaster 1960', 'Reloj vintage en excelentes condiciones.', 'Usado por un comandante de navío en los 60.', 2500.00, 1, 'RELOJ', 'http://ejemplo.com/omega.jpg', true);
INSERT INTO productos (nombre, descripcion, historia, precio, stock, categoria, imagen_url, activo) VALUES ('Moneda Romana', 'Denario de plata de la época de Augusto', 'Encontrada en excavaciones cerca de Roma en 1980', 800.50, 3, 'NUMISMATICA', 'http://ejemplo.com/moneda.jpg', true);
