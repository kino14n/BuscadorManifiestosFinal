import React, { useState, useRef } from 'react';
import { saveDocument } from '../utils/storage.js';

export default function DocumentForm({ onSave, existingDoc }) {
  const [name, setName] = useState(existingDoc?.name || '');
  const [date, setDate] = useState(existingDoc?.date || '');
  const [codes, setCodes] = useState(existingDoc?.codes.join('\n') || '');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    const doc = {
      id: existingDoc?.id || Date.now(),
      name,
      date,
      codes: codes.split('\n').map(c=>c.trim()).filter(c=>c),
      fileName: file?.name || existingDoc?.fileName || '',
      fileData: file ? URL.createObjectURL(file) : existingDoc?.fileData || ''
    };
    saveDocument(doc);
    setSuccess(true);
    if (!existingDoc) {
      setName(''); setDate(''); setCodes(''); setFile(null);
      fileRef.current.value = '';
    }
    onSave?.();
    setTimeout(()=>setSuccess(false),3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl mb-4">{existingDoc?'Editar Documento':'Subir Documento'}</h2>
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">¡Éxito!</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)}
            className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Fecha</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Archivo PDF</label>
          <input type="file" accept=".pdf" ref={fileRef}
            onChange={e=>setFile(e.target.files[0])}
            className="w-full p-2 border rounded"
            required={!existingDoc} />
          {existingDoc && !file && <p className="text-sm mt-1">Actual: {existingDoc.fileName}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Códigos (1 por línea)</label>
          <textarea value={codes} onChange={e=>setCodes(e.target.value)}
            className="w-full p-2 border rounded h-32" required />
        </div>
        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {existingDoc ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
