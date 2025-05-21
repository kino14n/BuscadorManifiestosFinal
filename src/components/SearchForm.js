import React, { useState } from 'react';
import { searchDocumentsByCodes } from '../utils/storage.js';

export default function SearchForm({ onView, onPrint }) {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState({ documents: [], missingCodes: [] });
  const [searched, setSearched] = useState(false);
  const [sel, setSel] = useState(new Set());

  const handleSearch = e => {
    e.preventDefault();
    const list = codes.split('\n').map(c=>c.trim()).filter(c=>c);
    setResults(searchDocumentsByCodes(list));
    setSearched(true);
    setSel(new Set());
  };

  const handleReset = () => {
    setCodes(''); setResults({documents:[],missingCodes:[]});
    setSearched(false); setSel(new Set());
  };

  const toggle = id => {
    const ns = new Set(sel);
    ns.has(id)? ns.delete(id): ns.add(id);
    setSel(ns);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <textarea
          value={codes} onChange={e=>setCodes(e.target.value)}
          className="w-full p-2 border rounded h-32 mb-4"
          placeholder="Códigos, uno por línea" />
        <div className="flex gap-2 mb-4">
          <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded">Buscar</button>
          <button type="button" onClick={handleReset}
            className="flex-1 bg-gray-200 py-2 rounded">Limpiar</button>
        </div>
      </form>

      {searched && (
        <>
          {results.missingCodes.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-100 rounded border-yellow-300">
              <strong>No encontrados:</strong>{' '}
              {results.missingCodes.join(', ')}
            </div>
          )}
          {results.documents.length > 0
            ? results.documents.map(doc => (
              <div key={doc.id} className="mb-4 p-4 border rounded">
                <label className="flex items-center gap-2">
                  <input type="checkbox"
                    checked={sel.has(doc.id)}
                    onChange={()=>toggle(doc.id)}
                    className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-600">{doc.date}</div>
                  </div>
                </label>
                <div className="mt-2">
                  <span className="font-sm font-medium">Códigos:</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {doc.matchedCodes.map(c=><span key={c}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {c}
                    </span>)}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>onView([doc.id])}
                    className="text-blue-500 text-sm">Ver</button>
                  <button onClick={()=>onPrint([doc.id])}
                    className="text-green-500 text-sm">Imprimir</button>
                </div>
              </div>
            ))
            : <p>No se encontraron documentos.</p>
          }
          {sel.size>0 && (
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={()=>onView([...sel])}
                className="bg-blue-500 text-white px-4 py-2 rounded">Ver ({sel.size})</button>
              <button onClick={()=>onPrint([...sel])}
                className="bg-green-500 text-white px-4 py-2 rounded">Imprimir ({sel.size})</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
