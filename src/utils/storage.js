// src/utils/storage.js

const STORAGE_KEY = 'documents';

/**
 * Obtiene todos los documentos desde localStorage
 */
export function getDocuments() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Persiste el array completo de documentos en localStorage
 */
export function saveDocuments(docs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

/**
 * Crea o actualiza un documento completo
 */
export function createDocument(document) {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === document.id);
  if (idx >= 0) {
    docs[idx] = document;
  } else {
    docs.push(document);
  }
  saveDocuments(docs);
}

/**
 * Alias para createDocument (compatibilidad)
 */
export const saveDocument = createDocument;

/**
 * Actualiza sólo los códigos de un documento existente
 */
export function updateDocumentCodes(id, newCodes) {
  const docs = getDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx >= 0) {
    docs[idx].codes = newCodes;
    saveDocuments(docs);
    return true;
  }
  return false;
}

/**
 * Alias para updateDocumentCodes
 */
export const updateDocument = updateDocumentCodes;

/**
 * Borra varios documentos por su id
 */
export function deleteDocuments(ids) {
  const docs = getDocuments();
  const filtered = docs.filter(d => !ids.includes(d.id));
  saveDocuments(filtered);
  return filtered.length !== docs.length;
}

/**
 * Alias para deleteDocuments (solo borrar uno)
 */
export const deleteDocument = deleteDocuments;

/**
 * Obtiene un documento por su id
 */
export function getDocumentById(id) {
  return getDocuments().find(d => d.id === id);
}

/**
 * Busca documentos que cubran una lista de códigos
 * Devuelve documentos seleccionados (greedy) y códigos faltantes
 */
export function searchDocumentsByCodes(codes) {
  const docs = getDocuments();
  const allCodes = new Set(docs.flatMap(d => d.codes));
  const missingCodes = codes.filter(code => !allCodes.has(code));

  const sorted = [...docs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const selected = [];
  const covered = new Set();
  const needed = codes.length - missingCodes.length;

  const newCount = doc =>
    doc.codes.filter(c => codes.includes(c) && !covered.has(c)).length;

  while (covered.size < needed) {
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
    selected.push({ ...best, matchedCodes: matched });
  }

  return { documents: selected, missingCodes };
}
