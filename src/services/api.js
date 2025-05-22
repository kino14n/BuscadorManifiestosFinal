const API = '/api/manifiestos';

export async function fetchAll() {
  const res = await fetch(API);
  return res.json();
}

export async function fetchById(id) {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

export async function createDocument(doc) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(doc)
  });
  return res.json();
}

export async function updateDocument(id, doc) {
  const res = await fetch(`${API}/${id}`, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(doc)
  });
  return res.json();
}

export async function deleteDocuments(ids) {
  const res = await fetch(API, {
    method:'DELETE',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ ids })
  });
  return res.json();
}
