// src/App.js
import React, { useState, useEffect } from 'react';
import DocumentList from './components/DocumentList.js';
import SearchForm from './components/SearchForm.js';
import DocumentForm from './components/DocumentForm.js';
import Tabs from './components/Tabs.js';
import Storage from './utils/storage.js';

function App() {
  const [documents, setDocuments] = useState([]);

  // Lee los documentos guardados
  useEffect(() => {
    const saved = Storage.getDocuments() || []; // ⚠️ llamada corregida
    setDocuments(saved);
  }, []);

  const addDocument = doc => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    Storage.saveDocument(doc);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      <Tabs />
      <SearchForm documents={documents} setDocuments={setDocuments} />
      <DocumentList documents={documents} />
      <DocumentForm addDocument={addDocument} />
    </div>
  );
}

export default App;
