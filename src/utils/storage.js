// src/utils/storage.js

const STORAGE_KEY = 'manifiestos';

// Guarda un documento al inicio del array
export function saveDocument(doc) {
  const docs = getDocuments();
  docs.unshift(doc);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

// Recupera todos los documentos
export function getDocuments() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Actualiza un documento por su id
export function updateDocumentById(id, updatedData) {
  const docs = getDocuments().map(doc =>
    doc.id === id ? { ...doc, ...updatedData } : doc
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  return docs;
}

// Alias para coincidir con tus imports
export const updateDocumentCodes = updateDocumentById;

// Elimina documentos cuyos ids estén en el array ids
export function deleteDocuments(ids) {
  const docs = getDocuments().filter(doc => !ids.includes(doc.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  return docs;
}

// Obtiene un único documento por id
export function getDocumentById(id) {
  return getDocuments().find(doc => doc.id === id);
}

// Busca documentos que contengan cualquiera de los códigos dados
export function searchDocumentsByCodes(codes) {
  return getDocuments().filter(doc =>
    codes.some(code => (doc.code || '').includes(code))
  );
}

// Exportación por defecto para compatibilidad con tus imports
const Storage = {
  saveDocument,
  getDocuments,
  updateDocumentById,
  updateDocumentCodes,
  deleteDocuments,
  getDocumentById,
  searchDocumentsByCodes,
};

export default Storage;
