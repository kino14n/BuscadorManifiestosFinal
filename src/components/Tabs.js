import React, { useState, useEffect } from 'react';
import DocumentForm from './DocumentForm.js';
import DocumentList from './DocumentList.js';
import SearchForm from './SearchForm.js';
import {
  fetchManifiestos,
  createManifiesto,
  updateManifiesto,
  deleteManifiestos,
} from '../services/api.js';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('search');
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState([]);

  // cargar lista
  useEffect(() => {
    if (activeTab === 'list') load();
  }, [activeTab]);

  const load = async () => {
    const data = await fetchManifiestos();
    setDocs(data);
    setSelected([]);
  };

  const onSave = async (doc, isNew) => {
    if (isNew) await createManifiesto(doc);
    else await updateManifiesto(doc.id, doc);
    load();
    setActiveTab('list');
  };

  const onDelete = async () => {
    await deleteManifiestos(selected);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b">
        {['search','upload','list'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${activeTab===tab?'border-b-2 border-blue-500 text-blue-500':'text-gray-500'}`}
          >
            {tab==='search'? 'Buscar Documentos' : tab==='upload'? 'Subir Documento' : 'Consultar Documentos'}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === 'search' && <SearchForm />}
        {activeTab === 'upload' && <DocumentForm onSave={d=>onSave(d,true)} />}
        {activeTab === 'list' && (
          <DocumentList
            documentos={docs}
            selected={selected}
            onSelect={setSelected}
            onView={ids=>window.open(docs.find(d=>d.id===ids[0]).file_data,'_blank')}
            onPrint={ids=>ids.forEach(id=>window.open(docs.find(d=>d.id===id).file_data).print())}
            onEdit={doc=>setActiveTab('upload') || setTimeout(()=>onSave(doc,false),0)}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
