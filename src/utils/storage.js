const STORAGE_KEY = 'documents';

const getDocuments = () => {
  const s = localStorage.getItem(STORAGE_KEY);
  return s ? JSON.parse(s) : [];
};

const saveDocuments = (docs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const saveDocument = (document) => {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === document.id);
  if (idx >= 0) docs[idx] = document;
  else docs.push(document);
  saveDocuments(docs);
};

export const updateDocumentCodes = (id, newCodes) => {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx >= 0) {
    docs[idx].codes = newCodes;
    saveDocuments(docs);
    return true;
  }
  return false;
};

export const deleteDocuments = (ids) => {
  const docs = getDocuments();
  const filtered = docs.filter(d => !ids.includes(d.id));
  saveDocuments(filtered);
  return filtered.length !== docs.length;
};

export const getDocumentById = (id) => {
  return getDocuments().find(d => d.id === id);
};

export const searchDocumentsByCodes = (codes) => {
  /* ...tu implementación de greedy set cover... */
};
