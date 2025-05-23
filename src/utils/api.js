// src/utils/api.js

// 1) Listar
export const listManifestos = () =>
  fetch('/api/manifestos').then(res => res.json());

// 2) Crear
export const createManifesto = data =>
  fetch('/api/manifestos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

// 3) Actualizar
export const updateManifesto = (id, data) =>
  fetch(`/api/manifestos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

// 4) Borrar
export const deleteManifesto = id =>
  fetch(`/api/manifestos/${id}`, { method: 'DELETE' });

// Alias para compatibilidad con fetchAll
export { listManifestos as fetchAll };
