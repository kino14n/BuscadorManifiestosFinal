// src/components/DocumentList.js
import React, { useState } from 'react';

export default function DocumentList({
  documentos,
  onView,
  onPrint,
  onEdit,
  onDelete
}) {
  const [showCodes, setShowCodes] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleCodes = (id) => {
    setShowCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  return (
    <div>
      {/* Barra de acciones masivas */}
      {selectedIds.size > 0 && (
        <div className="flex justify-end gap-4 mb-4">
          <button
            className="text-red-500"
            onClick={() => onDelete(Array.from(selectedIds))}
          >
            Eliminar ({selectedIds.size})
          </button>
          <button
            className="text-blue-500"
            onClick={() => onView(Array.from(selectedIds))}
          >
            Ver ({selectedIds.size})
          </button>
          <button
            className="text-green-500"
            onClick={() => onPrint(Array.from(selectedIds))}
          >
            Imprimir ({selectedIds.size})
          </button>
        </div>
      )}

      {/* Filtro por nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre de documento..."
        className="mb-4 w-full p-2 border rounded"
        onChange={() => {/* opcional: filtrar texto */}}
      />

      {/* Lista */}
      <div className="space-y-2">
        {documentos.map((doc) => (
          <div key={doc.id} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <div>
                  <h4 className="font-medium">{doc.name}</h4>
                  <p className="text-sm text-gray-600">
                    {doc.date} — {doc.fileName}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => toggleCodes(doc.id)}
                  className="text-blue-500 text-sm"
                >
                  {showCodes[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
                </button>
                <button
                  onClick={() => onView([doc.id])}
                  className="text-blue-500 text-sm"
                >
                  Ver
                </button>
                <button
                  onClick={() => onPrint([doc.id])}
                  className="text-green-500 text-sm"
                >
                  Imprimir
                </button>
                <button
                  onClick={() => onEdit([doc.id])}
                  className="text-green-700 text-sm"
                >
                  Editar
                </button>
              </div>
            </div>
            {showCodes[doc.id] && (
              <div className="mt-2">
                <p className="text-sm font-medium">Códigos:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.codes.map((c) => (
                    <span
                      key={c}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
