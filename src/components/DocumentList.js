// src/components/DocumentList.js

import React, { useState } from 'react';

export default function DocumentList({
  documentos,
  onView,
  onPrint,
  onDelete,
  onEdit
}) {
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [showCodes, setShowCodes] = useState(new Set());

  // filtra por nombre/título
  const lista = documentos.filter(d =>
    (d.name || d.titulo)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const toggleSelect = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleCodes = id => {
    const s = new Set(showCodes);
    s.has(id) ? s.delete(id) : s.add(id);
    setShowCodes(s);
  };

  return (
    <div>
      {/* buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre de documento..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* acciones masivas */}
      {selected.size > 0 && (
        <div className="flex justify-end gap-4 mb-4 text-sm">
          <button onClick={() => onDelete([...selected])} className="text-red-500">
            Eliminar ({selected.size})
          </button>
          <button onClick={() => onView([...selected])} className="text-blue-500">
            Ver ({selected.size})
          </button>
          <button onClick={() => onPrint([...selected])} className="text-green-500">
            Imprimir ({selected.size})
          </button>
        </div>
      )}

      {lista.length === 0 ? (
        <p className="text-gray-500">No hay documentos.</p>
      ) : (
        <ul className="space-y-4">
          {lista.map(doc => (
            <li key={doc.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                    className="h-4 w-4"
                  />
                  <div>
                    <h3 className="font-bold">{doc.name || doc.titulo}</h3>
                    <p className="text-sm text-gray-600">{doc.date}</p>
                    <p className="text-sm text-gray-600">
                      Archivo: {doc.fileName}
                    </p>
                  </div>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleCodes(doc.id)}
                    className="text-blue-500 text-sm"
                  >
                    {showCodes.has(doc.id) ? 'Ocultar Códigos' : 'Ver Códigos'}
                  </button>
                  <button
                    onClick={() => onEdit(doc.id)}
                    className="text-green-500 text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {showCodes.has(doc.id) && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Códigos:</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.codes.map(c => (
                      <span
                        key={c}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {c}
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
// src/components/DocumentList.js

import React, { useState } from 'react';

export default function DocumentList({
  documentos,
  onView,
  onPrint,
  onDelete,
  onEdit
}) {
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [showCodes, setShowCodes] = useState(new Set());

  // filtra por nombre/título
  const lista = documentos.filter(d =>
    (d.name || d.titulo)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const toggleSelect = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleCodes = id => {
    const s = new Set(showCodes);
    s.has(id) ? s.delete(id) : s.add(id);
    setShowCodes(s);
  };

  return (
    <div>
      {/* buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre de documento..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* acciones masivas */}
      {selected.size > 0 && (
        <div className="flex justify-end gap-4 mb-4 text-sm">
          <button onClick={() => onDelete([...selected])} className="text-red-500">
            Eliminar ({selected.size})
          </button>
          <button onClick={() => onView([...selected])} className="text-blue-500">
            Ver ({selected.size})
          </button>
          <button onClick={() => onPrint([...selected])} className="text-green-500">
            Imprimir ({selected.size})
          </button>
        </div>
      )}

      {lista.length === 0 ? (
        <p className="text-gray-500">No hay documentos.</p>
      ) : (
        <ul className="space-y-4">
          {lista.map(doc => (
            <li key={doc.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                    className="h-4 w-4"
                  />
                  <div>
                    <h3 className="font-bold">{doc.name || doc.titulo}</h3>
                    <p className="text-sm text-gray-600">{doc.date}</p>
                    <p className="text-sm text-gray-600">
                      Archivo: {doc.fileName}
                    </p>
                  </div>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleCodes(doc.id)}
                    className="text-blue-500 text-sm"
                  >
                    {showCodes.has(doc.id) ? 'Ocultar Códigos' : 'Ver Códigos'}
                  </button>
                  <button
                    onClick={() => onEdit(doc.id)}
                    className="text-green-500 text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {showCodes.has(doc.id) && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Códigos:</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.codes.map(c => (
                      <span
                        key={c}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {c}
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
