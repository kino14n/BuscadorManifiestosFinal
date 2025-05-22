import React, { useState } from 'react';
import { searchDocumentsByCodes } from '../utils/api.js';

const SearchForm = ({ onView, onPrint }) => {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState({ documents: [], missingCodes: [] });
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const handleSearch = async e => {
    e.preventDefault();
    const list = codes.split('\n').filter(c => c.trim());
    const res = await searchDocumentsByCodes(list);
    setResults(res);
    setSearched(true);
    setSelected(new Set());
  };

  const toggle = id => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <textarea
          value={codes}
          onChange={e => setCodes(e.target.value)}
          className="w-full border p-2 rounded h-32 mb-4"
          placeholder="Códigos, uno por línea"
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded">
            Buscar
          </button>
          <button
            type="button"
            onClick={() => { setCodes(''); setResults({ documents: [], missingCodes: [] }); setSearched(false); }}
            className="flex-1 bg-gray-200 p-2 rounded"
          >
            Limpiar
          </button>
        </div>
      </form>

      {searched && (
        <div className="mt-6">
          {results.missingCodes.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 rounded">
              <strong>No encontrados:</strong>{' '}
              {results.missingCodes.join(', ')}
            </div>
          )}
          {results.documents.length > 0 ? (
            results.documents.map(doc => (
              <div key={doc.id} className="border p-4 mb-4 rounded">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.id)}
                    onChange={() => toggle(doc.id)}
                  />
                  <div>
                    <strong>{doc.name}</strong> — {doc.date}
                  </div>
                </label>
                <div className="mt-2">
                  Códigos:{' '}
                  {doc.matchedCodes.map(c => (
                    <span key={c} className="px-2 py-1 bg-blue-100 rounded mr-1 text-sm">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => onView([doc.id])} className="text-blue-500">
                    Ver
                  </button>
                  <button onClick={() => onPrint([doc.id])} className="text-green-500">
                    Imprimir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay documentos que cubran estos códigos.</p>
          )}
          {selected.size > 0 && (
            <div className="flex justify-end gap-2">
              <button onClick={() => onView([...selected])} className="bg-blue-500 text-white p-2 rounded">
                Ver ({selected.size})
              </button>
              <button onClick={() => onPrint([...selected])} className="bg-green-500 text-white p-2 rounded">
                Imprimir ({selected.size})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
