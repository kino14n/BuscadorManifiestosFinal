// src/components/DocumentList.js
import React from 'react';

export default function DocumentList({ documents, onEdit, onDelete }) {
  if (!documents.length) {
    return <p>No hay manifiestos aún.</p>;
  }

  return (
    <ul className="mb-4">
      {documents.map(doc => (
        <li key={doc.id} className="border p-2 mb-2 flex justify-between">
          <div>
            <h2 className="font-semibold">{doc.titulo}</h2>
            <p className="text-sm text-gray-600">{doc.contenido}</p>
            <small className="text-xs text-gray-400">
              {new Date(doc.fecha).toLocaleString()}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(doc.id, doc)}
              className="text-yellow-500 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="text-red-500 hover:underline"
            >
              Borrar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
