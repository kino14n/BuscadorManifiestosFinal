// src/services/api.js
const API = '/api/manifiestos';

export async function fetchManifiestos() {
  const res = await fetch(API);
  return res.json();
}

export async function fetchManifiesto(id) {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

export async function createManifiesto(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateManifiesto(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteManifiestos(ids) {
  await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}
