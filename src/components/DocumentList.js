import React, { useState, useEffect } from 'react';
import { fetchAll } from '../utils/api.js';

export default function DocumentList() {
  const [docs, setDocs] = useState(null);
  useEffect(() => {
    fetchAll().then(setDocs).catch(() => setDocs([]));
  }, []);

  if (docs === null) return <p>Cargando…</p>;
  if (docs.length === 0) return <p>No hay documentos.</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Título</th><th>Fecha</th><th>Códigos</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {docs.map(d => {
          const codes = Array.isArray(d.codigos) ? d.codigos : [];
          return (
            <tr key={d.id}>
              <td>{d.titulo}</td>
              <td>{new Date(d.fecha).toLocaleDateString()}</td>
              <td>
                <ul>
                  {codes.map((c,i)=><li key={i}>{c}</li>)}
                </ul>
              </td>
              <td>
                <button className="mr-2">Ver</button>
                <button className="mr-2">Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
