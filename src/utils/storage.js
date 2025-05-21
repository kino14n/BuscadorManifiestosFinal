const STORAGE_KEY = 'documents';

const getDocuments = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveDocuments = (docs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const saveDocument = (document) => {
  const documents = getDocuments();
  const idx = documents.findIndex(d => d.id === document.id);
  if (idx >= 0) documents[idx] = document;
  else documents.push(document);
  saveDocuments(documents);
};

export const updateDocumentCodes = (id, newCodes) => {
  const documents = getDocuments();
  const idx = documents.findIndex(d => d.id === id);
  if (idx >= 0) {
    documents[idx].codes = newCodes;
    saveDocuments(documents);
    return true;
  }
  return false;
};

export const deleteDocuments = (ids) => {
  const documents = getDocuments();
  const filtered = documents.filter(d => !ids.includes(d.id));
  saveDocuments(filtered);
  return filtered.length !== documents.length;
};

export const getDocumentById = (id) => {
  return getDocuments().find(d => d.id === id);
};

export const searchDocumentsByCodes = (codes) => {
  const documents = getDocuments();
  const allCodes = new Set(documents.flatMap(d => d.codes));
  const missingCodes = codes.filter(c => !allCodes.has(c));
  const sorted = [...documents].sort((a,b) => new Date(b.date) - new Date(a.date));
  const selected = [];
  const covered = new Set();
  const newCount = doc => doc.codes.filter(c=>codes.includes(c)&&!covered.has(c)).length;

  while (covered.size < codes.length - missingCodes.length) {
    let best = null, bestCount = 0;
    for (const doc of sorted) {
      if (selected.some(d=>d.id===doc.id)) continue;
      const cnt = newCount(doc);
      if (cnt>bestCount) { bestCount = cnt; best = doc; }
    }
    if (!best) break;
    const matched = best.codes.filter(c=>codes.includes(c)&&!covered.has(c));
    matched.forEach(c=>covered.add(c));
    selected.push({ ...best, matchedCodes: matched });
  }

  return { documents: selected, missingCodes };
};
