import axios from 'axios';

// Configuración base
const client = axios.create({
    baseURL: 'http://localhost:3000/api', // Tu backend
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejo de errores global (Opcional pero recomendado)
client.interceptors.response.use(
    response => response,
    error => {
        console.error('Error de API:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default client;
