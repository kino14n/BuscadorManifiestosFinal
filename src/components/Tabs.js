// src/components/Tabs.js

import React, { useState, useEffect } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import {
  getDocuments,
  getDocumentById,
  deleteDocument
} from '../utils/storage.js';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('search');
  const [docs, setDocs] = useState([]);
  const [editDoc, setEditDoc] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  useEffect(() => {
    if (activeTab === 'list') {
      setDocs(getDocuments());
    }
  }, [activeTab]);

  const handleView = (ids) => {
    if (ids.length === 1) {
      const d = getDocumentById(ids[0]);
      if (d?.fileData) {
        setCurrentPdf(d.fileData);
        setPdfOpen(true);
      }
    } else {
      ids.forEach(id => {
        const d = getDocumentById(id);
        if (d?.fileData) window.open(d.fileData, '_blank');
      });
    }
  };

  const handlePrint = (ids) => {
    ids.forEach(id => {
      const d = getDocumentById(id);
      if (d?.fileData) {
        const w = window.open(d.fileData, '_blank');
        w.onload = () => w.print();
      }
    });
  };

  const handleDelete = (ids) => {
    ids.forEach(id => deleteDocument(id));
    setDocs(getDocuments());
  };

  const handleEdit = (id) => {
    setEditDoc(getDocumentById(id));
    setActiveTab('upload');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {pdfOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl h-full flex flex-col rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between border-b">
              <h3 className="text-lg font-medium">Vista PDF</h3>
              <button onClick={() => setPdfOpen(false)}>Cerrar</button>
            </div>
            <iframe
              src={currentPdf}
              className="flex-1"
              title="PDF"
            />
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-2 rounded">
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b">
        {['search','upload','list'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if(tab==='upload') setEditDoc(null); }}
            className={`py-2 px-4 ${
              activeTab===tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            {{
              search: 'Buscar Documentos',
              upload: 'Subir Documento',
              list:   'Consultar Documentos'
            }[tab]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'search' && <SearchForm onView={handleView} onPrint={handlePrint} />}
        {activeTab === 'upload' && (
          <DocumentForm
            existingDoc={editDoc}
            onSave={() => setActiveTab('list')}
          />
        )}
        {activeTab === 'list' && (
          <DocumentList
            documentos={docs}
            onView={handleView}
            onPrint={handlePrint}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
