# Guía de Flujo Paso a Paso: Manual de Uso del Sistema Econexus 🌿

Esta guía es un manual rápido para que cualquier persona o tu profesor entienda **cómo usar el sistema desde cero**, siguiendo el camino lógico que recorre un servicio en la vida real.

---

## 🧭 Introducción al Recorrido
En este manual crearemos un servicio completo: desde que un cliente nos contacta, programamos a los técnicos, reportamos la ejecución, auditamos la calidad, y finalmente descargamos el reporte final en PDF.

---

## 🖥️ PASO 0: Pantalla de Inicio (Inicio)
Cuando entras a la aplicación, lo primero que verás es el **Dashboard o Panel de Inicio**.
* **¿Qué hay aquí?** Indicadores numéricos rápidos: cuántos clientes activos hay, cuántas planificaciones pendientes de visita se tienen, el total facturado y el KPI promedio de satisfacción de los clientes.
* **¿Qué hacer?** Familiarizarte con el menú lateral izquierdo (Operativo y Configuración).

---

## 👥 PASO 1: Registrar un Cliente (Clientes)
Todo servicio inicia con una empresa que necesita ayuda.
1. Haz clic en **Clientes** en el menú izquierdo.
2. Presiona el botón **"+ Nuevo Cliente"**.
3. Rellena el formulario:
   * *Razón Social:* "Laboratorios Fármacos S.A."
   * *RUC:* "20876543210"
   * *Dirección:* "Av. Los Tulipanes 456, San Borja"
   * *Email:* "contacto@farmacos.pe"
4. Registra los datos del contacto de la empresa (Nombre, Cargo y Teléfono).
5. Haz clic en **"Guardar Cliente"**.
* **Resultado:** El cliente ahora está en el sistema y listo para pedir servicios.

---

## 📝 PASO 2: Crear una Solicitud de Servicio (Solicitudes)
El cliente nos pide una cotización para desinfectar sus oficinas.
1. Haz clic en **Solicitudes** en el menú izquierdo.
2. Presiona el botón **"+ Nueva Solicitud"**.
3. En el formulario que aparece:
   * Selecciona el Cliente que creaste (*Laboratorios Fármacos S.A.*).
   * Selecciona el Empleado a cargo de la cuenta.
   * Escribe una descripción: *"Servicio urgente de desinfección preventiva por gripe."*
4. **Agregar Servicios:**
   * En el selector de servicios, elige **"Desinfección Ambiental"**.
   * Define la cantidad: `1`
   * Haz clic en **"Agregar"**. (Verás que calcula el total con el 18% de IVA automáticamente).
5. Haz clic en **"Guardar Solicitud"** en la parte superior.
* **Resultado:** Se ha creado la **Orden de Servicio (OS-2026-0021)** en estado `PENDIENTE`.
* **¡Observa esto!** Como la orden está nueva, los botones **Editar** y **Eliminar** están visibles en la tabla.

---

## 📅 PASO 3: Programar la Visita (Planificación)
Ahora debemos agendar qué día irá el personal técnico al local del cliente.
1. Haz clic en **Planificación** en el menú izquierdo.
2. Presiona el botón **"+ Nueva Planificación"**.
3. En el formulario:
   * **Seleccionar Orden:** Elige la orden de *Laboratorios Fármacos S.A.* que acabas de crear.
   * **Fecha Programada:** Elige una fecha (ej. mañana).
   * **Hora de Inicio:** Escribe una hora (ej. `09:00`).
   * **Ubicación:** Escribe la dirección del local (distrito, provincia, calle y alguna referencia).
   * **Asignación de Técnicos:** Selecciona al menos dos técnicos. Al primero asígnale el rol de **Líder Técnico** y al segundo el rol de **Asistente**.
4. Haz clic en **"Guardar Planificación"**.
* **Resultado:** La visita ha quedado registrada en el calendario en estado `PROGRAMADO`.
* **¡Observa el Cambio de Estado!** 
  * Si vuelves al módulo de **Solicitudes**, verás que la Orden ahora figura como **`PLANIFICADA`** y los botones "Editar" y "Borrar" se han bloqueado por seguridad.
  * Solo podrás ver sus datos haciendo clic en el icono del **ojo (👁️) o "Detalles"**.

---

## 🚚 PASO 4: Registrar lo que se hizo en campo (Ejecución)
Los técnicos han ido al local y realizado el trabajo. Ahora reportamos el resultado.
1. Haz clic en **Ejecución** en el menú izquierdo.
2. Busca la planificación de *Laboratorios Fármacos S.A.* en la lista.
3. Como aún no tiene reporte, verás el botón azul **"Registrar Ejecución"**. Haz clic en él.
4. Rellena los datos de campo:
   * *Fecha de Ejecución:* Elige el día de hoy.
   * *Resultado:* Selecciona **"EXITOSO"**.
   * *Observaciones del Técnico:* *"Se aplicó nebulización en frío en oficinas del primer y segundo piso. Sin contratiempos."*
   * *Cargar Evidencias:* Sube una foto o un PDF simulado con la firma de conformidad del cliente.
5. Haz clic en **"Guardar"**.
* **Resultado:** La orden ha pasado a estado **`EJECUTADA`**.
* **¡Observa esto en la UI!** El botón anterior cambió a **"Editar Registro"** y se activó un botón verde llamado **"Evidencias"**. Si haces clic en él, se descargará un archivo ZIP que contiene la firma y fotos subidas a MongoDB.

---

## 🔍 PASO 5: Evaluar la Calidad (Auditoría)
Un supervisor inspecciona el trabajo para dar la conformidad final.
1. Haz clic en **Auditoría** en el menú izquierdo.
2. Busca el servicio de *Laboratorios Fármacos S.A.* en el listado y haz clic en la fila para abrir el panel de detalle.
3. Presiona el botón **"Registrar auditoría"**:
   * Asigna una calificación de **5 estrellas**.
   * Escribe observaciones: *"Personal técnico contó con todo su EPP completo y dejó las oficinas limpias e impecables."*
   * Haz clic en **"Guardar"**.
4. **Registrar Inspección (Pestaña Inspecciones):** Registra el área revisada (ej. "Oficinas Administrativas") indicando que está "CONFORME".
5. **Generar Informe:** En el encabezado verás que ahora se ha activado el botón verde **"Generar Informe Final"** porque la auditoría ya fue registrada. Haz clic en él.
* **Resultado:** La orden pasa a estado **`AUDITADA`** y el sistema te redirigirá automáticamente a la pantalla de informes.

---

## 📄 PASO 6: Generar y Descargar el Reporte (Informes)
Es momento de entregarle el certificado e informe oficial al cliente.
1. Al ser redirigido a **Informes**, verás el nuevo informe creado en estado `PENDIENTE`.
2. Busca la fila correspondiente a *Laboratorios Fármacos S.A.* y haz clic en el botón verde **"PDF"**.
3. Se abrirá una nueva ventana del navegador formateada con el diseño corporativo de **Econex**:
   * Logo y membrete del sistema.
   * Datos fiscales del cliente traídos de SQL Server.
   * Tabla con el desglose de los servicios aplicados y montos de dinero.
   * Observaciones y fecha reportada por el técnico en campo.
   * **El dictamen de calidad:** Las 5 estrellas doradas (★★★★★) obtenidas en la auditoría.
4. Presiona guardar como PDF en tu navegador y ¡listo! Tienes el reporte oficial en tus archivos.

---

## 🗳️ PASO 7: Encuesta de Satisfacción del Cliente (Satisfacción)
Para finalizar, el cliente responde la encuesta que le enviamos a su correo.
1. El cliente llena el **Google Forms** desde su celular.
2. En segundo plano, **Google Apps Script** procesa las respuestas y las envía por internet a nuestra API.
3. La API hace un match inteligente, calcula el promedio y guarda las respuestas en **MongoDB**.
4. Si entras a la pantalla **Satisfacción (Mongo)** del sistema, verás la opinión registrada en tiempo real en la tabla de opiniones de clientes, actualizando de forma automática los gráficos del Dashboard de inicio.
