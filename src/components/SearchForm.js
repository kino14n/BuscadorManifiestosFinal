// src/components/SearchForm.js
import React, { useState } from 'react';

export default function SearchForm({ documents, setDocuments }) {
  const [query, setQuery] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = documents.filter(doc =>
      terms.every(term =>
        doc.titulo.toLowerCase().includes(term) ||
        doc.contenido.toLowerCase().includes(term)
      )
    );
    setDocuments(filtered);
  };

  const handleReset = () => {
    // Para resetear, recargamos toda la lista desde el servidor
    window.location.reload();
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="border p-1 flex-grow"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
        Buscar
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="bg-gray-300 text-black px-4 py-1 rounded"
      >
        Reset
      </button>
    </form>
  );
}
