import React, { useState } from 'react';

export default function DocumentList({ documentos, selected, onSelect, onView, onPrint, onEdit, onDelete }) {
  const [showCodes, setShowCodes] = useState({});

  return (
    <div className="p-6 bg-white rounded shadow">
      {documentos.map(doc => (
        <div key={doc.id} className="border-b py-2 flex items-center">
          <input
            type="checkbox"
            checked={selected.includes(doc.id)}
            onChange={() =>
              onSelect(selected.includes(doc.id)
                ? selected.filter(i=>i!==doc.id)
                : [...selected, doc.id])
            }
          />
          <div className="flex-1 ml-4">
            <div className="flex justify-between">
              <span>{doc.name}</span>
              <div className="space-x-4 text-sm">
                <button onClick={() => setShowCodes({...showCodes, [doc.id]:!showCodes[doc.id]})}>
                  {showCodes[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
                </button>
                <button onClick={()=>onView([doc.id])}>Ver</button>
                <button onClick={()=>onPrint([doc.id])}>Imprimir</button>
                <button onClick={()=>onEdit(doc)}>Editar</button>
              </div>
            </div>
            <small>{doc.fecha} — {doc.file_name}</small>
            {showCodes[doc.id] && (
              <div className="mt-1">
                {doc.codes.map(c=>(
                  <span key={c} className="bg-gray-200 px-2 py-1 mr-1">{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {selected.length > 0 && (
        <button onClick={onDelete} className="mt-4 text-red-500">Eliminar ({selected.length})</button>
      )}
    </div>
  );
}
