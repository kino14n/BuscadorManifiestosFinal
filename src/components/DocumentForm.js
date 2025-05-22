import React, { useState, useRef } from 'react';
import { createDocument, updateCodes } from '../utils/api.js';

export default function DocumentForm({ existingDoc, onSave }) {
  const [name, setName] = useState(existingDoc?.name || '');
  const [date, setDate] = useState(existingDoc?.date || '');
  const [codes, setCodes] = useState(existingDoc?.codes.join('\n') || '');
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // para simplificar, aquí tomamos fileData como URL.createObjectURL
    const doc = {
      name,
      date,
      fileData: file ? URL.createObjectURL(file) : existingDoc.fileData,
      codes: codes.split('\n').filter(c => c.trim())
    };
    if (existingDoc) {
      await updateCodes(existingDoc.id, doc.codes);
    } else {
      await createDocument(doc);
    }
    setName(''); setDate(''); setCodes(''); setFile(null);
    if (fileRef.current) fileRef.current.value = '';
    onSave && onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">{existingDoc ? 'Editar' : 'Subir'} Documento</h2>
      {/* nombre, fecha, file */}
      <div className="mb-3">
        <label>Nombre</label>
        <input required value={name} onChange={e=>setName(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>
      <div className="mb-3">
        <label>Fecha</label>
        <input type="date" required value={date} onChange={e=>setDate(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>
      {!existingDoc && (
        <div className="mb-3">
          <label>PDF</label>
          <input type="file" accept=".pdf" ref={fileRef}
            onChange={e=>setFile(e.target.files[0])}
            className="w-full" required />
        </div>
      )}
      <div className="mb-3">
        <label>Códigos (uno por línea)</label>
        <textarea required value={codes} onChange={e=>setCodes(e.target.value)}
          className="w-full p-2 border rounded h-32" />
      </div>
      <button type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded">
        {existingDoc ? 'Actualizar' : 'Guardar'}
      </button>
    </form>
  );
}
