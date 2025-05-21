import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { getDocumentById } from '../utils/storage.js';

export default function Tabs() {
  const [tab, setTab] = useState('search');
  const [viewer, setViewer] = useState({ open:false, pdf:null });

  const handleView = async ids => {
    if (ids.length===1) {
      const doc = await getDocumentById(ids[0]);
      if (doc.archivo_url) setViewer({ open:true, pdf:doc.archivo_url });
    } else {
      ids.forEach(async id => {
        const d = await getDocumentById(id);
        d.archivo_url && window.open(d.archivo_url,'_blank');
      });
    }
  };

  const handlePrint = async ids => {
    ids.forEach(async id => {
      const d = await getDocumentById(id);
      if (d.archivo_url) {
        const w = window.open(d.archivo_url,'_blank');
        w.onload = ()=>w.print();
      }
    });
  };

  const closeViewer = ()=>setViewer({ open:false, pdf:null });

  return (
    <div className="max-w-4xl mx-auto">
      {viewer.open && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white w-3/4 h-3/4 p-4 rounded-lg flex flex-col">
            <div className="flex justify-between">
              <h3>Vista previa</h3>
              <button onClick={closeViewer}>Cerrar</button>
            </div>
            <iframe src={viewer.pdf} className="flex-1 mt-2" />
          </div>
        </div>
      )}
      <div className="flex border-b mb-4">
        {['search','upload','list'].map(t=>(
          <button
            key={t}
            onClick={()=>setTab(t)}
            className={`py-2 px-4 ${tab===t?'border-b-2 border-blue-500 text-blue-500':'text-gray-600'}`}
          >
            { t==='search'? 'Buscar Documentos' : t==='upload'? 'Subir Documento' : 'Consultar Documentos' }
          </button>
        ))}
      </div>
      {tab==='search' && <SearchForm onView={handleView} onPrint={handlePrint} />}
      {tab==='upload' && <DocumentForm onSave={()=>setTab('list')} />}
      {tab==='list' && <DocumentList onView={handleView} onPrint={handlePrint} />}
    </div>
  );
}
