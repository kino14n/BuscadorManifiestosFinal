// src/components/DocumentList.js
import React, { useState } from 'react';

export default function DocumentList({ documents, onEdit, onRefresh }) {
  const [showIds, setShowIds] = useState({});

  return (
    <div className="bg-white p-4 rounded">
      {documents.map(doc => (
        <div key={doc.id} className="border-b py-2">
          <div className="flex justify-between items-center">
            <div>
              <strong>{doc.titulo}</strong><br/>
              <small>{new Date(doc.fecha).toLocaleDateString()}</small>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowIds(s => ({ ...s, [doc.id]: !s[doc.id] }))}
                className="text-blue-600"
              >
                {showIds[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
              </button>
              <button onClick={() => onEdit(doc)} className="text-green-600">Editar</button>
              <button
                onClick={async () => {
                  if (confirm('¿Eliminar?')) {
                    await fetch(`/api/manifiestos/${doc.id}`, { method: 'DELETE' });
                    onRefresh();
                  }
                }}
                className="text-red-600"
              >Eliminar</button>
            </div>
          </div>
          {showIds[doc.id] && (
            <pre className="bg-gray-100 p-2 my-2 whitespace-pre-wrap">
              {doc.contenido}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
