import React, { useState, useRef } from 'react';

export default function DocumentForm({ existing, onSave }) {
  const [name, setName] = useState(existing?.name || '');
  const [date, setDate] = useState(existing?.fecha?.slice(0,10) || '');
  const [codes, setCodes] = useState(existing?.codes?.join('\n') || '');
  const [file, setFile] = useState(null);
  const ref = useRef();

  const handle = e => {
    e.preventDefault();
    const doc = {
      id: existing?.id,
      name,
      date,
      codes: codes.split('\n').filter(c=>c),
      fileName: file?.name || existing?.file_name,
      fileData: file
        ? URL.createObjectURL(file)
        : existing?.file_data,
    };
    onSave(doc, !existing);
  };

  return (
    <form onSubmit={handle} className="p-6 bg-white rounded shadow">
      {/* …inputs para name, date, file, codes… */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {existing ? 'Actualizar' : 'Guardar'}
      </button>
    </form>
  );
}
