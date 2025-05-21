import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import {
  getDocuments,
  getDocumentById,
  deleteDocuments
} from '../utils/storage.js';

export default function Tabs() {
  const [tab, setTab] = useState('search');
  const [docs, setDocs] = useState(getDocuments());
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const refresh = () => setDocs(getDocuments());

  const handleView = ids => {
    if (ids.length === 1) {
      const d = getDocumentById(ids[0]);
      if (d?.fileData) {
        setPdfUrl(d.fileData);
        setOpenPdf(true);
      }
    } else ids.forEach(i=>window.open(getDocumentById(i).fileData,'_blank'));
  };

  const handlePrint = ids => {
    ids.forEach(i=>{
      const w = window.open(getDocumentById(i).fileData,'_blank');
      w.onload = ()=>w.print();
    });
  };

  const handleEdit = id => {
    setTab('upload');
    // pasar existingDoc a Form via props (se podría ampliar)
    // ↓ ejemplo simple:
    // <DocumentForm existingDoc={getDocumentById(id)} onSave={refresh} />
  };

  const handleDelete = (checked, id) => {
    if (checked) deleteDocuments([id]);
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {openPdf && (
        <div /* modal PDF aquí (igual que antes) */>…</div>
      )}
      <div className="flex border-b">
        {['search','upload','list'].map(v=>(
          <button key={v}
            onClick={()=>setTab(v)}
            className={`flex-1 py-2 ${tab===v?'border-b-2 text-blue-600':''}`}>
            {v==='search'?'Buscar':v==='upload'?'Subir':'Consultar'}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab==='search' && <SearchForm onView={handleView} onPrint={handlePrint} />}
        {tab==='upload' && <DocumentForm onSave={refresh} />}
        {tab==='list' && (
          <DocumentList
            documentos={docs}
            onView={handleView}
            onPrint={handlePrint}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
