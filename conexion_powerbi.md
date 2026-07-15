# Guía de Conexión y Creación del Dashboard en Power BI Desktop

Dado que los archivos `.pbix` de Power BI son binarios propietarios y cerrados de Microsoft, no es posible generarlos o repararlos directamente desde código de programación. 

Sin embargo, **la forma correcta y más sencilla de recrear el Dashboard de tu sistema en Power BI** es conectar Power BI Desktop directamente a tu base de datos SQL Server (`NexusEcoDB`) y utilizar **Vistas SQL** precalculadas.

Esta guía te enseña paso a paso cómo crear un nuevo dashboard idéntico en 5 minutos.

---

## 1. PASO 1: Crear las Vistas de Power BI en SQL Server

Ejecuta el siguiente script en SQL Server Management Studio (SSMS) en la base de datos `NexusEcoDB`. Esto creará las tablas virtuales (Vistas) que Power BI consumirá directamente:

```sql
USE NexusEcoDB;
GO

-- 1. Vista para KPI de Facturación y Ventas en el tiempo
CREATE OR REPLACE VIEW vw_PBI_Facturacion AS
SELECT 
    o.id_orden_servicio AS ID_Orden,
    o.fecha_orden AS Fecha,
    YEAR(o.fecha_orden) AS Anio,
    MONTH(o.fecha_orden) AS Mes,
    DATENAME(month, o.fecha_orden) AS Nombre_Mes,
    c.razon_social AS Cliente,
    o.monto_total AS Monto_Total,
    o.estado_orden AS Estado_Orden
FROM ORDEN_SERVICIO o
INNER JOIN SOLICITUD_SERVICIO s ON o.id_solicitud_servicio = s.id_solicitud_servicio
INNER JOIN CLIENTE c ON s.id_cliente = c.id_cliente;
GO

-- 2. Vista para Calificación de Calidad por Cliente
CREATE OR REPLACE VIEW vw_PBI_Calidad AS
SELECT 
    a.id_auditoria AS ID_Auditoria,
    a.fecha_auditoria AS Fecha_Auditoria,
    a.calificacion AS Calificacion_Estrellas,
    c.razon_social AS Cliente,
    ts.nombre_servicio AS Servicio
FROM AUDITORIA_CALIDAD a
INNER JOIN EJECUCION_SERVICIO e ON a.id_ejecucion_servicio = e.id_ejecucion_servicio
INNER JOIN PLANIFICACION_SERVICIO p ON e.id_planificacion_servicio = p.id_planificacion_servicio
INNER JOIN ORDEN_SERVICIO o ON p.id_orden_servicio = o.id_orden_servicio
INNER JOIN DETALLE_ORDEN d ON o.id_orden_servicio = d.id_orden_servicio
INNER JOIN TIPO_SERVICIO ts ON d.id_tipo_servicio = ts.id_tipo_servicio
INNER JOIN SOLICITUD_SERVICIO s ON o.id_solicitud_servicio = s.id_solicitud_servicio
INNER JOIN CLIENTE c ON s.id_cliente = c.id_cliente;
GO

-- 3. Vista para Incidentes Reportados
CREATE OR REPLACE VIEW vw_PBI_Incidentes AS
SELECT 
    i.id_incidente AS ID_Incidente,
    i.fecha_incidente AS Fecha,
    i.gravedad AS Gravedad,
    i.estado_inc AS Estado_Incidente,
    c.razon_social AS Cliente
FROM INCIDENTE i
INNER JOIN CLIENTE c ON i.id_cliente = c.id_cliente;
GO
```

---

## 2. PASO 2: Conectar Power BI Desktop a SQL Server

1. Abre **Power BI Desktop** en tu computadora.
2. En la pestaña de inicio, haz clic en **Obtener datos (Get Data)** y selecciona **SQL Server**.
3. En la ventana de conexión:
   * **Servidor (Server):** Escribe `localhost` (o `127.0.0.1,1433` si usas puerto específico).
   * **Base de datos (Database):** Escribe `NexusEcoDB`.
   * **Modo de conectividad:** Selecciona **Importar (Import)**.
   * Haz clic en **Aceptar**.
4. Si te pide credenciales de acceso:
   * Selecciona la pestaña **Base de datos (Database)** en el menú izquierdo de credenciales.
   * **Usuario:** `nexus_user`
   * **Contraseña:** `nexus123`
   * Haz clic en **Conectar**.

---

## 3. PASO 3: Seleccionar las Vistas y Crear los Gráficos

En la ventana de navegación que se abrirá, verás todas las tablas. Selecciona únicamente las vistas creadas para Power BI:
* `vw_PBI_Facturacion`
* `vw_PBI_Calidad`
* `vw_PBI_Incidentes`

Haz clic en **Cargar (Load)**.

### Diseñando los Gráficos del Dashboard:

#### A. Tarjetas de KPIs (Fila Superior)
* **Ingresos Totales:** Inserta una visualización de tipo **Tarjeta (Card)** y arrastra la columna `Monto_Total` de `vw_PBI_Facturacion` (asegúrate de que esté configurado como "Suma").
* **Servicios Totales:** Inserta otra Tarjeta y arrastra `ID_Orden` (configurado como "Recuento").
* **Satisfacción Promedio:** Inserta otra Tarjeta y arrastra `Calificacion_Estrellas` de `vw_PBI_Calidad` (configurado como "Promedio").

#### B. Gráfico de Barras: Ventas por Cliente
* Inserta un **Gráfico de barras agrupadas**.
* **Eje Y:** Arrastra `Cliente` de `vw_PBI_Facturacion`.
* **Eje X:** Arrastra `Monto_Total`.

#### C. Gráfico de Líneas: Evolución de Facturación (Tiempo)
* Inserta un **Gráfico de líneas**.
* **Eje X:** Arrastra `Fecha` (puedes desglosarlo por Mes/Año).
* **Eje Y:** Arrastra `Monto_Total`.

#### D. Gráfico de Anillo: Estado de las Órdenes de Servicio
* Inserta un **Gráfico de anillos (Donut Chart)**.
* **Leyenda (Legend):** Arrastra `Estado_Orden` de `vw_PBI_Facturacion`.
* **Valores (Values):** Arrastra `ID_Orden` (configurado como "Recuento").

#### E. Gráfico de Incidentes por Gravedad
* Inserta un **Gráfico de columnas agrupadas**.
* **Eje X:** Arrastra `Gravedad` de `vw_PBI_Incidentes`.
* **Eje Y:** Arrastra `ID_Incidente` (configurado como "Recuento").
