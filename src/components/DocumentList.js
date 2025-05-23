// src/components/DocumentList.js
import React from 'react';

/**
 * Lista de documentos.
 * @param {Object[]} documents  — arreglo de documentos
 * @param {Function} onView    — callback(id) al presionar “Ver”
 * @param {Function} onEdit    — callback(id) al presionar “Editar”
 * @param {Function} onDelete  — callback(id) al presionar “Eliminar”
 */
export default function DocumentList({ documents, onView, onEdit, onDelete }) {
  // Mientras no sea un arreglo, mostramos “Cargando…”
  if (!Array.isArray(documents)) {
    return <p className="p-4">Cargando documentos…</p>;
  }

  if (documents.length === 0) {
    return <p className="p-4">No hay documentos registrados.</p>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Códigos</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {documents.map(doc => (
          <tr key={doc.id}>
            <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.fecha).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap">{doc.titulo}</td>
            <td className="px-6 py-4">
              <ul className="list-disc list-inside">
                {Array.isArray(doc.codigos)
                  ? doc.codigos.map((c, i) => <li key={i}>{c}</li>)
                  : null}
              </ul>
            </td>
            <td className="px-6 py-4 whitespace-nowrap space-x-2">
              <button onClick={() => onView(doc.id)} className="text-blue-600 hover:underline">Ver</button>
              <button onClick={() => onEdit(doc.id)} className="text-green-600 hover:underline">Editar</button>
              <button onClick={() => onDelete(doc.id)} className="text-red-600 hover:underline">Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
