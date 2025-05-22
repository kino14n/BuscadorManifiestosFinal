// src/utils/api.js
const BASE = '/api/manifiestos';

export async function listDocuments() {
  const res = await fetch(BASE);
  return res.json();
}

export async function createDocument(doc) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc)
  });
  return res.json();
}

export async function updateDocument(doc) {
  const res = await fetch(`${BASE}/${doc.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc)
  });
  return res.json();
}

export async function deleteDocuments(ids) {
  await fetch(BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
}

export async function searchDocumentsByCodes(codes) {
  const docs = await listDocuments();
  const allCodes = new Set(docs.flatMap(d => d.codes));
  const missingCodes = codes.filter(c => !allCodes.has(c));

  const sorted = docs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const selected = [];
  const covered = new Set();

  const newCount = doc => doc.codes.filter(c => codes.includes(c) && !covered.has(c)).length;

  while (covered.size < codes.length - missingCodes.length) {
    let best = null, bestCnt = 0;
    for (const doc of sorted) {
      if (selected.some(d => d.id === doc.id)) continue;
      const cnt = newCount(doc);
      if (cnt > bestCnt) { bestCnt = cnt; best = doc; }
    }
    if (!best) break;
    const matched = best.codes.filter(c => codes.includes(c) && !covered.has(c));
    matched.forEach(c => covered.add(c));
    selected.push({ ...best, matchedCodes: matched });
  }

  return { documents: selected, missingCodes };
}
