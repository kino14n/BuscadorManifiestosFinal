import React, { useState } from 'react';

export default function DocumentList({ documentos, onShowCodes, onEdit }) {
  const [filter, setFilter] = useState('');

  const filtered = documentos.filter((d) =>
    (d.name || d.titulo)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre de documento..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No hay documentos.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((doc) => (
            <li
              key={doc.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{doc.name || doc.titulo}</h3>
                <p className="text-sm text-gray-600">{doc.date}</p>
                <p className="text-sm text-gray-600">
                  Archivo: {doc.fileName}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => onShowCodes(doc.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Ver Códigos
                </button>
                <button
                  onClick={() => onEdit(doc.id)}
                  className="text-green-500 hover:text-green-700 text-sm"
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
