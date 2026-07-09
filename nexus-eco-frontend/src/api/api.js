import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Clientes API
export const getClientes = () => api.get('/clientes');
export const getClienteById = (id) => api.get(`/clientes/${id}`);
export const createCliente = (data) => api.post('/clientes', data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

// Solicitudes API
export const getSolicitudes = () => api.get('/solicitud-servicios');
export const createSolicitud = (data) => api.post('/solicitud-servicios', data);
export const updateSolicitud = (id, data) => api.put(`/solicitud-servicios/${id}`, data);

// Ejecucion / Evidencias API
export const getEjecuciones = () => api.get('/ejecucion-servicios');
export const createEjecucion = (data) => api.post('/ejecucion-servicios', data);
export const uploadEvidencia = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/evidencias/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Empleados API
export const getEmpleados = () => api.get('/empleados');

// Tipos Servicio API
export const getTiposServicio = () => api.get('/tipo-servicios');

// Ordenes API
export const getOrdenes = () => api.get('/orden-servicios');
export const createOrdenServicio = (data) => api.post('/orden-servicios', data);

// Auditorias API
export const getAuditorias = () => api.get('/auditorias');
export const getAuditoriasByEjecucion = (idEjecucion) => api.get(`/auditorias?ejecucionId=${idEjecucion}`);
export const createAuditoria = (data) => api.post('/auditorias', data);

// Incidentes API
export const getIncidentes = () => api.get('/incidentes');
export const getIncidentesByEjecucion = (idEjecucion) => api.get(`/incidentes?ejecucionId=${idEjecucion}`);
export const createIncidente = (data) => api.post('/incidentes', data);

// Informes API
export const getInformes = () => api.get('/informe-servicios');
export const createInforme = (data) => api.post('/informe-servicios', data);

// Planificacion API
export const getPlanificaciones = () => api.get('/planificacion-servicios');
export const createPlanificacion = (data) => api.post('/planificacion-servicios', data);

export default api;
