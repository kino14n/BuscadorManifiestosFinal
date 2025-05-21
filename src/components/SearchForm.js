import React, { useState } from 'react';
import { searchDocumentsByCodes } from '../utils/storage.js';

export default function SearchForm({ onView, onPrint }) {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState({ documents: [], missingCodes: [] });
  const [searched, setSearched] = useState(false);
  const [sel, setSel] = useState(new Set());

  const handleSearch = async e => {
    e.preventDefault();
    const list = codes.split('\n').filter(c=>c.trim());
    const res = await searchDocumentsByCodes(list);
    setResults(res);
    setSearched(true);
    setSel(new Set());
  };

  const toggleSelect = id => {
    const s = new Set(sel);
    s.has(id)? s.delete(id): s.add(id);
    setSel(s);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <textarea
          className="w-full border p-2 h-32 mb-4"
          placeholder="Códigos uno por línea"
          value={codes} onChange={e=>setCodes(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Buscar</button>
        <button type="button" onClick={()=>{setCodes('');setSearched(false);setResults({documents:[],missingCodes:[]});}} className="bg-gray-200 py-2 px-4 rounded">Limpiar</button>
      </form>
      {searched && (
        <div className="mt-6">
          {results.missingCodes.length>0 && (
            <div className="mb-4 p-3 bg-yellow-50 rounded">
              <strong>Códigos no encontrados:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {results.missingCodes.map(c=>(
                  <span key={c} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{c}</span>
                ))}
              </div>
            </div>
          )}
          {results.documents.length>0 ? (
            results.documents.map(d=>(
              <div key={d.id} className="border p-4 mb-4 rounded">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={sel.has(d.id)} onChange={()=>toggleSelect(d.id)} />
                  <div>
                    <p className="font-medium">{d.nombre}</p>
                    <p className="text-sm text-gray-600">{d.fecha}</p>
                  </div>
                </label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {d.matchedCodes.map(c=>(
                    <span key={c} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{c}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay documentos que cubran esos códigos.</p>
          )}
          {sel.size>0 && (
            <div className="flex gap-2 mt-4">
              <button onClick={()=>onView([...sel])} className="bg-blue-500 text-white py-2 px-4 rounded">Ver ({sel.size})</button>
              <button onClick={()=>onPrint([...sel])} className="bg-green-500 text-white py-2 px-4 rounded">Imprimir ({sel.size})</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
