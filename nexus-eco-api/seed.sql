USE NexusEcoDB;
GO

-- 1. DELETE EXISTING DATA (Child to Parent)
DELETE FROM INFORME_SERVICIO;
DELETE FROM INSPECCION;
DELETE FROM AUDITORIA;
DELETE FROM SEGUIMIENTO_INCIDENTE;
DELETE FROM INCIDENTE;
DELETE FROM EJECUCION_SERVICIO;
DELETE FROM TECNICO_PLANIFICACION;
DELETE FROM PLANIFICACION_SERVICIO;
DELETE FROM UBICACION;
DELETE FROM ORDEN_TRABAJO;
DELETE FROM DETALLE_ORDEN;
DELETE FROM ORDEN_SERVICIO;
DELETE FROM SOLICITUD_SERVICIO;
DELETE FROM TECNICO;
DELETE FROM ESPECIALIDAD;
DELETE FROM TIPO_SERVICIO;
DELETE FROM EMPLEADO;
DELETE FROM CONTACTO_CLIENTE;
DELETE FROM CLIENTE;
GO

-- 2. RESET IDENTITY COUNTERS
DBCC CHECKIDENT ('INFORME_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('INSPECCION', RESEED, 0);
DBCC CHECKIDENT ('AUDITORIA', RESEED, 0);
DBCC CHECKIDENT ('SEGUIMIENTO_INCIDENTE', RESEED, 0);
DBCC CHECKIDENT ('INCIDENTE', RESEED, 0);
DBCC CHECKIDENT ('EJECUCION_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('TECNICO_PLANIFICACION', RESEED, 0);
DBCC CHECKIDENT ('PLANIFICACION_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('UBICACION', RESEED, 0);
DBCC CHECKIDENT ('ORDEN_TRABAJO', RESEED, 0);
DBCC CHECKIDENT ('DETALLE_ORDEN', RESEED, 0);
DBCC CHECKIDENT ('ORDEN_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('SOLICITUD_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('TECNICO', RESEED, 0);
DBCC CHECKIDENT ('ESPECIALIDAD', RESEED, 0);
DBCC CHECKIDENT ('TIPO_SERVICIO', RESEED, 0);
DBCC CHECKIDENT ('EMPLEADO', RESEED, 0);
DBCC CHECKIDENT ('CONTACTO_CLIENTE', RESEED, 0);
DBCC CHECKIDENT ('CLIENTE', RESEED, 0);
GO

-- 3. INSERT MOCK DATA
-- CLIENTES
INSERT INTO CLIENTE (razon_social, ruc, direccion, email_cliente, estado) VALUES 
('Industrias Mineras del Sur S.A.', '20100200300', 'Av. Los Minerales 450, Arequipa', 'contacto@imsur.pe', 'ACTIVO'),
('Hospital General San Juan', '20400500600', 'Jr. Salud 123, Lima', 'logistica@hsanjuan.pe', 'ACTIVO'),
('Corporacion Maderera Selva', '20700800900', 'Carretera Iquitos Km 4', 'ventas@madereraselva.pe', 'ACTIVO'),
('Complejo Agroindustrial Norte', '20900100200', 'Panamericana Norte Km 500, Trujillo', 'agro@norte.pe', 'ACTIVO');

-- CONTACTOS DE CLIENTES
INSERT INTO CONTACTO_CLIENTE (nombre_con, cargo, telefono_con, email_contacto, id_cliente) VALUES
('Roberto Suarez', 'Gerente de Logistica', '987654321', 'roberto.s@imsur.pe', 1),
('Ana Mendoza', 'Jefa de Compras', '912345678', 'amendoza@hsanjuan.pe', 2),
('Jorge Valdivia', 'Administrador', '998877665', 'jvaldivia@madereraselva.pe', 3),
('Silvia Rodriguez', 'Supervisora SSO', '991122334', 'srodriguez@norte.pe', 4);

-- EMPLEADOS
INSERT INTO EMPLEADO (nombre_emp, apellido_emp, cargo_emp, area) VALUES 
('Juan', 'Perez', 'Inspector Senior', 'Operaciones'),
('Maria', 'Gomez', 'Auditora Ambiental', 'Calidad'),
('Carlos', 'Ramirez', 'Coordinador de Servicios', 'Operaciones');

-- TIPOS DE SERVICIO
INSERT INTO TIPO_SERVICIO (nombre_servicio, descripcion_ts, precio_base) VALUES 
('Tratamiento de Aguas Residuales', 'Purificacion y tratamiento de efluentes', 3500.00),
('Gestion de Residuos Peligrosos', 'Recoleccion y disposicion final segura', 1200.00),
('Monitoreo de Calidad de Aire', 'Medicion de particulas y gases', 850.00),
('Auditoria Ambiental', 'Inspeccion completa de procesos', 2000.00);

-- SOLICITUDES
-- Meses anteriores para graficos
INSERT INTO SOLICITUD_SERVICIO (fecha_solicitud, descripcion_sol, estado_sol, id_cliente, id_empleado) VALUES 
('2026-04-15 10:00:00', 'Servicio recurrente de tratamiento', 'COMPLETADO', 1, 1),
('2026-05-10 11:30:00', 'Recoleccion mensual', 'COMPLETADO', 2, 2),
('2026-05-20 09:00:00', 'Inspeccion de aire', 'COMPLETADO', 3, 3),
('2026-06-05 14:00:00', 'Tratamiento urgente', 'EN_PROCESO', 1, 1),
('2026-06-15 08:30:00', 'Auditoria anual', 'EN_PROCESO', 4, 2),
('2026-07-01 10:15:00', 'Gestion de residuos toxicos', 'PENDIENTE', 2, 3),
('2026-07-08 16:00:00', 'Monitoreo preventivo', 'PENDIENTE', 3, 1);

-- ORDENES DE SERVICIO
INSERT INTO ORDEN_SERVICIO (fecha_orden, estado_orden, monto_total, id_solicitud_servicio) VALUES 
('2026-04-15 10:00:00', 'COMPLETADO', 3500.00, 1),
('2026-05-10 11:30:00', 'COMPLETADO', 1200.00, 2),
('2026-05-20 09:00:00', 'COMPLETADO', 850.00, 3),
('2026-06-05 14:00:00', 'EN_PROCESO', 3500.00, 4),
('2026-06-15 08:30:00', 'EN_PROCESO', 2000.00, 5),
('2026-07-01 10:15:00', 'PENDIENTE', 1200.00, 6),
('2026-07-08 16:00:00', 'PENDIENTE', 850.00, 7);

-- PLANIFICACIONES
INSERT INTO PLANIFICACION_SERVICIO (fecha_programada, hora_inicio, estado_plan) VALUES 
('2026-04-16', '08:00:00', 'EJECUTADO'),
('2026-05-11', '09:00:00', 'EJECUTADO'),
('2026-05-21', '10:00:00', 'EJECUTADO'),
('2026-06-06', '14:00:00', 'EJECUTADO'),
('2026-06-16', '08:00:00', 'PROGRAMADO');

-- EJECUCIONES
INSERT INTO EJECUCION_SERVICIO (fecha_ejecucion, resultado, observaciones_ej, id_planificacion_servicio) VALUES 
('2026-04-16 17:00:00', 'Satisfactorio', 'Todo el efluente fue procesado.', 1),
('2026-05-11 15:00:00', 'Satisfactorio con Observaciones', 'Residuos extra, se procedio.', 2),
('2026-05-21 16:00:00', 'No Satisfactorio', 'Fallo un sensor de medicion.', 3),
('2026-06-06 18:00:00', 'Satisfactorio', 'Proceso urgente terminado.', 4);

-- INCIDENTES
INSERT INTO INCIDENTE (tipo_incidente, descripcion_inc, gravedad, estado_inc, id_ejecucion_servicio) VALUES 
('Derrame', 'Pequeña fuga controlada.', 'MEDIA', 'CERRADO', 2),
('Fallo de Equipo', 'Sensor de aire se descalibro.', 'ALTA', 'EN_PROCESO', 3),
('Retraso', 'Personal llego 2h tarde.', 'BAJA', 'CERRADO', 4);

-- AUDITORIAS
INSERT INTO AUDITORIA (fecha_auditoria, calificacion, observaciones_aud, id_ejecucion_servicio, id_empleado) VALUES 
('2026-04-17 10:00:00', 5, 'Excelente trabajo de ingenieria.', 1, 1),
('2026-05-12 11:00:00', 4, 'Buen trabajo pero falto EPP.', 2, 2),
('2026-05-22 09:00:00', 2, 'No se cumplio el objetivo, revisar sensor.', 3, 2),
('2026-06-07 14:00:00', 5, 'Respuesta rapida.', 4, 3);
GO
