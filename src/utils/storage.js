// src/utils/storage.js
const API = '/api/manifiestos';

export async function getDocuments() {
  const res = await fetch(API);
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

export async function updateDocument(doc) {
  const res = await fetch(`${API}/${doc.id}`, {
    method: 'PUT',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(doc)
  });
  return res.json();
}

export async function deleteDocuments(ids) {
  const res = await fetch(API, {
    method: 'DELETE',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ ids })
  });
  return res.json();
}

export async function searchDocumentsByCodes(codes) {
  const docs = await getDocuments();
  // Reusa tu lógica greedy de before:
  const allCodes = new Set(docs.flatMap(d=>d.codigos));
  const missingCodes = codes.filter(c=>!allCodes.has(c));
  const sorted = [...docs].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  const selected = [];
  const covered = new Set();
  while (covered.size < codes.length - missingCodes.length) {
    let best = null, bestCnt = 0;
    for (const d of sorted) {
      if (selected.some(x=>x.id===d.id)) continue;
      const cnt = d.codigos.filter(c=>codes.includes(c)&&!covered.has(c)).length;
      if (cnt>bestCnt) { bestCnt=cnt; best=d; }
    }
    if (!best) break;
    const matched = best.codigos.filter(c=>codes.includes(c)&&!covered.has(c));
    matched.forEach(c=>covered.add(c));
    selected.push({ ...best, matchedCodes: matched });
  }
  return { documents: selected, missingCodes };
}
