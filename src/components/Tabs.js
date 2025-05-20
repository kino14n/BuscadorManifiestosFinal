import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { getDocumentById } from '../utils/storage.js';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  const handleViewPdf = (docIds) => {
    if (docIds.length === 1) {
      const doc = getDocumentById(docIds[0]);
      if (doc?.fileData) {
        setCurrentPdf(doc.fileData);
        setPdfViewerOpen(true);
      }
    } else {
      // Lógica para manejar múltiples documentos
      alert(`Abriendo ${docIds.length} documentos en nuevas pestañas`);
      docIds.forEach(id => {
        const doc = getDocumentById(id);
        if (doc?.fileData) {
          window.open(doc.fileData, '_blank');
        }
      });
    }
  };

  const handlePrintPdf = (docIds) => {
    docIds.forEach(id => {
      const doc = getDocumentById(id);
      if (doc?.fileData) {
        const printWindow = window.open(doc.fileData, '_blank');
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    });
  };

  const handleClosePdf = () => {
    setPdfViewerOpen(false);
    setCurrentPdf(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {pdfViewerOpen && currentPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Vista previa del PDF</h3>
              <button
                onClick={handleClosePdf}
                className="text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1">
              <iframe 
                src={currentPdf} 
                className="w-full h-full" 
                frameBorder="0"
                title="PDF Viewer"
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => window.print()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('search')}
          className={`py-2 px-4 font-medium ${activeTab === 'search' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Buscar Documentos
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-4 font-medium ${activeTab === 'upload' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Subir Documento
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2 px-4 font-medium ${activeTab === 'list' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Consultar Documentos
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'search' && (
          <SearchForm 
            onView={handleViewPdf}
            onPrint={handlePrintPdf}
          />
        )}
        {activeTab === 'upload' && <DocumentForm />}
        {activeTab === 'list' && (
          <DocumentList 
            onView={handleViewPdf}
            onPrint={handlePrintPdf}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;

// DONE