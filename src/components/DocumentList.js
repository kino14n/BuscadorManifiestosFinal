import React, { useState, useEffect } from 'react';
import { fetchAll, deleteDocuments } from '../utils/api.js';

export default function DocumentList({ onView, onEdit, onPrint }) {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [showCodesFor, setShowCodesFor] = useState(null);

  useEffect(() => {
    fetchAll().then(setDocs);
  }, []);

  const toggle = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = async () => {
    await deleteDocuments([...selected]);
    setSelected(new Set());
    setDocs(await fetchAll());
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Consultar Documentos</h2>
      <ul>
        {docs.map(d => (
          <li key={d.id} className="border-b py-2">
            <div className="flex items-center justify-between">
              <label>
                <input type="checkbox" checked={selected.has(d.id)}
                  onChange={()=>toggle(d.id)} className="mr-2" />
                <span className="font-medium">{d.name}</span>
                <span className="text-gray-500 ml-2">{d.date}</span>
              </label>
              <div className="space-x-3">
                <button onClick={()=>setShowCodesFor(showCodesFor===d.id?null:d.id)}
                  className="text-blue-500 text-sm">
                  {showCodesFor===d.id ? 'Ocultar Códigos' : 'Ver Códigos'}
                </button>
                <button onClick={()=>onEdit(d)}
                  className="text-green-500 text-sm">Editar</button>
                <button onClick={()=>onView([d.id])}
                  className="text-blue-500 text-sm">Ver</button>
                <button onClick={()=>onPrint([d.id])}
                  className="text-green-500 text-sm">Imprimir</button>
              </div>
            </div>
            {showCodesFor===d.id && (
              <div className="mt-2 ml-8">
                {d.codes.map(c=>(
                  <span key={c} className="inline-block bg-gray-100 px-2 py-1 mr-1 rounded">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      {selected.size>0 && (
        <div className="mt-4 text-right">
          <button onClick={handleDelete}
            className="text-red-500">Eliminar ({selected.size})</button>
        </div>
      )}
    </div>
  );
}
