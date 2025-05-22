import React, { useState, useRef } from 'react';
import { createDocument, updateDocument } from '../utils/api.js';

const DocumentForm = ({ onSave, existingDoc }) => {
  const [name, setName] = useState(existingDoc?.name || '');
  const [date, setDate] = useState(existingDoc?.fecha || '');
  const [codes, setCodes] = useState(existingDoc?.codes.join('\n') || '');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    const doc = {
      id: existingDoc?.id,
      name,
      date,
      codes: codes.split('\n').filter(c => c.trim()),
      fileName: file?.name || existingDoc?.filename,
      fileData: file ? URL.createObjectURL(file) : existingDoc?.filedata
    };
    if (existingDoc) await updateDocument(doc);
    else await createDocument(doc);
    setSuccess(true);
    if (!existingDoc) {
      setName(''); setDate(''); setCodes(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    }
    onSave && onSave();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {existingDoc ? 'Editar Documento' : 'Subir Documento'}
      </h2>
      {success && (
        <div className="p-2 mb-4 bg-green-100 text-green-700 rounded">
          {existingDoc ? 'Documento actualizado' : 'Documento guardado'} exitosamente!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* campos nombre, fecha, archivo, códigos */}
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">PDF</label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            className="w-full"
            {...(existingDoc ? {} : { required: true })}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Códigos (uno por línea)</label>
          <textarea
            value={codes}
            onChange={e => setCodes(e.target.value)}
            className="w-full border p-2 rounded h-32"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {existingDoc ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;
