// src/components/Tabs.js
import React, { useState } from 'react';
import DocumentForm from './DocumentForm';
import SearchForm from './SearchForm';
import DocumentList from './DocumentList';
import {
  getDocumentById,
  deleteDocuments
} from '../utils/storage';

export default function Tabs() {
  // 1) pestaña activa
  const [activeTab, setActiveTab] = useState('search');
  // 2) documento que estamos editando (o null)
  const [editingDoc, setEditingDoc] = useState(null);
  // 3) PDF viewer
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  // ver uno o varios PDFs
  const handleView = (ids) => {
    if (ids.length === 1) {
      const doc = getDocumentById(ids[0]);
      if (doc?.fileData) {
        setCurrentPdf(doc.fileData);
        setPdfViewerOpen(true);
      }
    } else {
      ids.forEach(id => {
        const doc = getDocumentById(id);
        if (doc?.fileData) window.open(doc.fileData, '_blank');
      });
    }
  };

  // imprimir uno o varios
  const handlePrint = (ids) => {
    ids.forEach(id => {
      const doc = getDocumentById(id);
      if (doc?.fileData) {
        const w = window.open(doc.fileData, '_blank');
        w.onload = () => w.print();
      }
    });
  };

  // eliminar varios
  const handleDelete = (ids) => {
    deleteDocuments(ids);
    // opcional: aquí podrías forzar un refresh recargando la lista
  };

  // editar uno (envía a la pestaña "upload")
  const handleEdit = (id) => {
    const doc = getDocumentById(id);
    setEditingDoc(doc);
    setActiveTab('upload');
  };

  // al guardar en DocumentForm, vuelvo a "list" y limpio editingDoc
  const handleSaved = () => {
    setActiveTab('list');
    setEditingDoc(null);
  };

  const handleClosePdf = () => {
    setPdfViewerOpen(false);
    setCurrentPdf(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* visor PDF */}
      {pdfViewerOpen && currentPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
            <div className="p-4 border-b flex justify-between">
              <h3 className="text-lg font-medium">Vista previa del PDF</h3>
              <button onClick={handleClosePdf} className="text-gray-600">Cerrar</button>
            </div>
            <iframe
              src={currentPdf}
              className="flex-1"
              frameBorder="0"
              title="PDF Viewer"
            />
            <div className="p-4 border-t text-right">
              <button
                onClick={() => window.print()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* tabs */}
      <div className="flex border-b">
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
            setActiveTab('upload');
            setEditingDoc(null);
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

      <div className="mt-6">
        {activeTab === 'search' && (
          <SearchForm onView={handleView} onPrint={handlePrint} />
        )}
        {activeTab === 'upload' && (
          <DocumentForm existingDoc={editingDoc} onSave={handleSaved} />
        )}
        {activeTab === 'list' && (
          <DocumentList
            documentos={getDocuments()}
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
