// src/components/DocumentList.js
import React, { useState } from 'react';

export default function DocumentList({
  documentos = [],   // por si acaso viene undefined, lo forzamos a array
  onView,
  onPrint,
  onEdit,
  onDelete
}) {
  const [visibleCodesFor, setVisibleCodesFor] = useState(null);

  const toggleCodes = (id) =>
    setVisibleCodesFor(prev => (prev === id ? null : id));

  return (
    <div>
      {documentos.length === 0 ? (
        <p>No hay manifiestos.</p>
      ) : (
        <ul className="space-y-4">
          {documentos.map(doc => (
            <li key={doc.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-lg">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleCodes(doc.id)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {visibleCodesFor === doc.id ? 'Ocultar Códigos' : 'Ver Códigos'}
                  </button>
                  <button
                    onClick={() => onView(doc.id)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onPrint(doc.id)}
                    className="text-green-500 hover:underline text-sm"
                  >
                    Imprimir
                  </button>
                  <button
                    onClick={() => onEdit(doc.id)}
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {visibleCodesFor === doc.id && (
                <div className="mt-2">
                  <p className="font-medium">Códigos:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.isArray(doc.codes) && doc.codes.map(code => (
                      <span
                        key={code}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
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
      )}
    </div>
  );
}
