// src/api.js
export async function fetchManifiestos() {
  const res = await fetch('/api/manifiestos');
  if (!res.ok) throw new Error('Error al cargar manifiestos');
  return await res.json();
}

export async function createManifiesto(data) {
  const res = await fetch('/api/manifiestos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear manifiesto');
  return await res.json();
}

export async function updateManifiesto(id, data) {
  const res = await fetch(`/api/manifiestos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar manifiesto');
  return await res.json();
}

export async function deleteManifiesto(id) {
  const res = await fetch(`/api/manifiestos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar manifiesto');
}
