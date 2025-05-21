// src/utils/storage.js

const STORAGE_KEY = 'documents';

/**
 * Devuelve todos los documentos desde localStorage
 */
export const getDocuments = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveDocuments = (docs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

/**
 * Guarda o actualiza un documento completo
 */
export const saveDocument = (document) => {
  const documents = getDocuments();
  const idx = documents.findIndex(d => d.id === document.id);
  if (idx >= 0) {
    documents[idx] = document;
  } else {
    documents.push(document);
  }
  saveDocuments(documents);
};

/**
 * Actualiza sólo los códigos de un documento existente
 */
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

/**
 * Borra varios documentos por su id
 */
export const deleteDocuments = (ids) => {
  const documents = getDocuments();
  const filtered = documents.filter(d => !ids.includes(d.id));
  saveDocuments(filtered);
  return filtered.length !== documents.length;
};

/**
 * Obtiene un documento por su id
 */
export const getDocumentById = (id) => {
  return getDocuments().find(d => d.id === id);
};

/**
 * Busca documentos que cubran la lista de códigos:
 * - Devuelve la lista óptima (greedy set cover)
 * - Y los códigos que no aparecen en ningún documento
 */
export const searchDocumentsByCodes = (codes) => {
  const documents = getDocuments();

  // Códigos que no existen en *ningún* doc
  const allCodes = new Set(documents.flatMap(d => d.codes));
  const missingCodes = codes.filter(code => !allCodes.has(code));

  // Ordenamos documentos por fecha (más reciente primero)
  const sorted = [...documents].sort((a, b) => new Date(b.date) - new Date(a.date));

  const selected = [];
  const covered = new Set();

  // Cuántos códigos nuevos aporta un doc
  const newCount = (doc) =>
    doc.codes.filter(c => codes.includes(c) && !covered.has(c)).length;

  // Greedy: mientras queden códigos por cubrir
  while (covered.size < codes.length - missingCodes.length) {
    let best = null;
    let bestCount = 0;

    for (const doc of sorted) {
      if (selected.some(d => d.id === doc.id)) continue;
      const cnt = newCount(doc);
      if (cnt > bestCount) {
        bestCount = cnt;
        best = doc;
      }
    }
    if (!best) break;

    const matched = best.codes.filter(c => codes.includes(c) && !covered.has(c));
    matched.forEach(c => covered.add(c));

    selected.push({
      ...best,
      matchedCodes: matched
    });
  }

  return {
    documents: selected,
    missingCodes
  };
};
