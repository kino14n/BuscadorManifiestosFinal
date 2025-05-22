import React, { useEffect, useState } from 'react';
import { listDocuments, deleteDocuments } from '../utils/api.js';

const DocumentList = ({ onView, onPrint }) => {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [showCodes, setShowCodes] = useState({}); // id → bool

  useEffect(() => {
    listDocuments().then(setDocs);
  }, []);

  const toggle = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = async () => {
    await deleteDocuments([...selected]);
    setDocs(prev => prev.filter(d => !selected.has(d.id)));
    setSelected(new Set());
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Consultar Documentos</h2>
      <input
        placeholder="Buscar por nombre..."
        className="w-full border p-2 rounded mb-4"
        onChange={e => {
          const term = e.target.value.toLowerCase();
          setDocs(prev => prev.filter(d => d.name.toLowerCase().includes(term)));
        }}
      />
      {docs.map(doc => (
        <div key={doc.id} className="border-b py-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.has(doc.id)}
              onChange={() => toggle(doc.id)}
            />
            <div>
              <strong>{doc.name}</strong> — {doc.fecha} — {doc.filename}
            </div>
          </label>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setShowCodes(s => ({ ...s, [doc.id]: !s[doc.id] }))} className="text-indigo-500">
              {showCodes[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
            </button>
            <button onClick={() => onView([doc.id])} className="text-blue-500">
              Ver
            </button>
            <button onClick={() => onPrint([doc.id])} className="text-green-500">
              Imprimir
            </button>
          </div>
          {showCodes[doc.id] && (
            <div className="mt-2">
              {doc.codes.map(c => (
                <span key={c} className="px-2 py-1 bg-gray-100 rounded mr-1 text-sm">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
      {selected.size > 0 && (
        <button onClick={handleDelete} className="mt-4 text-red-500">
          Eliminar ({selected.size})
        </button>
      )}
    </div>
  );
};

export default DocumentList;
