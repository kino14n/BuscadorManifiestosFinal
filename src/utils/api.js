// src/App.js
import React, { useState, useEffect } from 'react';
import SearchForm    from './components/SearchForm.js.js';
import DocumentList  from './components/DocumentList.js.js';
import DocumentForm  from './components/DocumentForm.js.js';

export default function App() {
  const [docs, setDocs]       = useState([]);
  const [filter, setFilter]   = useState('');
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await fetch('/api/manifiestos');
    setDocs(await res.json());
    setEditing(null);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      <SearchForm onSearch={setFilter} />
      <DocumentList
        documents={docs.filter(d =>
          d.titulo.toLowerCase().includes(filter.toLowerCase())
        )}
        onEdit={setEditing}
        onRefresh={load}
      />
      {editing && (
        <DocumentForm
          key={editing.id}
          initial={editing}
          onSaved={load}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
