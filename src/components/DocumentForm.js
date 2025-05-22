// src/components/DocumentForm.js
import React, { useState } from 'react';

export default function DocumentForm({ initial, onSaved, onCancel }) {
  const [titulo,   setTitulo]   = useState(initial?.titulo   || '');
  const [contenido, setContenido] = useState(initial?.contenido || '');
  const [fecha,     setFecha]     = useState(initial?.fecha?.slice(0,10) || '');

  const save = async () => {
    const method = initial ? 'PUT' : 'POST';
    const url    = initial ? `/api/manifiestos/${initial.id}` : '/api/manifiestos';
    await fetch(url, {
      method,
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ titulo, contenido, fecha })
    });
    onSaved();
  };

  return (
    <div className="border p-4 rounded mt-4 bg-white">
      <h2 className="font-semibold mb-2">{initial ? 'Editar' : 'Nuevo'} Manifiesto</h2>
      <input
        className="border p-1 w-full mb-2"
        placeholder="Título"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />
      <input
        type="date"
        className="border p-1 w-full mb-2"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
      />
      <textarea
        className="border p-1 w-full mb-2 h-24"
        placeholder="Códigos, uno por línea"
        value={contenido}
        onChange={e => setContenido(e.target.value)}
      />
      <div className="space-x-2">
        <button onClick={save}   className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
      </div>
    </div>
  );
}
