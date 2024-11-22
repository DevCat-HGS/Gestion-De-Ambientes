import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  me: () => api.get('/auth/me'),
};

export const ambientes = {
  getAll: () => api.get('/ambientes'),
  getOne: (id: number) => api.get(`/ambientes/${id}`),
  create: (data: { nombre: string; ubicacion: string }) =>
    api.post('/ambientes', data),
  update: (id: number, data: { nombre: string; ubicacion: string }) =>
    api.put(`/ambientes/${id}`, data),
  delete: (id: number) => api.delete(`/ambientes/${id}`),
};

export const dispositivos = {
  getAll: () => api.get('/dispositivos'),
  getByAmbiente: (id: number) => api.get(`/dispositivos/ambiente/${id}`),
  createBatch: (data: { id_ambiente: number; cantidad: number }) =>
    api.post('/dispositivos/batch', data),
  update: (id: number, data: any) => api.put(`/dispositivos/${id}`, data),
};

export const instructores = {
  getAll: () => api.get('/instructores'),
  getOne: (id: number) => api.get(`/instructores/${id}`),
  create: (data: { nombre: string; correo: string; telefono: string }) =>
    api.post('/instructores', data),
  update: (id: number, data: { nombre: string; correo: string; telefono: string }) =>
    api.put(`/instructores/${id}`, data),
  delete: (id: number) => api.delete(`/instructores/${id}`),
};

export const jornadas = {
  getAll: () => api.get('/jornadas'),
  getOne: (id: number) => api.get(`/jornadas/${id}`),
  create: (data: any) => api.post('/jornadas', data),
  registerChequeoInicial: (id: number, data: any) =>
    api.post(`/jornadas/${id}/chequeo-inicial`, data),
  registerChequeoFinal: (id: number, data: any) =>
    api.put(`/jornadas/${id}/chequeo-final`, data),
};