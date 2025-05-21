import React, { useState, useRef } from 'react';
import { createDocument, updateDocument } from '../utils/storage.js';

export default function DocumentForm({ onSave, existingDoc }) {
  const [name, setName] = useState(existingDoc?.nombre||'');
  const [date, setDate] = useState(existingDoc?.fecha||'');
  const [codes, setCodes] = useState((existingDoc?.codigos||[]).join('\n'));
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    const doc = {
      id: existingDoc?.id,
      name,
      date,
      codes: codes.split('\n').filter(c=>c.trim()),
      fileName: file?.name || existingDoc?.archivo_nombre,
      fileData: file ? URL.createObjectURL(file) : existingDoc?.archivo_url
    };
    if (existingDoc) await updateDocument({
      ...doc,
      nombre: doc.name,
      fecha: doc.date,
      codigos: doc.codes,
      archivo_nombre: doc.fileName,
      archivo_url: doc.fileData
    });
    else await createDocument({
      nombre: doc.name,
      fecha: doc.date,
      codigos: doc.codes,
      archivo_nombre: doc.fileName,
      archivo_url: doc.fileData
    });
    onSave();
    setName(''); setDate(''); setCodes(''); setFile(null);
    fileRef.current && (fileRef.current.value = '');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {existingDoc?'Editar Documento':'Subir Documento'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* nombre */}
        <div className="mb-4">
          <label>Nombre</label>
          <input
            required
            className="w-full border p-2"
            value={name} onChange={e=>setName(e.target.value)}
          />
        </div>
        {/* fecha */}
        <div className="mb-4">
          <label>Fecha</label>
          <input
            type="date"
            required
            className="w-full border p-2"
            value={date} onChange={e=>setDate(e.target.value)}
          />
        </div>
        {/* archivo */}
        <div className="mb-4">
          <label>PDF</label>
          <input
            required={!existingDoc}
            type="file" ref={fileRef}
            accept=".pdf"
            onChange={e=>setFile(e.target.files[0])}
          />
        </div>
        {/* códigos */}
        <div className="mb-4">
          <label>Códigos (uno por línea)</label>
          <textarea
            required
            className="w-full border p-2 h-32"
            value={codes} onChange={e=>setCodes(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {existingDoc?'Actualizar':'Guardar'}
        </button>
      </form>
    </div>
  );
}
