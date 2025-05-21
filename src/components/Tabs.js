import React, { useState, useEffect } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
-import { getDocumentById, getDocuments } from '../utils/storage.js';
+import { getDocumentById, getDocuments, deleteDocument } from '../utils/storage.js';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('search');
  const [documents, setDocuments] = useState([]);
  const [editDoc, setEditDoc] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  useEffect(() => {
    if (activeTab === 'list') {
      setDocuments(getDocuments());
    }
  }, [activeTab]);

  const handleViewPdf = (ids) => {
    if (ids.length === 1) {
      const doc = getDocumentById(ids[0]);
      if (doc?.fileData) {
        setCurrentPdf(doc.fileData);
        setPdfOpen(true);
      }
    } else {
      ids.forEach(id => {
        const doc = getDocumentById(id);
        if (doc?.fileData) window.open(doc.fileData, '_blank');
      });
    }
  };

  const handlePrintPdf = (ids) => {
    ids.forEach(id => {
      const doc = getDocumentById(id);
      if (doc?.fileData) {
        const w = window.open(doc.fileData, '_blank');
        w.onload = () => w.print();
      }
    });
  };

+ // Borra y recarga la lista
+ const handleDelete = (ids) => {
+   ids.forEach(id => deleteDocument(id));
+   setDocuments(getDocuments());
+ };

  const handleShowCodes = (id) => {
    const doc = getDocumentById(id);
    alert(`Códigos: ${doc.codes.join(', ')}`);
  };

  const handleEdit = (id) => {
    const doc = getDocumentById(id);
    setEditDoc(doc);
    setActiveTab('upload');
  };

  const handleClosePdf = () => {
    setPdfOpen(false);
    setCurrentPdf(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {pdfOpen && currentPdf && (
        /* ... tu modal PDF ... */
      )}

      <div className="flex border-b">
        {/* tus pestañas */}
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
            onDelete={handleDelete}
            onView={handleViewPdf}
            onPrint={handlePrintPdf}
            onShowCodes={handleShowCodes}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}
