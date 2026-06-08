import axios from 'axios';

// Instância padrão do Axios configurada para se comunicar com o backend Django
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 5000, // Timeout para considerar que a API está OFFLINE
});
