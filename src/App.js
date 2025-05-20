// src/App.js
import React, { useState, useEffect } from 'react';
import Tabs from './components/Tabs.js';
import SearchForm from './components/SearchForm.js';
import DocumentList from './components/DocumentList.js';
import DocumentForm from './components/DocumentForm.js';
import {
  fetchManifiestos,
  createManifiesto,
  updateManifiesto,
  deleteManifiesto,
} from './api.js';

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManifiestos()
      .then(data => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los manifiestos');
        setLoading(false);
      });
  }, []);

  const addDocument = doc => {
    createManifiesto({ titulo: doc.titulo, contenido: doc.contenido })
      .then(nuevo => setDocuments(prev => [nuevo, ...prev]))
      .catch(err => {
        console.error(err);
        setError('Error al crear manifiesto');
      });
  };

  const editDocument = (id, data) => {
    updateManifiesto(id, data)
      .then(updated => setDocuments(prev =>
        prev.map(d => (d.id === id ? updated : d))
      ))
      .catch(err => {
        console.error(err);
        setError('Error al actualizar manifiesto');
      });
  };

  const removeDocument = id => {
    deleteManifiesto(id)
      .then(() => setDocuments(prev => prev.filter(d => d.id !== id)))
      .catch(err => {
        console.error(err);
        setError('Error al eliminar manifiesto');
      });
  };

  if (loading) return <p>Cargando manifiestos…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      <Tabs />
      <SearchForm documents={documents} setDocuments={setDocuments} />
      <DocumentList
        documents={documents}
        onEdit={editDocument}
        onDelete={removeDocument}
      />
      <DocumentForm addDocument={addDocument} />
    </div>
  );
}

export default App;
