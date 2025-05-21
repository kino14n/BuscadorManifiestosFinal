import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocuments } from '../utils/storage.js';

export default function DocumentList({ onView, onPrint }) {
  const [docs, setDocs] = useState([]);
  const [sel, setSel] = useState(new Set());
  const [showCodes, setShowCodes] = useState({});

  useEffect(() => {
    (async()=> setDocs(await getDocuments()))();
  }, []);

  const refresh = async () => setDocs(await getDocuments());

  const toggleSelect = id => {
    const s = new Set(sel);
    s.has(id)? s.delete(id) : s.add(id);
    setSel(s);
  };

  const handleDelete = async () => {
    await deleteDocuments(Array.from(sel));
    setSel(new Set());
    refresh();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {sel.size > 0 && (
        <div className="flex justify-end gap-4 mb-4">
          <button onClick={handleDelete} className="text-red-500">
            Eliminar ({sel.size})
          </button>
          <button onClick={()=>onView([...sel])} className="text-blue-500">
            Ver ({sel.size})
          </button>
          <button onClick={()=>onPrint([...sel])} className="text-green-500">
            Imprimir ({sel.size})
          </button>
        </div>
      )}
      <ul>
        {docs.map(d => (
          <li key={d.id} className="border-b py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sel.has(d.id)}
                  onChange={()=>toggleSelect(d.id)}
                />
                <div>
                  <p className="font-medium">{d.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {d.fecha} — {d.archivo_nombre}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={()=>setShowCodes(s=>({...s,[d.id]: !s[d.id]}))}
                  className="text-blue-500 text-sm"
                >
                  { showCodes[d.id] ? 'Ocultar Códigos' : 'Ver Códigos' }
                </button>
                <button onClick={()=>onView([d.id])} className="text-blue-500 text-sm">Ver</button>
                <button onClick={()=>onPrint([d.id])} className="text-green-500 text-sm">Imprimir</button>
              </div>
            </div>
            { showCodes[d.id] && (
              <div className="mt-2">
                <p className="font-medium text-sm">Códigos:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {d.codigos.map(c=>(
                    <span key={c} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
