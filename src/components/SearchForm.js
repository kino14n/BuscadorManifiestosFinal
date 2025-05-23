import React, { useState } from 'react';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const handle = e => setQuery(e.target.value);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por título o código…"
        value={query}
        onChange={handle}
        className="border px-2 py-1 w-full mb-4"
      />
      {/* Lógica de búsqueda inteligente aquí */}
      <p>Funciona la búsqueda inteligente: “{query}”</p>
    </div>
  );
}
