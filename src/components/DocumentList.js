import React from 'react';

export default function DocumentList({ documentos }) {
  if (!documentos || documentos.length === 0) {
    return <p>No hay manifiestos aún.</p>;
  }
  return (
    <ul className="space-y-2">
      {documentos.map((doc) => (
        <li key={doc.id} className="border p-4 rounded">
          <h3 className="font-bold">{doc.name || doc.titulo}</h3>
          <p className="text-gray-700">{doc.date}</p>
          <p className="mt-2">{(doc.codes || []).join(', ')}</p>
          {doc.fileName && (
            <a
              href={doc.fileData}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Ver PDF
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
