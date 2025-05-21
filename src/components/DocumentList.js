import React, { useState } from 'react';

export default function DocumentList({ documentos, onEdit }) {
  const [filter, setFilter] = useState('');
  const [openCodes, setOpenCodes] = useState(new Set());

  // Filtrado por nombre o título
  const filtered = documentos.filter((d) =>
    (d.name || d.titulo)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const toggleCodes = (id) => {
    const s = new Set(openCodes);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setOpenCodes(s);
  };

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
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{doc.name || doc.titulo}</h3>
                  <p className="text-sm text-gray-600">{doc.date}</p>
                  <p className="text-sm text-gray-600">
                    Archivo: {doc.fileName}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleCodes(doc.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    {openCodes.has(doc.id)
                      ? 'Ocultar Códigos'
                      : 'Ver Códigos'}
                  </button>
                  <button
                    onClick={() => onEdit(doc.id)}
                    className="text-green-500 hover:text-green-700 text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {openCodes.has(doc.id) && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Códigos:</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.codes.map((code) => (
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
