# Guía de Exposición Académica: Proyecto Econexus 🌿
### Curso: Base de Datos 2

Esta guía contiene la estructura lógica, los argumentos clave de diseño y un **guión de demostración técnica (Demo Script)** diseñado para presentar el proyecto ante el docente evaluador de manera exitosa, resaltando los pilares arquitectónicos del curso.

---

## 🏛️ 1. Pilares de Diseño a Exponer (Lo que evaluará el Profesor)

Antes de mostrar el sistema corriendo, es fundamental explicar **por qué** se diseñó así. Estos son los tres argumentos de mayor peso académico:

### A. Persistencia Políglota (Híbrida)
* **SQL Server (Relacional):** Soporta el núcleo transaccional. La facturación, asignaciones de personal y contratos necesitan transacciones ACID robustas. No podemos permitirnos inconsistencias como perder una orden de pago.
* **MongoDB (No Relacional / Documental):**
  * **Evidencias (GridFS):** En lugar de guardar archivos binarios pesados (fotos de inspección, firmas de clientes) como campos `VARBINARY(MAX)` en SQL Server (lo que ralentizaría los índices y fragmentaría el disco), los guardamos de forma distribuida en fragmentos en GridFS de MongoDB, manteniendo en SQL Server solo el `mongo_doc_id`.
  * **Encuestas de Satisfacción:** Las encuestas provienen de Google Forms. La estructura de un formulario web cambia constantemente (se añaden o eliminan preguntas). Guardarlas en MongoDB nos da un **esquema flexible (schemaless)**, evitando tener que alterar la base de datos SQL ante cada cambio de la encuesta.

### B. Máquina de Estados Estricta (Triggers en Base de Datos)
* **El Problema en Sistemas Comunes:** En aplicaciones típicas, la lógica se valida solo en el Frontend o el Backend. Si alguien inserta un registro directamente en la base de datos o hay un fallo del backend, la consistencia lógica se rompe.
* **Nuestra Solución:** Implementamos **Triggers en SQL Server** que actúan como la última línea de defensa física. Aunque un hacker intente saltearse la web, el motor de SQL Server bloqueará cualquier estado inválido (ej. registrar un informe sin auditoría previa o programar dos visitas sobre la misma orden).

### C. Webhooks e Integración con Cloud (Google Workspace)
* Explicar cómo el sistema se conecta en tiempo real con Google Sheets mediante un trigger de Apps Script que dispara un webhook a nuestro backend REST local expuesto mediante un túnel de ngrok, aplicando un algoritmo de **Fuzzy Matching** para emparejar el texto escrito por el cliente con el ID del cliente registrado en SQL Server.

---

## 🎬 2. Guión de la Demostración en Vivo (Demo Script)

Sigue este flujo paso a paso durante la presentación ante el profesor:

### Paso 1: Gestión Transaccional (Módulo Solicitudes)
* **Qué hacer:** Ve al menú **Solicitudes** y muestra la tabla. Abre los **Detalles** de la Orden #1 y explica que el estado es `PENDIENTE`.
* **Qué decir al profesor:** *"Profesor, aquí registramos las solicitudes del cliente y calculamos el monto total de forma estructurada. Como la Orden de Servicio se encuentra en estado inicial PENDIENTE, los botones de Editar y Eliminar están activos."*

### Paso 2: Planificación y Reglas Operativas (Módulo Planificación)
* **Qué hacer:** Ve a **Planificación**. Simula crear una planificación nueva. Muestra que en el dropdown de Órdenes a elegir, **no aparecen las órdenes que ya fueron programadas**.
* **Qué decir al profesor:** *"Para evitar que un planificador programe por error dos visitas en la misma fecha para un cliente, la interfaz filtra las órdenes activas. Además, a nivel de base de datos, el trigger `TR_ValidarEstadoPlanificacion` rechaza cualquier inserción redundante."*

### Paso 3: Ejecución de Servicios y GridFS (Módulo Ejecución)
* **Qué hacer:** Muestra las órdenes ejecutadas (etapa 3). Resalta que los botones de modificar en planificación ahora están bloqueados. Haz clic en el botón **"Evidencias"** de alguna fila. Se descargará un archivo ZIP al instante.
* **Qué decir al profesor:** *"Una vez ejecutado el servicio, el estado cambia a EJECUTADO. Las fotos del técnico y firmas cargadas en campo se guardan en fragmentos en MongoDB Compass. Al pulsar 'Evidencias', nuestro backend Spring Boot empaqueta esos fragmentos binarios en un archivo ZIP al vuelo y lo descarga en el cliente."*

### Paso 4: Control de Calidad (Módulo Auditoría)
* **Qué hacer:** Entra al detalle de una auditoría calificada. Muestra que tiene calificación en estrellas y observaciones. Muestra el botón **"Generar Informe Final"** que aparece gracias a que cuenta con auditorías válidas.
* **Qué decir al profesor:** *"Cumpliendo con la regla de negocio, un informe de servicio no puede entregarse al cliente si no pasa primero por una auditoría aprobada del supervisor. Una vez realizada la auditoría, la orden pasa a estado AUDITADA, y el sistema nos habilita el botón para emitir el reporte final."*

### Paso 5: Cierre del Servicio y Generación de Reportes PDF (Módulo Informes)
* **Qué hacer:** Haz clic en el botón verde **"PDF"** de la tabla de informes. Se abrirá la ventana limpia de impresión del navegador.
* **Qué decir al profesor:** *"Finalmente, el sistema extrae en tiempo real la información consolidada: datos fiscales de SQL Server, servicios cobrados del catálogo, resultados del técnico en campo y la calificación en estrellas de la auditoría, estructurándola en un informe técnico formal listo para guardarse en PDF."*

### Paso 6: Encuesta e Integración (Módulo Satisfacción)
* **Qué hacer:** Entra a **Satisfacción (Mongo)**. Muestra los promedios del dashboard en base a la colección de encuestas.
* **Qué decir al profesor:** *"Para el cierre del ciclo, el cliente responde una encuesta en Google Forms. Apps Script envía un webhook que nuestro backend Spring Boot procesa, relacionándolo con el cliente de SQL Server y guardando el documento crudo en MongoDB, alimentando este panel interactivo."*

---

## 📈 3. Preguntas Frecuentes del Jurado (Cómo responder)

* **Pregunta: ¿Por qué no guardaron las encuestas en SQL Server?**
  * *Respuesta:* *"Porque las encuestas son dinámicas. Si el cliente decide agregar una pregunta de opción múltiple mañana en el Forms, en SQL Server tendríamos que hacer un `ALTER TABLE` y migrar la base de datos, lo cual detiene el sistema. MongoDB nos permite almacenar esquemas dinámicos sin modificar la infraestructura."*
* **Pregunta: ¿Cómo se relacionan SQL Server y MongoDB en el código?**
  * *Respuesta:* *"Se relacionan mediante una referencia débil de IDs. En la base de datos transaccional de SQL Server guardamos el ID del documento generado por MongoDB (`mongo_doc_id` o `mongo_doc_id_insp`) en un campo de tipo `VARCHAR(50)`. El backend hace la consulta a ambas fuentes de forma asíncrona cuando es necesario."*
* **Pregunta: ¿Los triggers no restan rendimiento a la base de datos?**
  * *Respuesta:* *"Nuestros triggers operan sobre la tabla virtual `inserted` y realizan uniones indexadas por claves primarias, lo que garantiza tiempos de ejecución de milisegundos. Es un costo mínimo comparado con la seguridad de la integridad de los datos que nos proporciona."*
