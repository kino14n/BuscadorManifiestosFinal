// src/components/DocumentList.js
import React, { useState } from 'react';

export default function DocumentList({ documentos, onView, onPrint, onDelete }) {
  // Estado para saber qué documentos tienen sus códigos visibles
  const [visibleCodes, setVisibleCodes] = useState({});

  const toggleCodes = (id) => {
    setVisibleCodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!documentos.length) return <p>No hay manifiestos.</p>;

  return (
    <div className="space-y-4">
      {documentos.map(doc => (
        <div key={doc.id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start">
            {/* Información básica */}
            <div>
              <h4 className="font-medium text-lg">{doc.name || doc.titulo}</h4>
              {doc.date && <p className="text-sm text-gray-600">{doc.date}</p>}
              {doc.fileName && (
                <p className="text-sm text-gray-500">Archivo: {doc.fileName}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              {onView && (
                <button
                  onClick={() => onView([doc.id])}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Ver
                </button>
              )}
              {onPrint && (
                <button
                  onClick={() => onPrint([doc.id])}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Imprimir
                </button>
              )}
              <button
                onClick={() => toggleCodes(doc.id)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                {visibleCodes[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete([doc.id])}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Lista de códigos, sólo si está toggled-on */}
          {visibleCodes[doc.id] && doc.codes && doc.codes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">Códigos:</p>
              <div className="flex flex-wrap gap-2">
                {doc.codes.map(code => (
                  <span
                    key={code}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
