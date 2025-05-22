// funciones para llamar a tu API REST en /api/manifiestos
const API = '/api/manifiestos';

export async function fetchAll() {
  const res = await fetch(API);
  return res.json();
}

export async function createDocument(doc) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc)
  });
  return res.json();
}

export async function updateCodes(id, codes) {
  const res = await fetch(`${API}/${id}/codigos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codes })
  });
  return res.json();
}

export async function deleteDocuments(ids) {
  await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
}
