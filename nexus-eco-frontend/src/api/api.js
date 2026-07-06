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
export const getSolicitudes = () => api.get('/solicitudservicios');
export const createSolicitud = (data) => api.post('/solicitudservicios', data);
export const updateSolicitud = (id, data) => api.put(`/solicitudservicios/${id}`, data);

// Ejecucion / Evidencias API
export const getEjecuciones = () => api.get('/ejecucionservicios');
export const createEjecucion = (data) => api.post('/ejecucionservicios', data);
export const uploadEvidencia = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/archivos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export default api;
