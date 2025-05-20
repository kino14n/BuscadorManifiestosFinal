import React, { useState } from 'react';

export default function DocumentForm({ addDocument }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    addDocument({ titulo, contenido });
    setTitulo('');
    setContenido('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="titulo" className="block">Título:</label>
      <input
        id="titulo"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        className="border p-1 w-full"
        required
      />
      <label htmlFor="contenido" className="block mt-2">Contenido:</label>
      <textarea
        id="contenido"
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        className="border p-1 w-full"
        required
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Añadir
      </button>
    </form>
  );
}
