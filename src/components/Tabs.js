import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { getDocumentById } from '../utils/storage.js';

const Tabs = () => {
  const [tab, setTab] = useState('search');
  const [editId, setEditId] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfSrc, setPdfSrc] = useState('');

  const viewPdf = ids => {
    if (ids.length === 1) {
      const d = getDocumentById(ids[0]);
      if (d?.fileData) {
        setPdfSrc(d.fileData);
        setPdfOpen(true);
      }
    } else {
      ids.forEach(id => {
        const d = getDocumentById(id);
        d?.fileData && window.open(d.fileData, '_blank');
      });
    }
  };

  const printPdf = ids => {
    ids.forEach(id => {
      const d = getDocumentById(id);
      if (d?.fileData) {
        const w = window.open(d.fileData, '_blank');
        w.onload = () => w.print();
      }
    });
  };

  const closePdf = () => { setPdfOpen(false); setPdfSrc(''); };
  const afterSave = () => { setTab('list'); setEditId(null); };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {pdfOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between p-4 border-b">
              <h3>Vista PDF</h3>
              <button onClick={closePdf} className="text-gray-600">Cerrar</button>
            </div>
            <iframe src={pdfSrc} className="flex-1" />
          </div>
        </div>
      )}

      <nav className="flex border-b mb-6">
        {['search','upload','list'].map(id => (
          <button
            key={id}
            onClick={() => { setTab(id); setEditId(null); }}
            className={`py-2 px-4 ${tab===id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            {id==='search' ? 'Buscar' : id==='upload' ? 'Subir' : 'Consultar'}
          </button>
        ))}
      </nav>

      {tab==='search' && <SearchForm onView={viewPdf} onPrint={printPdf} />}
      {tab==='upload' && <DocumentForm onSaved={afterSave} />}
      {tab==='list' && (
        <DocumentList
          onView={viewPdf}
          onPrint={printPdf}
          onEdit={id => { setEditId(id); setTab('upload'); }}
        />
      )}
      {tab==='upload' && editId != null && (
        <DocumentForm existingId={editId} onSaved={afterSave} />
      )}
    </div>
  );
};

export default Tabs;
// ...
{activeTab === 'list' && (
  <DocumentList
    onView={handleViewPdf}
    onPrint={handlePrintPdf}
  />
)}
// ...