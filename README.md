# Nexus Eco Soluciones 🌿

Plataforma integral y Full-Stack para la gestión operativa y documental de servicios ambientales, saneamiento y control de plagas.

---

## 🏗 Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor dividida en dos repositorios principales, apoyados por una persistencia políglota:

- **Frontend (`nexus-eco-frontend`)**: Interfaz de usuario Single Page Application (SPA) desarrollada con React y Vite.
- **Backend (`nexus-eco-api`)**: API RESTful desarrollada con Spring Boot y Java 21.

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Enrutamiento**: React Router DOM
- **Estilos**: Vanilla CSS Modules y CSS Global
- **Iconos**: React Icons (Material Design)

### Backend
- **Framework**: Spring Boot 4.x
- **Lenguaje**: Java 21
- **Persistencia**: Spring Data JPA & Hibernate
- **Almacenamiento NoSQL**: Spring Data MongoDB (GridFS para archivos binarios)
- **Base de Datos Relacional**: Microsoft SQL Server 2022
- **Base de Datos Documental**: MongoDB (Local/Compass)

---

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar el proyecto:
1. **Node.js** (v18 o superior)
2. **Java JDK 21**
3. **Microsoft SQL Server 2022** y **SQL Server Management Studio (SSMS)**
4. **MongoDB** (Server) y **MongoDB Compass**
5. **ngrok** (para la exposición del webhook externo local)

---

## 🚀 Configuración e Inicialización

### 1. Configuración de Base de Datos (SQL Server)
El sistema utiliza SQL Server para las transacciones estructuradas (Clientes, Órdenes, Empleados, etc.).

1. Abre **SQL Server Configuration Manager**.
2. Ve a *Configuración de red de SQL Server* -> *Protocolos de MSSQLSERVER*.
3. Habilita **TCP/IP**. En la pestaña *Direcciones IP*, baja hasta **IPAll**, borra el valor de *Puertos dinámicos TCP* y establece el *Puerto TCP* en `1433`.
4. Reinicia el servicio de SQL Server.
5. En **SSMS**, haz clic derecho sobre el Servidor -> Propiedades -> Seguridad, y habilita el **Modo de autenticación de SQL Server y Windows**.
6. En Seguridad -> Inicios de Sesión, crea un usuario llamado `nexus_user` con contraseña `nexus123`, asígnale el rol `sysadmin` o asegúrate de que tenga permisos para crear bases de datos. (Reinicia el servidor SQL si es necesario).
7. Crea una base de datos vacía llamada `NexusEcoDB`.

### 2. Configuración de Base de Datos Documental (MongoDB)
El sistema utiliza MongoDB con GridFS para guardar los archivos PDF y evidencias de manera distribuida.

1. Abre **MongoDB Compass**.
2. Conéctate a tu servidor local en el puerto por defecto: `mongodb://localhost:27017`
3. No es necesario crear la base de datos manualmente; Spring Boot creará automáticamente la base de datos `nexus_eco_surveys` al subir la primera evidencia.

### 3. Iniciar el Backend (API REST)
La base de datos relacional creará sus tablas automáticamente (Code-First) gracias a la propiedad `ddl-auto: update` de Hibernate.

1. Abre una terminal.
2. Navega a la carpeta del backend:
   ```bash
   cd nexus-eco-api
   ```
3. Ejecuta el servidor usando Gradle (el backend por defecto permite subidas de archivos hasta de 15MB):
   ```bash
   ./gradlew bootRun
   ```
*(Nota: El servidor estará disponible en `http://localhost:8080`)*

### 4. Sembrar Datos de Prueba (Opcional)
Para probar el sistema sin tener que registrar clientes uno por uno, puedes inyectar datos de prueba ejecutando el script de carga masiva en estados lógicos correctos:
1. Abre otra terminal.
2. Ejecuta el comando sqlcmd:
   ```bash
   sqlcmd -S localhost -U nexus_user -P nexus123 -d NexusEcoDB -C -i scratch/clear_and_seed.sql
   ```
*(Esto borrará los datos actuales, reseteará los IDs e insertará 20 registros por tabla en diferentes estados lógicos).*

### 5. Iniciar el Frontend (Interfaz de Usuario)
1. Abre una nueva terminal.
2. Navega a la carpeta del frontend:
   ```bash
   cd nexus-eco-frontend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
*(El frontend estará disponible en `http://localhost:5173`)*

---

## 🔒 Máquina de Estados y Reglas Operativas

El sistema implementa una máquina de estados estricta a nivel de Base de Datos y Backend para asegurar la calidad y evitar redundancias operativas:

### Ciclo de Vida del Servicio:
`PENDIENTE ➔ PLANIFICADA ➔ EJECUTADA ➔ AUDITADA ➔ CERRADA`

### Validaciones e Integridades Implementadas:
* **Restricción de Edición en Solicitudes:** Una vez que una orden de servicio ha sido planificada (estado `PLANIFICADA` o posterior), los botones **Editar** y **Eliminar** se ocultan automáticamente en la pantalla de Solicitudes, permitiendo únicamente ver la ficha de detalles en modal.
* **Control de Redundancia en Planificación:** El selector de la pantalla de planificación excluye las órdenes que ya tengan un agendamiento activo. Las planificaciones ya ejecutadas se bloquean de edición/eliminación.
* **Descarga de Evidencias en Ejecución (ZIP):** El módulo de Ejecución genera un archivo ZIP dinámico extrayendo los archivos binarios guardados en MongoDB y descargándolos directo al navegador con un clic.
* **Bloqueos Físicos de Base de Datos (Triggers):** 
  * `TR_ValidarEstadoPlanificacion` (impide duplicidad de planificación para una misma orden).
  * `TR_ValidarEstadoEjecucion` (impide ejecutar servicios no planificados).
  * `TR_ValidarEstadoAuditoria` (impide calificar servicios no ejecutados).
  * `TR_ValidarEstadoInforme` (impide emitir reportes finales si no cuenta con auditoría del supervisor).
* **Generación de Reportes PDF:** El módulo de Informes incluye un botón **"PDF"** que abre una ventana de impresión limpia y profesional, cargando el logotipo de Econexus, datos del cliente, la lista detallada de servicios cobrados con precios, las observaciones de campo del técnico y la calificación de calidad en estrellas junto al dictamen de auditoría del supervisor.

---

## 🗳️ Integración de Google Forms con Spring Boot y MongoDB

### Objetivo
Automatizar el almacenamiento de las respuestas de la encuesta de satisfacción realizada en Google Forms, enviándolas mediante un Webhook hacia una API desarrollada en Spring Boot para su almacenamiento en MongoDB.

### Arquitectura de Integración
```
Cliente ➔ Google Forms ➔ Google Sheets ➔ Google Apps Script ➔ HTTP POST (JSON) ➔ Spring Boot API ➔ MongoDB (➔ React / Power BI)
```

### Paso a Paso para la Integración

#### Paso 1. Crear la encuesta en Google Forms
* Ingresar a Google Forms.
* Crear la encuesta de satisfacción.
* Agregar todas las preguntas necesarias.
* Publicar el formulario.

#### Paso 2. Vincular Google Forms con Google Sheets
* Abrir la pestaña **Respuestas** en el formulario de Google.
* Seleccionar el icono de **Google Sheets**.
* Crear una nueva hoja de cálculo.
* A partir de este momento todas las respuestas quedarán almacenadas automáticamente en Google Sheets.

#### Paso 3. Abrir Google Apps Script
* Desde Google Sheets, navegar a: **Extensiones** ➔ **Apps Script**.
* Eliminar el código generado por defecto.

#### Paso 4. Implementar el Webhook
Crear la función `onFormSubmit(e)` que:
* Obtiene los datos de la fila recién enviada.
* Construye un objeto JSON mapeado a las propiedades de la API.
* Envía el JSON mediante una petición HTTP POST hacia la API de Spring Boot utilizando `UrlFetchApp.fetch()`.

La URL del webhook utilizada es:
```
https://<URL_PUBLICA>/api/encuesta-satisfaccions/webhook
```
*(Durante el desarrollo se utilizó ngrok para exponer el backend local).*

#### Paso 5. Crear el activador en Google Apps Script
* Ir a la sección **Activadores** (icono de reloj) -> **Agregar activador**.
* Configurar:
  * **Función a ejecutar:** `onFormSubmit`
  * **Origen del evento:** `De la hoja de cálculo`
  * **Tipo de evento:** `Al enviar el formulario`
* Autorizar los permisos de red solicitados por Google.

#### Paso 6. Configurar MongoDB en Backend
Agregar la configuración de la base de datos documental en `application.yml` de Spring Boot:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/nexus_eco_surveys
```

#### Paso 7. Crear la entidad MongoDB
Crear la clase `EncuestaSatisfaccion.java` anotada con:
```java
@Document(collection = "encuestas_satisfaccion")
```

#### Paso 8. Crear el repositorio
Crear la interfaz `EncuestaSatisfaccionRepository.java` que extienda de:
```java
MongoRepository<EncuestaSatisfaccion, String>
```

#### Paso 9. Implementar el servicio
Crear el servicio encargado de:
* Guardar encuestas entrantes.
* Consultar encuestas para estadísticas del Dashboard.
* Modificar/Eliminar encuestas si fuera necesario.

#### Paso 10. Implementar el controlador
Crear el endpoint de webhook:
```
POST /api/encuesta-satisfaccions/webhook
```
Este recibe el JSON enviado por Apps Script, realiza un fuzzy matching para vincular el cliente con SQL Server, calcula la puntuación promedio general e inserta el registro final en MongoDB.

#### Paso 11. Publicar el backend local
Como Google Apps Script se ejecuta en los servidores de la nube de Google y no puede acceder a `localhost`, se utiliza **ngrok**:
* Instalar ngrok en tu equipo local.
* Ejecutar en terminal: `ngrok http 8080`
* Obtener la URL pública segura provista por ngrok (ej: `https://xxxxxx.ngrok-free.app`)
* Actualizar dicha URL en tu script de Google Apps Script.

#### Paso 12. Validación
* Enviar una respuesta de prueba desde Google Forms.
* Verificar la ejecución correcta del trigger en Google Apps Script.
* Confirmar el código HTTP 200 retornado por la API de Spring Boot.
* Validar que el registro se guardó en MongoDB Compass y que alimenta de forma interactiva el Dashboard de la aplicación React.

---

## 📁 Estructura del Proyecto

### Frontend (`nexus-eco-frontend/`)
- `src/api/` - Configuración de Axios para peticiones HTTP hacia el backend.
- `src/components/` - Componentes reutilizables (Layout, Sidebar, Header).
- `src/pages/` - Vistas principales (Dashboard, Clientes, Servicios, Planificación, Ejecución, Auditoría, Informes, Satisfacción).
- `src/App.jsx` - Enrutamiento del sistema (React Router).

### Backend (`nexus-eco-api/`)
- `src/main/java/.../controller/` - Endpoints REST de la API.
- `src/main/java/.../model/` - Entidades JPA (SQL Server) y documentos MongoDB (Encuestas y Evidencias).
- `src/main/java/.../repository/` - Repositorios JPA y Mongo.
- `src/main/java/.../service/` - Lógica de negocio (Estados, propagaciones y ZIP GridFS).
- `src/main/resources/application.yml` - Credenciales y configuraciones del servidor.
- `scratch/` - Scripts auxiliares de base de datos (`create_triggers.sql`, `clear_and_seed.sql`).
