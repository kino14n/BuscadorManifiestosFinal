// src/components/DocumentForm.js
import React, { useState, useRef } from 'react';
import { saveDocument, fetchDocumentById } from '../utils/api.js';

export default function DocumentForm({ onSave }) {
  const [existing, setExisting] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [codes, setCodes] = useState('');
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  // si edit: carga un manifiesto
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('id')) {
      fetchDocumentById(params.get('id')).then(doc => {
        setExisting(doc);
        setName(doc.nombre);
        setDate(doc.fecha);
        setCodes(doc.codigos.join('\n'));
      });
    }
  }, []);

  const handle = async e => {
    e.preventDefault();
    const doc = {
      id: existing?.id,
      name,
      date,
      codes: codes.split('\n').filter(c=>c),
      fileName: file?.name || existing?.archivo_nombre,
      fileData: file ? URL.createObjectURL(file) : existing?.archivo_datos
    };
    await saveDocument(doc);
    setSuccess(true);
    if (!existing) {
      setName(''); setDate(''); setCodes(''); setFile(null);
      fileRef.current.value = '';
    }
    onSave?.();
    setTimeout(()=>setSuccess(false),3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {existing ? 'Editar Documento' : 'Subir Documento'}
      </h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Documento {existing ? 'actualizado' : 'creado'} exitosamente!
        </div>
      )}
      <form onSubmit={handle}>
        {/* name, date, file, codes fields (igual a localstorage versión) */}
        {/* ... */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          {existing ? 'Actualizar' : 'Guardar Documento'}
        </button>
      </form>
    </div>
  );
}
