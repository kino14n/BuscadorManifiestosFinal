import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import DocumentList from './DocumentList.js';
import SearchForm from './SearchForm.js';

export default function Tabs() {
  const [tab, setTab] = useState('search');
  const [editing, setEditing] = useState(null);

  const handleView = ids => {
    ids.forEach(id => {
      const win = window.open('', '_blank');
      // ideal: fetch el documento y mostrar en iframe
      // por simplicidad: no implementado aquí.
    });
  };
  const handlePrint = ids => console.log('print', ids);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b mb-4">
        {['search','upload','consult'].map(t=>(
          <button
            key={t}
            onClick={()=>{ setTab(t); setEditing(null); }}
            className={`px-4 py-2 ${tab===t?'border-b-2 border-blue-500 text-blue-500':'text-gray-500'}`}>
            {t==='search'? 'Buscar Documentos' : t==='upload'? 'Subir Documento' : 'Consultar Documentos'}
          </button>
        ))}
      </div>

      {tab==='search' && <SearchForm onView={handleView} onPrint={handlePrint} />}
      {tab==='upload' && <DocumentForm onSave={()=>setTab('consult')} />}
      {tab==='consult' && (
        <DocumentList
          onView={handleView}
          onPrint={handlePrint}
          onEdit={doc => { setEditing(doc); setTab('upload'); }}
        />
      )}

      {/* editar en mismo formulario */}
      {editing && tab==='upload' && (
        <DocumentForm existingDoc={editing} onSave={()=>setTab('consult')} />
      )}
    </div>
  );
}
