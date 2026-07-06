# Nexus Eco Soluciones

Plataforma integral para la gestión operativa y documental de servicios ambientales, saneamiento y control de plagas.

## 🏗 Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor dividida en dos repositorios principales:

- **Frontend (`nexus-eco-frontend`)**: Aplicación Single Page Application (SPA) desarrollada con React y Vite.
- **Backend (`nexus-eco-api`)**: API RESTful desarrollada con Spring Boot y Java 21.

## 🛠 Tecnologías Utilizadas

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Enrutamiento**: React Router DOM
- **Estilos**: Vanilla CSS Modules y CSS Global
- **Iconos**: React Icons (Material Design & FontAwesome)

### Backend
- **Framework**: Spring Boot 4.1.0
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
4. **MongoDB** y **MongoDB Compass**

---

## 🚀 Configuración e Inicialización

### 1. Configuración de Base de Datos (SQL Server)
1. Abre **SQL Server Configuration Manager**.
2. Ve a *Configuración de red de SQL Server* -> *Protocolos de MSSQLSERVER*.
3. Habilita **TCP/IP**. En la pestaña *Direcciones IP*, baja hasta **IPAll**, borra el valor de *Puertos dinámicos TCP* y establece el *Puerto TCP* en `1433`.
4. Reinicia el servicio de SQL Server.
5. En **SSMS**, haz clic derecho sobre el Servidor -> Propiedades -> Seguridad, y habilita el **Modo de autenticación de SQL Server y Windows**.
6. En Seguridad -> Inicios de Sesión, crea un usuario llamado `nexus_user` con contraseña `nexus123`, asígnale el rol `sysadmin`. (Reinicia el servidor SQL si es necesario).

### 2. Iniciar el Backend (API REST)
La base de datos se inicializará automáticamente (Code-First) gracias a Hibernate.
1. Abre una terminal.
2. Navega a la carpeta del backend:
   ```bash
   cd nexus-eco-api
   ```
3. Ejecuta el servidor usando Gradle:
   ```bash
   ./gradlew bootRun
   ```
El servidor backend estará disponible en `http://localhost:8080`.

### 3. Iniciar el Frontend (Interfaz de Usuario)
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
El frontend estará disponible en `http://localhost:5173`.

---

## 📁 Estructura del Proyecto

### Frontend
```text
nexus-eco-frontend/
├── src/
│   ├── api/             # Configuración de Axios
│   ├── components/      # Componentes reutilizables (Layout, Sidebar, Header)
│   ├── pages/           # Vistas principales (Dashboard, Clientes, Servicios, Auditoría, etc.)
│   ├── App.jsx          # Configuración de rutas
│   └── main.jsx         # Punto de entrada
```

### Backend
```text
nexus-eco-api/
├── src/main/java/com/nexus/eco/nexus_eco_api/
│   ├── controller/      # Controladores REST
│   ├── model/           # Entidades JPA y Modelos de Dominio
│   ├── repository/      # Interfaces Spring Data (JPA y Mongo)
│   └── service/         # Lógica de Negocio y GridFS
├── src/main/resources/
│   └── application.yml  # Credenciales y Configuración de BD
```
