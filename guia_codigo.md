# Guía de Estructura y Código Fuente - Econexus

Este documento describe la organización del código fuente, el propósito de cada archivo y la distribución arquitectónica del prototipo **Econexus** (Backend Spring Boot + Frontend React).

---

## 1. Servidor Backend (Spring Boot / Java)

El backend sigue un diseño de arquitectura limpia en capas: **Controlador (REST API) $\rightarrow$ Servicio (Lógica de Negocio) $\rightarrow$ Repositorio (Acceso a Datos) $\rightarrow$ Modelo/Entidad**.

### A. Capa de Modelos (Base de Datos)
Ubicada en `com.nexus.eco.nexus_eco_api.model`:
* **`entity/` (SQL Server):** Clases JPA anotadas con `@Entity` que se mapean a las tablas relacionales.
  * `Cliente.java`, `Empleado.java`, `TipoServicio.java`, `SolicitudServicio.java`, `OrdenServicio.java`, `DetalleOrden.java`, `PlanificacionServicio.java`, `EjecucionServicio.java`, `AuditoriaCalidad.java`.
  * *Validaciones:* Se utilizan anotaciones `@Pattern` (ej. RUC de 11 dígitos), `@NotBlank`, `@Size` y `@Min` para asegurar la calidad de datos antes de ir a SQL Server.
* **`document/` (MongoDB):** Clases que representan documentos NoSQL.
  * `EncuestaSatisfaccion.java`: Mapea las respuestas de la colección MongoDB recolectadas vía Google Forms.

### B. Capa de Repositorios (Acceso a Datos)
Ubicada en `com.nexus.eco.nexus_eco_api.repository`:
* **SQL Server (JPA):** Interfaces que extienden `JpaRepository` para generar consultas automáticas.
  * `ClienteRepository.java`, `OrdenServicioRepository.java`, etc.
* **MongoDB (Spring Data Mongo):**
  * `EncuestaSatisfaccionRepository.java`: Para buscar y eliminar encuestas en MongoDB.

### C. Capa de Servicios (Lógica y Transaccionalidad)
Ubicada en `com.nexus.eco.nexus_eco_api.service`:
* Contienen las reglas de negocio y actualizan estados en cascada usando la anotación `@Transactional`.
  * `EjecucionServicioService.java`: Al registrar la ejecución, actualiza en cascada el estado de la planificación a `EJECUTADO` y la orden a `COMPLETADO`.
  * `OrdenServicioService.java`: Al generar la orden, actualiza la solicitud asociada a `APROBADA`.

### D. Capa de Controladores (Controladores API REST)
Ubicada en `com.nexus.eco.nexus_eco_api.controller`:
* Exponen los endpoints HTTP consumidos por el Frontend React o por los Webhooks externos.
  * `EjecucionServicioController.java`: Maneja la subida de evidencias en GridFS y descargas.
  * `EncuestaSatisfaccionController.java`: Contiene el endpoint del **Webhook** (`/webhook`) que recibe las respuestas de Google Forms.

---

## 2. Aplicación Frontend (React + Vite + CSS)

El frontend está estructurado en componentes reutilizables y páginas de control conectadas al API backend.

### A. Conexión de API (`src/api/api.js`)
* Configura la instancia de **Axios** apuntando a `http://localhost:8080/api`.
* Exporta funciones HTTP limpias (`getClientes()`, `getOrdenes()`, `createOrdenServicio()`) para comunicar los componentes visuales con los endpoints de Spring Boot.

### B. Módulos y Páginas (`src/pages/`)
Cada archivo `.jsx` representa una vista del menú lateral del Dashboard:

1. **`Dashboard.jsx` (Métricas):** Muestra el resumen estadístico superior, tarjetas informativas de rendimiento y gráficos de control general.
2. **`Clientes.jsx` (Gestión Comercial):** Formulario e historial de clientes y sus contactos principales. Enforce de validaciones visuales en rojo.
3. **`Servicios.jsx` (Cotizaciones y Órdenes):**
   * Creación de propuestas comerciales/Órdenes de Servicio.
   * Cuenta con buscadores predictivos integrados y un panel lateral de estadísticas dinámicas del cliente.
   * **Generación de Contratos PDF:** Permite compilar y descargar en un clic el contrato comercial descriptivo usando la librería `html2pdf.js` en formato A4 (solo visible cuando la OS está `PENDIENTE`).
4. **`Planificacion.jsx` (Cronograma y Asignaciones):** 
   * Asignación de cuadrillas técnicas a órdenes de servicio aprobadas.
   * Valida restricciones operativas (ej. que la cuadrilla tenga al menos un líder técnico asignado y que no se repitan trabajadores).
5. **`Ejecucion.jsx` (Trabajo de Campo):**
   * Registro de datos tras finalizar el servicio.
   * Permite subir las fotos o actas firmadas directamente a MongoDB GridFS.
6. **`Auditoria.jsx` (Control de Calidad):** 
   * Calificación por estrellas de los servicios ejecutados.
   * Formatea los resultados en badges (Exitoso, Con Observaciones, No Exitoso) de forma case-insensitive, previniendo incoherencias con registros antiguos de la base de datos.
7. **`Informes.jsx` (Certificaciones Sanitarias):**
   * Listado e historial de certificados de saneamiento.
   * **Generación de Reportes PDF:** Compila digitalmente los hallazgos y firmas del supervisor y el cliente, auto-descargando el documento directamente sin abrir popups que puedan bloquearse.
8. **`Satisfaccion.jsx` (Google Forms / MongoDB):**
   * Tabla que visualiza en tiempo real las opiniones e índices de estrellas recolectados por Google Forms desde la base de datos MongoDB.
9. **`TiposServicio.jsx` & `Tecnicos.jsx` & `Empleados.jsx`:** CRUDs auxiliares de parámetros.
