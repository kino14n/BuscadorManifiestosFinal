// src/components/DocumentList.js
import React, { useState } from 'react';
import { deleteDocuments } from '../utils/api.js';

export default function DocumentList({ documentos, onAction }) {
  const [sel, setSel] = useState(new Set());
  const toggle = id => {
    const s = new Set(sel);
    s.has(id) ? s.delete(id) : s.add(id);
    setSel(s);
  };
  const doDelete = async () => {
    await deleteDocuments(Array.from(sel));
    onAction();
    setSel(new Set());
  };
  return (
    <div>
      {sel.size>0 && (
        <div className="flex justify-end gap-2 mb-2">
          <button onClick={doDelete} className="text-red-500">Eliminar ({sel.size})</button>
        </div>
      )}
      <ul>
        {documentos.map(d => (
          <li key={d.id} className="p-4 border rounded mb-2 flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={()=>toggle(d.id)} checked={sel.has(d.id)}/>
              <div>
                <p className="font-medium">{d.nombre}</p>
                <p className="text-sm text-gray-600">{d.fecha} — {d.archivo_nombre}</p>
              </div>
            </label>
            <div className="flex gap-4">
              <button onClick={()=>window.open(d.archivo_datos,'_blank')} className="text-blue-500">Ver</button>
              <button onClick={()=>window.print()} className="text-green-500">Imprimir</button>
              <button onClick={()=>window.location=`/?id=${d.id}`} className="text-indigo-500">Editar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
