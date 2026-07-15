# Implementación de Dropdowns Buscables de Clientes y Servicios

Hemos modificado la interacción de selección de datos en la pantalla de generación de órdenes (`Servicios.jsx`) para que sea mucho más fluida, moderna y profesional.

---

## 1. Orden de Listado Descendente (Reciente primero)

- Modificamos el ordenamiento del array de clientes al cargarse en el formulario.
- Ahora, los clientes se ordenan por su identificador único (`idCliente`) en orden descendente:
  `sort((a, b) => b.idCliente - a.idCliente)`
- Esto garantiza que el cliente recién registrado aparezca al principio de la lista en lugar de obligar al usuario a hacer scroll hasta el final del componente.

---

## 2. Buscador en Tiempo Real (Autocompletado Vacío por Defecto)

Para evitar la clásica lista desplegable rígida, creamos componentes **Searchable Dropdowns** personalizados de puro Javascript y CSS:

### Selección de Cliente:
- Reemplazamos el select por un input de texto que asimila caracteres a medida que el usuario escribe.
- Acepta búsquedas tanto por **Razón Social** como por **RUC** corporativo.
- **Inicio Vacío:** Por defecto, al abrir el formulario, el buscador se inicializa completamente vacío para mostrar únicamente el texto de guía (placeholder) y así requerir una acción consciente de búsqueda/selección por parte del usuario.
- Al enfocar o escribir, despliega un panel flotante dinámico y elegante con sombra paralela (box-shadow).
- Al seleccionar una coincidencia mediante un click, se setea el Razón Social/RUC en el input, se asigna el ID interno para el envío a la API de Spring Boot y se cierra el listado.

### Selección de Tipo de Servicio:
- Reemplazamos el select de servicios contratados por el mismo patrón de autocompletado interactivo.
- Permite buscar instantáneamente por el nombre del servicio (por ejemplo: "Control de Plagas", "Limpieza de Reservorios") mostrando su respectiva tarifa base al lado.
- Al igual que el cliente, **se inicializa en blanco** con su placeholder correspondiente.

---

## 3. Estilos Premium e Integración Visual

Añadimos reglas estéticas en `Servicios.css` para el panel autocompletable:
- Fondo blanco puro, bordes suaves y sombra de elevación `box-shadow` premium.
- Límite de altura de `220px` y barra de scroll integrada para no romper el layout del formulario.
- Resaltado interactivo (`hover`) en color `#f8fafc` cuando el cursor pasa sobre las opciones del buscador.
