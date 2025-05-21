// src/components/DocumentList.js
import React, { useState, useEffect } from 'react';
import { deleteDocuments, getDocumentById } from '../utils/storage';

export default function DocumentList({ onView, onPrint }) {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [showCodesFor, setShowCodesFor] = useState(null);

  // Carga inicial y ordena por fecha descendente
  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('documents') || '[]');
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDocs(all);
  }, []);

  const toggleSelect = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = () => {
    deleteDocuments(Array.from(selected));
    setDocs(docs.filter(d => !selected.has(d.id)));
    setSelected(new Set());
  };

  const handleView = () => onView(Array.from(selected));
  const handlePrint = () => onPrint(Array.from(selected));

  return (
    <div>
      {selected.size > 0 && (
        <div className="flex justify-end gap-4 mb-4 text-sm">
          <button onClick={handleDelete} className="text-red-500 hover:underline">
            Eliminar ({selected.size})
          </button>
          <button onClick={handleView} className="text-blue-500 hover:underline">
            Ver ({selected.size})
          </button>
          <button onClick={handlePrint} className="text-green-500 hover:underline">
            Imprimir ({selected.size})
          </button>
        </div>
      )}

      <ul className="space-y-4">
        {docs.map(doc => (
          <li key={doc.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <label className="flex items-center gap-3">
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
              <div className="mt-2 pl-8">
                <p className="text-sm font-medium">Códigos asignados:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doc.codes.map(code => (
                    <span
                      key={code}
                      className="bg-gray-100 px-2 py-1 rounded text-xs"
                    >
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
