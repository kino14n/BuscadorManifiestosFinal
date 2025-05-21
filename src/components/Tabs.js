import React, { useState, useEffect } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { getDocumentById, getDocuments } from '../utils/storage.js';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('search');
  const [documents, setDocuments] = useState([]);
  const [editDoc, setEditDoc] = useState(null);

  // PDF-viewer states (igual que antes)...
  const [pdfOpen, setPdfOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  // Cuando entremos a “list”, recargamos todo
  useEffect(() => {
    if (activeTab === 'list') {
      setDocuments(getDocuments());
    }
  }, [activeTab]);

  const handleViewPdf = (ids) => {
    // ... tu código de abrir PDF ...
  };

  const handlePrintPdf = (ids) => {
    // ... tu código de imprimir PDF ...
  };

  // ** NUEVOS **
  const handleShowCodes = (id) => {
    const doc = getDocumentById(id);
    alert(`Códigos: ${doc.codes.join(', ')}`);
  };
  const handleEdit = (id) => {
    const doc = getDocumentById(id);
    setEditDoc(doc);
    setActiveTab('upload');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* == tu modal PDF igual que antes == */}

      {/* == Tabs de navegación == */}
      <div className="flex border-b">
        {[
          ['search',  'Buscar Documentos'],
          ['upload',  'Subir Documento'],
          ['list',    'Consultar Documentos'],
        ].map(([id,label]) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (id === 'upload') setEditDoc(null); 
            }}
            className={`py-2 px-4 font-medium ${
              activeTab===id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'search' && (
          <SearchForm onView={handleViewPdf} onPrint={handlePrintPdf} />
        )}
        {activeTab === 'upload' && (
          <DocumentForm
            existingDoc={editDoc}
            onSave={() => setActiveTab('list')}
          />
        )}
        {activeTab === 'list' && (
          <DocumentList
            documentos={documents}
            onShowCodes={handleShowCodes}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
