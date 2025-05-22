// src/utils/api.js
export async function fetchManifiestos() {
  const res = await fetch('/api/manifiestos');
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function saveManifiesto(manifest) {
  const res = await fetch('/api/manifiestos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifest),
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  return await res.json();
}
