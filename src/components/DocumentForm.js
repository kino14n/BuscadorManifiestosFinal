import React, { useState, useRef, useEffect } from 'react';
import { saveDocument, getDocumentById, deleteDocuments } from '../utils/storage';

const DocumentForm = ({ existingId, onSaved }) => {
  const existingDoc = existingId != null ? getDocumentById(existingId) : null;
  const [name, setName] = useState(existingDoc?.name || '');
  const [date, setDate] = useState(existingDoc?.date || '');
  const [codes, setCodes] = useState(existingDoc?.codes.join('\n') || '');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // cuando cambie existingId recargamos el formulario
    if (existingDoc) {
      setName(existingDoc.name);
      setDate(existingDoc.date);
      setCodes(existingDoc.codes.join('\n'));
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [existingId]);

  const handleSubmit = e => {
    e.preventDefault();
    const doc = {
      id: existingDoc?.id || Date.now(),
      name,
      date,
      codes: codes.split('\n').map(c => c.trim()).filter(Boolean),
      fileName: file?.name || existingDoc?.fileName || '',
      fileData: file ? URL.createObjectURL(file) : existingDoc?.fileData || ''
    };
    saveDocument(doc);
    setSuccess(true);
    if (!existingDoc) {
      setName(''); setDate(''); setCodes(''); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    onSaved?.();
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleDelete = () => {
    if (existingDoc && window.confirm('¿Eliminar este documento?')) {
      deleteDocuments([existingDoc.id]);
      onSaved?.();
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {existingDoc ? 'Editar Documento' : 'Subir Documento'}
      </h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          Documento {existingDoc ? 'actualizado' : 'guardado'} con éxito.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            type="text" value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Fecha</label>
          <input
            type="date" value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded" required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Archivo PDF</label>
          <input
            type="file" ref={fileInputRef}
            accept=".pdf" onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required={!existingDoc}
          />
          {existingDoc?.fileName && !file && (
            <p className="text-sm text-gray-600 mt-1">
              Archivo actual: {existingDoc.fileName}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Códigos (uno por línea)</label>
          <textarea
            value={codes} onChange={e => setCodes(e.target.value)}
            className="w-full p-2 border rounded h-32" required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {existingDoc ? 'Actualizar' : 'Guardar'}
          </button>
          {existingDoc && (
            <button
              type="button" onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
