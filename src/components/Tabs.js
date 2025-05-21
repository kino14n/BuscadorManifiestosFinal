// src/components/Tabs.js
import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { getDocumentById, deleteDocuments } from '../utils/storage.js';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [editDoc, setEditDoc] = useState(null);

  // vista previa/imprimir
  const handleViewPdf = (ids) => {
    ids.forEach((id) => {
      const doc = getDocumentById(id);
      if (doc?.fileData) {
        window.open(doc.fileData, '_blank');
      }
    });
  };
  const handlePrintPdf = (ids) => {
    ids.forEach((id) => {
      const doc = getDocumentById(id);
      if (doc?.fileData) {
        const w = window.open(doc.fileData, '_blank');
        w.onload = () => w.print();
      }
    });
  };

  // editar
  const handleEdit = (ids) => {
    if (ids.length === 1) {
      const doc = getDocumentById(ids[0]);
      setEditDoc(doc);
      setActiveTab('upload');
    }
  };

  // eliminar
  const handleDelete = (ids) => {
    deleteDocuments(ids);
    // forzar refresco:
    setActiveTab('list');
  };

  const handleFormSave = () => {
    setEditDoc(null);
    setActiveTab('list');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('search')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'search'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Buscar Documentos
        </button>
        <button
          onClick={() => {
            setEditDoc(null);
            setActiveTab('upload');
          }}
          className={`py-2 px-4 font-medium ${
            activeTab === 'upload'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Subir Documento
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'list'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Consultar Documentos
        </button>
      </div>

      <div>
        {activeTab === 'search' && (
          <SearchForm onView={handleViewPdf} onPrint={handlePrintPdf} />
        )}
        {activeTab === 'upload' && (
          <DocumentForm existingDoc={editDoc} onSave={handleFormSave} />
        )}
        {activeTab === 'list' && (
          <DocumentList
            documentos={getDocumentById() /* o pasa tu estado de docs */}
            onView={handleViewPdf}
            onPrint={handlePrintPdf}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
