import React, { useState } from 'react';
import SearchForm from './SearchForm.js';
import DocumentForm from './DocumentForm.js';
import DocumentList from './DocumentList.js';

export default function Tabs() {
  const [active, setActive] = useState('buscar');
  return (
    <div>
      <nav className="mb-4">
        {['buscar','subir','consultar'].map(tab => (
          <button
            key={tab}
            onClick={()=>setActive(tab)}
            className={active===tab?'font-bold':''}
          >
            {tab==='buscar'?'Buscar Documentos':tab==='subir'?'Subir Documento':'Consultar Documentos'}
          </button>
        ))}
      </nav>
      <div>
        {active==='buscar' && <SearchForm />}
        {active==='subir' && <DocumentForm />}
        {active==='consultar' && <DocumentList />}
      </div>
    </div>
  );
}
