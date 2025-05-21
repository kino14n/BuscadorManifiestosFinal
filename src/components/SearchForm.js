import React, { useState } from 'react';
import { searchDocumentsByCodes } from '../utils/storage';

const SearchForm = ({ onView, onPrint }) => {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState({ documents: [], missingCodes: [] });
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const handleSearch = e => {
    e.preventDefault();
    const list = codes.split('\n').map(c => c.trim()).filter(Boolean);
    const res = searchDocumentsByCodes(list);
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
      <h2 className="text-xl font-semibold mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <textarea
          value={codes}
          onChange={e => setCodes(e.target.value)}
          className="w-full p-2 border rounded h-32 mb-4"
          placeholder="Códigos, uno por línea"
        />
        <div className="flex gap-2 mb-4">
          <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded">Buscar</button>
          <button
            type="button"
            onClick={() => { setCodes(''); setResults({ documents: [], missingCodes: [] }); setSearched(false); }}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded"
          >
            Limpiar
          </button>
        </div>
      </form>

      {searched && (
        <div>
          {results.missingCodes.length > 0 && (
            <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Códigos no encontrados:</strong>
              <div className="flex flex-wrap gap-1 mt-2">
                {results.missingCodes.map(c => (
                  <span key={c} className="px-2 py-1 bg-yellow-100 rounded text-yellow-800 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {results.documents.length > 0 ? (
            <div className="space-y-4">
              {results.documents.map(doc => (
                <div key={doc.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(doc.id)}
                        onChange={() => toggle(doc.id)}
                      />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.date}</p>
                      </div>
                    </label>
                    <div className="space-x-2">
                      <button onClick={() => onView([doc.id])} className="text-blue-500">Ver</button>
                      <button onClick={() => onPrint([doc.id])} className="text-green-500">Imprimir</button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="font-medium">Códigos encontrados:</small>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.matchedCodes.map(c => (
                        <span key={c} className="px-2 py-1 bg-blue-100 rounded text-blue-800 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No se hallaron documentos.</p>
          )}

          {selected.size > 0 && (
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => onView([...selected])} className="bg-blue-500 text-white py-2 px-4 rounded">
                Ver ({selected.size})
              </button>
              <button onClick={() => onPrint([...selected])} className="bg-green-500 text-white py-2 px-4 rounded">
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
