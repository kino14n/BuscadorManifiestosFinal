import React from 'react';
import SearchForm from './SearchForm.js';
import DocumentForm from './DocumentForm.js';
import DocumentList from './DocumentList.js';

export default function Tabs({ active, onChange }) {
  return (
    <div>
      <nav className="flex space-x-4 mb-6">
        <button onClick={() => onChange('buscar')} className={active==='buscar' ? 'font-bold' : ''}>Buscar Documentos</button>
        <button onClick={() => onChange('subir')} className={active==='subir' ? 'font-bold' : ''}>Subir Documento</button>
        <button onClick={() => onChange('consultar')} className={active==='consultar' ? 'font-bold' : ''}>Consultar Documentos</button>
      </nav>
      <div>
        {active === 'buscar' && <SearchForm />}
        {active === 'subir' && <DocumentForm />}
        {active === 'consultar' && <DocumentList />}
      </div>
    </div>
  );
}
