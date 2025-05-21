// src/components/DocumentList.js
import React, { useState } from 'react';

export default function DocumentList({
  documentos,
  onView,
  onPrint,
  onEdit,
  onDelete
}) {
  const [visibleCodes, setVisibleCodes] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filter, setFilter] = useState('');

  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  const toggleCodes = (id) => {
    const s = new Set(visibleCodes);
    s.has(id) ? s.delete(id) : s.add(id);
    setVisibleCodes(s);
  };

  // filter by name
  const shown = documentos.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Acciones masivas */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex justify-end gap-4 text-sm">
          <button
            onClick={() => onDelete(Array.from(selectedIds))}
            className="text-red-500 hover:underline"
          >
            Eliminar ({selectedIds.size})
          </button>
          <button
            onClick={() => onView(Array.from(selectedIds))}
            className="text-blue-500 hover:underline"
          >
            Ver ({selectedIds.size})
          </button>
          <button
            onClick={() => onPrint(Array.from(selectedIds))}
            className="text-green-500 hover:underline"
          >
            Imprimir ({selectedIds.size})
          </button>
        </div>
      )}

      {/* Buscador de nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre de documento..."
        className="w-full mb-4 p-2 border rounded"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {/* Lista */}
      {shown.map(doc => (
        <div key={doc.id} className="mb-4 border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedIds.has(doc.id)}
                onChange={() => toggleSelect(doc.id)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-600">
                  {doc.date} — {doc.fileName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button onClick={() => onView([doc.id])} className="text-blue-500 hover:underline">
                Ver
              </button>
              <button onClick={() => onPrint([doc.id])} className="text-green-500 hover:underline">
                Imprimir
              </button>
              <button onClick={() => onEdit(doc.id)} className="text-green-500 hover:underline">
                Editar
              </button>
            </div>
          </div>

          {/* Toggle Códigos */}
          <div className="mt-2">
            <button
              onClick={() => toggleCodes(doc.id)}
              className="text-blue-500 text-sm hover:underline"
            >
              {visibleCodes.has(doc.id) ? 'Ocultar Códigos' : 'Ver Códigos'}
            </button>

            {visibleCodes.has(doc.id) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {doc.codes.map(code => (
                  <span
                    key={code}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {code}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {shown.length === 0 && (
        <p className="text-center text-gray-500">No hay documentos para mostrar.</p>
      )}
    </div>
  );
}
