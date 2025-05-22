// src/components/Tabs.js
import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';
import { fetchDocuments } from '../utils/api.js';

export default function Tabs() {
  const [tab, setTab] = useState('consultar');
  const [docs, setDocs] = useState([]);

  const reload = () => fetchDocuments().then(setDocs);

  React.useEffect(reload, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b mb-4">
        {['buscar','subir','consultar'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 px-4 font-medium ${tab===t ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            {t==='buscar' ? 'Buscar Documentos' : t==='subir' ? 'Subir Documento' : 'Consultar Documentos'}
          </button>
        ))}
      </div>

      {tab==='buscar' && <SearchForm onView={reload} />}
      {tab==='subir' && <DocumentForm onSave={reload} />}
      {tab==='consultar' && <DocumentList documentos={docs} onAction={reload} />}
    </div>
  );
}
