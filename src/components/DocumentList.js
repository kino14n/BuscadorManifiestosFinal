import React, { useState } from 'react';
import { getDocuments, deleteDocuments } from '../utils/storage.js';

const DocumentList = ({ onView, onPrint, onEdit }) => {
  const [allDocs, setAllDocs] = useState(getDocuments());
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(new Set());

  const visible = allDocs.filter(doc =>
    doc.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toggle = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = () => {
    if (selected.size && window.confirm('Eliminar seleccionados?')) {
      deleteDocuments([...selected]);
      setAllDocs(allDocs.filter(d => !selected.has(d.id)));
      setSelected(new Set());
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Consultar Documentos</h2>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      {visible.map(doc => (
        <div key={doc.id} className="p-4 border-b flex justify-between items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.has(doc.id)}
              onChange={() => toggle(doc.id)}
            />
            <div>
              <h4 className="font-medium">{doc.name}</h4>
              <small className="text-gray-600">{doc.date} — {doc.fileName}</small>
            </div>
          </label>
          <div className="space-x-4">
            <button onClick={() => onView([doc.id])} className="text-blue-500">Ver</button>
            <button onClick={() => onPrint([doc.id])} className="text-green-500">Imprimir</button>
            <button onClick={() => onEdit(doc.id)} className="text-indigo-500">Editar</button>
          </div>
        </div>
      ))}
      {visible.length === 0 && <p className="text-gray-500">No hay documentos.</p>}
      {selected.size > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleDelete} className="text-red-500">Eliminar ({selected.size})</button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
