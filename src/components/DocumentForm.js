import React, { useState, useRef } from 'react';
import { saveDocument } from '../utils/storage';

const DocumentForm = ({ onSave, existingDoc }) => {
  const [name, setName] = useState(existingDoc?.name || '');
  const [date, setDate] = useState(existingDoc?.date || '');
  const [codes, setCodes] = useState(existingDoc?.codes.join('\n') || '');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const document = {
      id: existingDoc?.id || Date.now(),
      name,
      date,
      codes: codes.split('\n').filter(code => code.trim() !== ''),
      fileName: file ? file.name : existingDoc?.fileName || null,
      fileData: file ? URL.createObjectURL(file) : existingDoc?.fileData || null
    };
    
    saveDocument(document);
    setSuccess(true);
    
    if (!existingDoc) {
      setName('');
      setDate('');
      setCodes('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    
    if (onSave) onSave();
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {existingDoc ? 'Editar Documento' : 'Subir Documento'}
      </h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Documento {existingDoc ? 'actualizado' : 'guardado'} exitosamente!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre del documento</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha del documento</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Archivo PDF</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full p-2 border rounded"
            required={!existingDoc}
          />
          {existingDoc?.fileName && !file && (
            <p className="text-sm text-gray-500 mt-1">
              Archivo actual: {existingDoc.fileName}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Códigos (uno por línea)</label>
          <textarea
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Pega aquí los códigos, uno por línea"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {existingDoc ? 'Actualizar Documento' : 'Guardar Documento'}
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;
// src/components/DocumentList.js
import React from 'react';

export default function DocumentList({ documentos }) {
  if (!documentos.length) return <p>No hay manifiestos.</p>;
  return (
    <ul>
      {documentos.map(doc => (
        <li key={doc.id}>{doc.titulo}</li>
      ))}
    </ul>
  );
}
