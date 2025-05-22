import React, { useEffect, useState } from 'react';
import { fetchAll, deleteDocuments } from '../utils/api.js';

export default function DocumentList({ onView, onPrint }) {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [showCodes, setShowCodes] = useState({}); // id → bool

  useEffect(() => {
    fetchAll().then(setDocs);
  }, []);

  const toggleSelect = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const handleDelete = () => {
    deleteDocuments(Array.from(selected)).then(() => {
      fetchAll().then(setDocs);
      setSelected(new Set());
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {selected.size > 0 && (
          <>
            <button onClick={() => onView(Array.from(selected))}>Ver ({selected.size})</button>
            <button onClick={() => onPrint(Array.from(selected))}>Imprimir ({selected.size})</button>
            <button onClick={handleDelete}>Eliminar ({selected.size})</button>
          </>
        )}
      </div>
      <ul>
        {docs.map(doc => (
          <li key={doc.id} className="border-b py-2">
            <input
              type="checkbox"
              checked={selected.has(doc.id)}
              onChange={()=>toggleSelect(doc.id)}
            />
            <span className="ml-2">{doc.name} — {doc.fecha}</span>
            <button
              className="ml-4 text-blue-500"
              onClick={()=>setShowCodes(cs=>({...cs,[doc.id]:!cs[doc.id]}))}
            >
              {showCodes[doc.id] ? 'Ocultar Códigos' : 'Ver Códigos'}
            </button>
            <button className="ml-2 text-green-500" onClick={()=>onPrint([doc.id])}>Imprimir</button>
            <button className="ml-2 text-orange-500" onClick={()=>{/* abrir formulario con datos para editar */}}>Editar</button>
            {showCodes[doc.id] && (
              <div className="mt-2">
                <strong>Códigos:</strong> {doc.codes.join(', ')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
