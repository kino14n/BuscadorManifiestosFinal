// utils/api.js
import axios from 'axios';
const API = axios.create({ baseURL: '/api' });

// devuelve lista
export const fetchDocuments = () => API.get('/manifiestos').then(r => r.data);

// detalle
export const fetchDocumentById = (id) => API.get(`/manifiestos/${id}`).then(r => r.data);

// crea o actualiza
export const saveDocument = (doc) =>
  doc.id
    ? API.put(`/manifiestos/${doc.id}`, doc).then(r => r.data)
    : API.post('/manifiestos', doc).then(r => r.data);

// borra
export const deleteDocuments = (ids) =>
  API.delete('/manifiestos', { data: { ids } }).then(r => r.data);
