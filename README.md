# Nexus Eco Soluciones 🌿

Plataforma integral y Full-Stack para la gestión operativa y documental de servicios ambientales, saneamiento y control de plagas.

## 🏗 Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor dividida en dos repositorios principales, apoyados por una persistencia políglota:

- **Frontend (`nexus-eco-frontend`)**: Interfaz de usuario Single Page Application (SPA) desarrollada con React y Vite.
- **Backend (`nexus-eco-api`)**: API RESTful desarrollada con Spring Boot y Java 21.

## 🛠 Tecnologías Utilizadas

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Enrutamiento**: React Router DOM
- **Estilos**: Vanilla CSS Modules y CSS Global
- **Iconos**: React Icons (Material Design & FontAwesome)

### Backend
- **Framework**: Spring Boot 3.x
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
Para probar el sistema sin tener que registrar clientes uno por uno, puedes inyectar datos de prueba ejecutando el script proporcionado:
1. Abre otra terminal.
2. Navega a la carpeta del backend: `cd nexus-eco-api`
3. Ejecuta el comando sqlcmd:
   ```bash
   sqlcmd -S tu_servidor -U nexus_user -P nexus123 -d NexusEcoDB -i seed.sql
   ```
*(Esto borrará los datos actuales, reseteará los IDs e insertará datos simulados completos).*

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

## 📁 Estructura del Proyecto

### Frontend (`nexus-eco-frontend/`)
- `src/api/` - Configuración de Axios para peticiones HTTP.
- `src/components/` - Componentes reutilizables (Layout, Sidebar, Header).
- `src/pages/` - Vistas principales (Dashboard, Clientes, Servicios, Auditoría, Ejecución, etc.).
- `src/App.jsx` - Enrutamiento del sistema.
- `public/` - Recursos estáticos (Logos, favicons).

### Backend (`nexus-eco-api/`)
- `src/main/java/.../controller/` - Endpoints REST (Controladores).
- `src/main/java/.../model/` - Entidades JPA y Modelos de Dominio (SQL y Mongo).
- `src/main/java/.../repository/` - Interfaces de Spring Data.
- `src/main/java/.../service/` - Lógica de Negocio y manejo de GridFS.
- `src/main/resources/application.yml` - Credenciales y Configuración (DBs, límites de subida, puerto).
- `seed.sql` - Script de base de datos para pruebas.
