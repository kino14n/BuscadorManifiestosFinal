import React, { useState, useEffect } from 'react';
import { getDocuments, updateDocumentCodes, deleteDocuments } from '../utils/storage.js';
import DocumentForm from './DocumentForm.js';

const DocumentList = ({ onView, onPrint }) => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null); // Usamos solo el ID
  const [editingCodes, setEditingCodes] = useState(false);
  const [tempCodes, setTempCodes] = useState('');
  const [editingDoc, setEditingDoc] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const docs = getDocuments();
    setAllDocuments(docs);
    setFilteredDocuments(docs);
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = allDocuments.filter(doc =>
      doc.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, allDocuments]);

  const refreshDocuments = () => {
    const docs = getDocuments();
    setAllDocuments(docs);
    setFilteredDocuments(docs);
  };

  const handleView = (docId) => {
    setSelectedDocId(selectedDocId === docId ? null : docId); // Toggle visibility
    setEditingCodes(false);
    setEditingDoc(null);
  };

  const handleEditCodes = (doc) => {
    setTempCodes(doc.codes.join('\n'));
    setEditingCodes(doc.id); // Usamos el ID para saber qué documento estamos editando
  };

  const handleSaveCodes = (docId) => {
    const docToUpdate = allDocuments.find(doc => doc.id === docId);
    if (!docToUpdate) return;

    const newCodes = tempCodes.split('\n').filter(code => code.trim() !== '');
    if (updateDocumentCodes(docId, newCodes)) {
      refreshDocuments();
      setEditingCodes(false);
      // Si el documento editado es el que está visible, actualizar su vista
      if (selectedDocId === docId) {
        setSelectedDocId(null); // Ocultar y volver a mostrar para refrescar
        setTimeout(() => setSelectedDocId(docId), 0);
      }
    }
  };

  const handleEditDocument = (doc) => {
    setEditingDoc(doc);
    setSelectedDocId(null); // Ocultar detalles al editar
  };

  const handleSaveDocument = () => {
    refreshDocuments();
    setEditingDoc(null);
    // Si el documento editado era el visible, volver a mostrarlo
    if (selectedDocId && !editingDoc) { // Check if editingDoc was set before saving
       const updatedDoc = getDocuments().find(d => d.id === selectedDocId);
       if(updatedDoc) setSelectedDocId(updatedDoc.id);
    }
  };


  const toggleSelectDoc = (docId) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const handleDeleteSelected = () => {
    if (deleteDocuments(Array.from(selectedDocs))) {
      refreshDocuments();
      setSelectedDocs(new Set());
      if (selectedDocId && selectedDocs.has(selectedDocId)) {
        setSelectedDocId(null);
      }
      setShowDeleteConfirm(false);
    }
  };

  const handleViewSelected = () => {
    if (onView) {
      onView(Array.from(selectedDocs));
    }
  };

  const handlePrintSelected = () => {
    if (onPrint) {
      onPrint(Array.from(selectedDocs));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Consultar Documentos</h2>
      
      {editingDoc ? (
        <DocumentForm existingDoc={editingDoc} onSave={handleSaveDocument} />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Lista de Documentos</h3>
              {selectedDocs.size > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar ({selectedDocs.size})
                  </button>
                  <button
                    onClick={handleViewSelected}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Ver ({selectedDocs.size})
                  </button>
                  <button
                    onClick={handlePrintSelected}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Imprimir ({selectedDocs.size})
                  </button>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre de documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {filteredDocuments.length > 0 ? (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded"> {/* Contenedor para cada documento */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(doc.id)}
                          onChange={() => toggleSelectDoc(doc.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.date}</p>
                          {doc.fileName && <p className="text-xs text-gray-500">Archivo: {doc.fileName}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc.id)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          {selectedDocId === doc.id ? 'Ocultar Códigos' : 'Ver Códigos'}
                        </button>
                        <button
                          onClick={() => handleEditDocument(doc)}
                          className="text-green-500 hover:text-green-700 text-sm"
                        >
                          Editar
                        </button>
                      </div>
                    </div>

                    {selectedDocId === doc.id && ( // Mostrar códigos solo si este documento está seleccionado
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Códigos:</span>
                          {editingCodes === doc.id ? (
                            <button
                              onClick={() => handleSaveCodes(doc.id)}
                              className="text-green-500 hover:text-green-700 text-sm"
                            >
                              Guardar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditCodes(doc)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                        
                        {editingCodes === doc.id ? (
                          <textarea
                            value={tempCodes}
                            onChange={(e) => setTempCodes(e.target.value)}
                            className="w-full p-2 border rounded h-40"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {doc.codes.map((code) => (
                              <span key={code} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {code}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay documentos guardados o no coinciden con la búsqueda.</p>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Confirmar eliminación</h3>
                <p className="mb-4">¿Estás seguro que deseas eliminar los {selectedDocs.size} documentos seleccionados?</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentList;

// DONE