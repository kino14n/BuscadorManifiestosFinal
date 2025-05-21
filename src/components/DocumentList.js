import React, { useState } from 'react';
import { deleteDocuments, getDocumentById } from '../utils/storage';

export default function DocumentList({ onView, onPrint }) {
  const [docs, setDocs] = useState(() => {
    return JSON.parse(localStorage.getItem('documents') || '[]')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  const [selected, setSelected] = useState(new Set());
  const [showCodesFor, setShowCodesFor] = useState(null);

  const toggleSelect = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = () => {
    deleteDocuments(Array.from(selected));
    const remaining = docs.filter(d => !selected.has(d.id));
    setDocs(remaining);
    setSelected(new Set());
  };

  const handleView = () => onView(Array.from(selected));
  const handlePrint = () => onPrint(Array.from(selected));

  if (!docs.length) return <p>No hay manifiestos.</p>;

  return (
    <div>
      {selected.size > 0 && (
        <div className="flex justify-end gap-3 mb-4">
          <button onClick={handleDelete} className="text-red-500">Eliminar ({selected.size})</button>
          <button onClick={handleView} className="text-blue-500">Ver ({selected.size})</button>
          <button onClick={handlePrint} className="text-green-500">Imprimir ({selected.size})</button>
        </div>
      )}

      <ul className="space-y-4">
        {docs.map(doc => (
          <li key={doc.id} className="p-4 border rounded">
            <div className="flex items-start justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                  <p className="text-sm text-gray-600">Archivo: {doc.fileName}</p>
                </div>
              </label>
              <button
                onClick={() => setShowCodesFor(showCodesFor === doc.id ? null : doc.id)}
                className="text-sm text-blue-500 hover:underline"
              >
                {showCodesFor === doc.id ? 'Ocultar Códigos' : 'Ver Códigos'}
              </button>
            </div>

            {showCodesFor === doc.id && (
              <div className="mt-2 pl-6">
                <p className="text-sm font-medium">Códigos:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doc.codes.map(code => (
                    <span key={code} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
