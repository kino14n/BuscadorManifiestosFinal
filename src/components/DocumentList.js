import React from 'react';

export default function DocumentList({ documentos, onView, onPrint }) {
  if (!documentos || documentos.length === 0) {
    return <p>No hay manifiestos aún.</p>;
  }
  return (
    <ul className="space-y-2">
      {documentos.map((doc) => (
        <li key={doc.id} className="border p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{doc.name || doc.titulo}</h3>
              <p className="text-gray-600">{doc.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onView([doc.id])}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Ver
              </button>
              <button
                onClick={() => onPrint([doc.id])}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Imprimir
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
