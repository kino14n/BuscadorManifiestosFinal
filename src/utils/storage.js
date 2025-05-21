// src/utils/storage.js

const STORAGE_KEY = 'documents';

/**
 * Devuelve el array completo de documentos desde localStorage
 */
export function getDocuments() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Guarda todo el array de documentos en localStorage
 * @param {Array} docs 
 */
function saveDocuments(docs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

/**
 * Guarda o actualiza un documento completo
 * @param {Object} document 
 */
export function saveDocument(document) {
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
 * Actualiza sólo los códigos de un documento existente
 * @param {number|string} id 
 * @param {Array<string>} newCodes 
 * @returns {boolean} true si encontró y actualizó
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
 * Borra varios documentos por su id
 * @param {Array<number|string>} ids 
 * @returns {boolean} true si se eliminó al menos uno
 */
export function deleteDocuments(ids) {
  const docs = getDocuments();
  const filtered = docs.filter(d => !ids.includes(d.id));
  saveDocuments(filtered);
  return filtered.length !== docs.length;
}

/**
 * Obtiene un documento concreto por id
 * @param {number|string} id 
 * @returns {Object|undefined}
 */
export function getDocumentById(id) {
  return getDocuments().find(d => d.id === id);
}

/**
 * Busca documentos que cubran la lista de códigos:
 * - Devuelve la lista óptima (greedy set cover)
 * - Y los códigos que no aparecen en ningún documento
 * @param {Array<string>} codes 
 * @returns {{ documents: Array, missingCodes: Array<string> }}
 */
export function searchDocumentsByCodes(codes) {
  const docs = getDocuments();

  // Códigos inexistentes en todo el sistema
  const allCodes = new Set(docs.flatMap(d => d.codes));
  const missingCodes = codes.filter(code => !allCodes.has(code));

  // Ordenamos por fecha (más recientes primero)
  const sorted = [...docs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const selected = [];
  const covered = new Set();

  const newCount = doc =>
    doc.codes.filter(c => codes.includes(c) && !covered.has(c)).length;

  // Greedy: elegimos el doc que cubre más códigos nuevos hasta cubrirlos todos
  while (covered.size < codes.length - missingCodes.length) {
    let best = null;
    let bestCnt = 0;
    for (const doc of sorted) {
      if (selected.some(d => d.id === doc.id)) continue;
      const cnt = newCount(doc);
      if (cnt > bestCnt) {
        bestCnt = cnt;
        best = doc;
      }
    }
    if (!best) break;
    const matched = best.codes.filter(
      c => codes.includes(c) && !covered.has(c)
    );
    matched.forEach(c => covered.add(c));
    selected.push({ ...best, matchedCodes: matched });
  }

  return { documents: selected, missingCodes };
}
