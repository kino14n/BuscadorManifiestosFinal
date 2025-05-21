import React, { useState } from 'react';

export default function DocumentList({
  documentos = [],
  onView, onPrint, onEdit, onDelete
}) {
  const [visibleCodes, setVisibleCodes] = useState(new Set());
  const toggle = id => {
    const s = new Set(visibleCodes);
    s.has(id)? s.delete(id): s.add(id);
    setVisibleCodes(s);
  };

  if (!documentos.length) return <p>No hay documentos.</p>;

  return (
    <>
      {documentos.map(doc => (
        <div key={doc.id} className="mb-4 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox"
                onChange={e=>onDelete && onDelete(e.target.checked, doc.id)}
                className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-sm text-gray-600">{doc.date} — {doc.fileName}</div>
              </div>
            </label>
            <div className="flex gap-4">
              <button onClick={()=>onView && onView([doc.id])}
                className="text-blue-500">Ver</button>
              <button onClick={()=>onPrint && onPrint([doc.id])}
                className="text-green-500">Imprimir</button>
              <button onClick={()=>onEdit && onEdit(doc.id)}
                className="text-yellow-500">Editar</button>
              <button onClick={()=>toggle(doc.id)}
                className="text-gray-700">
                {visibleCodes.has(doc.id)? 'Ocultar Códigos' : 'Ver Códigos'}
              </button>
            </div>
          </div>
          {visibleCodes.has(doc.id) && (
            <div className="mt-2">
              <strong>Códigos:</strong>
              <div className="flex gap-1 flex-wrap mt-1">
                {doc.codes.map(c=>(
                  <span key={c} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
