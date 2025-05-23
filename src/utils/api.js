export const listManifestos = () =>
  fetch('/api/manifestos').then(res => res.json());

export const createManifesto = data =>
  fetch('/api/manifestos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const updateManifesto = (id, data) =>
  fetch(`/api/manifestos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const deleteManifesto = id =>
  fetch(`/api/manifestos/${id}`, { method: 'DELETE' });
