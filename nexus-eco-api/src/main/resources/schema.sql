-- Script DDL para Nexus Eco Soluciones (SQL Server)

CREATE TABLE CLIENTE (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    razon_social VARCHAR(200) NOT NULL,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    direccion VARCHAR(255),
    email_cliente VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'ACTIVO'
);

CREATE TABLE CONTACTO_CLIENTE (
    id_contacto_cliente INT IDENTITY(1,1) PRIMARY KEY,
    nombre_con VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    telefono_con VARCHAR(20),
    email_contacto VARCHAR(100),
    id_cliente INT,
    CONSTRAINT FK_CONTACTO_CLIENTE FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente)
);

CREATE TABLE EMPLEADO (
    id_empleado INT IDENTITY(1,1) PRIMARY KEY,
    nombre_emp VARCHAR(100) NOT NULL,
    apellido_emp VARCHAR(100) NOT NULL,
    cargo_emp VARCHAR(100),
    area VARCHAR(100)
);

CREATE TABLE SOLICITUD_SERVICIO (
    id_solicitud_servicio INT IDENTITY(1,1) PRIMARY KEY,
    fecha_solicitud DATETIME DEFAULT GETDATE(),
    descripcion_sol TEXT,
    estado_sol VARCHAR(50) DEFAULT 'PENDIENTE',
    id_cliente INT,
    id_empleado INT,
    CONSTRAINT FK_SOLICITUD_CLIENTE FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    CONSTRAINT FK_SOLICITUD_EMPLEADO FOREIGN KEY (id_empleado) REFERENCES EMPLEADO(id_empleado)
);

CREATE TABLE ORDEN_SERVICIO (
    id_orden_servicio INT IDENTITY(1,1) PRIMARY KEY,
    fecha_orden DATETIME DEFAULT GETDATE(),
    estado_orden VARCHAR(50) DEFAULT 'EN_PROCESO',
    monto_total DECIMAL(10,2),
    id_solicitud_servicio INT,
    CONSTRAINT FK_ORDEN_SOLICITUD FOREIGN KEY (id_solicitud_servicio) REFERENCES SOLICITUD_SERVICIO(id_solicitud_servicio)
);

CREATE TABLE TIPO_SERVICIO (
    id_tipo_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion_ts VARCHAR(255),
    precio_base DECIMAL(10,2)
);

CREATE TABLE DETALLE_ORDEN (
    id_detalle_orden INT IDENTITY(1,1) PRIMARY KEY,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    id_orden_servicio INT,
    id_tipo_servicio INT,
    CONSTRAINT FK_DETALLE_ORDEN_SERV FOREIGN KEY (id_orden_servicio) REFERENCES ORDEN_SERVICIO(id_orden_servicio),
    CONSTRAINT FK_DETALLE_TIPO_SERV FOREIGN KEY (id_tipo_servicio) REFERENCES TIPO_SERVICIO(id_tipo_servicio)
);

CREATE TABLE ORDEN_TRABAJO (
    id_orden_trabajo INT IDENTITY(1,1) PRIMARY KEY,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    descripcion_ot TEXT,
    estado_ot VARCHAR(50) DEFAULT 'PENDIENTE',
    prioridad VARCHAR(20),
    id_orden_servicio INT,
    CONSTRAINT FK_OT_ORDEN_SERV FOREIGN KEY (id_orden_servicio) REFERENCES ORDEN_SERVICIO(id_orden_servicio)
);

CREATE TABLE PLANIFICACION_SERVICIO (
    id_planificacion_servicio INT IDENTITY(1,1) PRIMARY KEY,
    fecha_programada DATETIME NOT NULL,
    hora_inicio TIME,
    estado_plan VARCHAR(50) DEFAULT 'PROGRAMADO',
    id_orden_trabajo INT,
    CONSTRAINT FK_PLANIFICACION_OT FOREIGN KEY (id_orden_trabajo) REFERENCES ORDEN_TRABAJO(id_orden_trabajo)
);

CREATE TABLE UBICACION (
    id_ubicacion INT IDENTITY(1,1) PRIMARY KEY,
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    calle VARCHAR(255),
    referencia VARCHAR(255),
    id_planificacion_servicio INT,
    CONSTRAINT FK_UBICACION_PLANIFICACION FOREIGN KEY (id_planificacion_servicio) REFERENCES PLANIFICACION_SERVICIO(id_planificacion_servicio)
);

CREATE TABLE ESPECIALIDAD (
    id_especialidad INT IDENTITY(1,1) PRIMARY KEY,
    nombre_espec VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE TECNICO (
    id_tecnico INT IDENTITY(1,1) PRIMARY KEY,
    nombre_tec VARCHAR(100) NOT NULL,
    apellido_tec VARCHAR(100) NOT NULL,
    estado_tec VARCHAR(20) DEFAULT 'ACTIVO',
    id_especialidad INT,
    CONSTRAINT FK_TECNICO_ESPECIALIDAD FOREIGN KEY (id_especialidad) REFERENCES ESPECIALIDAD(id_especialidad)
);

CREATE TABLE TECNICO_PLANIFICACION (
    id_tecnico_planificacion INT IDENTITY(1,1) PRIMARY KEY,
    rol VARCHAR(50),
    fecha_asignacion DATETIME DEFAULT GETDATE(),
    id_planificacion_servicio INT,
    id_tecnico INT,
    CONSTRAINT FK_TP_PLANIFICACION FOREIGN KEY (id_planificacion_servicio) REFERENCES PLANIFICACION_SERVICIO(id_planificacion_servicio),
    CONSTRAINT FK_TP_TECNICO FOREIGN KEY (id_tecnico) REFERENCES TECNICO(id_tecnico)
);

CREATE TABLE EJECUCION_SERVICIO (
    id_ejecucion_servicio INT IDENTITY(1,1) PRIMARY KEY,
    fecha_ejecucion DATETIME NOT NULL,
    resultado VARCHAR(100),
    observaciones_ej TEXT,
    mongo_doc_id VARCHAR(50),  -- Referencia a las evidencias (archivos/fotos) en MongoDB
    id_planificacion INT,
    CONSTRAINT FK_EJECUCION_PLANIFICACION FOREIGN KEY (id_planificacion) REFERENCES PLANIFICACION_SERVICIO(id_planificacion_servicio)
);

CREATE TABLE INCIDENTE (
    id_incidente INT IDENTITY(1,1) PRIMARY KEY,
    tipo_incidente VARCHAR(50),
    descripcion_inc TEXT,
    gravedad VARCHAR(20),
    estado_inc VARCHAR(50) DEFAULT 'REPORTADO',
    id_ejecucion_servicio INT,
    CONSTRAINT FK_INCIDENTE_EJECUCION FOREIGN KEY (id_ejecucion_servicio) REFERENCES EJECUCION_SERVICIO(id_ejecucion_servicio)
);

CREATE TABLE SEGUIMIENTO_INCIDENTE (
    id_seguimiento_incidente INT IDENTITY(1,1) PRIMARY KEY,
    fecha_seguimiento DATETIME DEFAULT GETDATE(),
    accion_tomada TEXT,
    estado_seg VARCHAR(50),
    id_incidente INT,
    CONSTRAINT FK_SEGUIMIENTO_INCIDENTE FOREIGN KEY (id_incidente) REFERENCES INCIDENTE(id_incidente)
);

CREATE TABLE AUDITORIA (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    fecha_auditoria DATETIME NOT NULL,
    calificacion INT,
    observaciones_aud TEXT,
    id_ejecucion_servicio INT,
    id_empleado INT,
    CONSTRAINT FK_AUDITORIA_EJECUCION FOREIGN KEY (id_ejecucion_servicio) REFERENCES EJECUCION_SERVICIO(id_ejecucion_servicio),
    CONSTRAINT FK_AUDITORIA_EMPLEADO FOREIGN KEY (id_empleado) REFERENCES EMPLEADO(id_empleado)
);

CREATE TABLE INSPECCION (
    id_inspeccion INT IDENTITY(1,1) PRIMARY KEY,
    area_inspeccionada VARCHAR(100),
    resultado_insp VARCHAR(100),
    mongo_doc_id_insp VARCHAR(50), -- Referencia a evidencias en MongoDB
    id_auditoria INT,
    CONSTRAINT FK_INSPECCION_AUDITORIA FOREIGN KEY (id_auditoria) REFERENCES AUDITORIA(id_auditoria)
);

CREATE TABLE INFORME_SERVICIO (
    id_informe_servicio INT IDENTITY(1,1) PRIMARY KEY,
    fecha_generacion DATETIME DEFAULT GETDATE(),
    tipo_informe VARCHAR(50),
    estado_envio VARCHAR(50),
    id_ejecucion_servicio INT,
    CONSTRAINT FK_INFORME_EJECUCION FOREIGN KEY (id_ejecucion_servicio) REFERENCES EJECUCION_SERVICIO(id_ejecucion_servicio)
);
