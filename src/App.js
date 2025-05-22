// src/App.js
import React, { useState, useEffect } from 'react';
import DocumentForm from './components/DocumentForm';
import DocumentList from './components/DocumentList';
import { fetchManifiestos } from './utils/api';

export default function App() {
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => {
    fetchManifiestos().then(setDocs).catch(console.error);
  };

  useEffect(load, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      {editing ? (
        <DocumentForm
          initialData={editing}
          onSaved={(d) => {
            setEditing(null);
            load();
          }}
        />
      ) : (
        <>
          <button onClick={() => setEditing({})}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
            Nuevo
          </button>
          <DocumentList
            documents={docs}
            onEdit={(d) => setEditing(d)}
            onRefresh={load}
          />
        </>
      )}
    </div>
  );
}
