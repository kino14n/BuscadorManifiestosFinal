import React, { useState } from 'react';
import { fetchAll } from '../utils/api.js';

export default function SearchForm({ onView, onPrint }) {
  const [codesInput, setCodesInput] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async e => {
    e.preventDefault();
    const codes = codesInput.split('\n').filter(c=>c.trim());
    const all = await fetchAll();
    // lógica greedy idéntica a la de antes:
    const missing = codes.filter(c=>!all.some(d=>d.codes.includes(c)));
    const sorted = all.sort((a,b)=>new Date(b.date)-new Date(a.date));
    const selected = [];
    const covered = new Set();
    while (covered.size < codes.length - missing.length) {
      let best = null, bestCount=0;
      for (let d of sorted) {
        const newCount = d.codes.filter(c=>codes.includes(c)&&!covered.has(c)).length;
        if (newCount>bestCount) {
          bestCount=newCount; best=d;
        }
      }
      if (!best) break;
      const matched = best.codes.filter(c=>codes.includes(c)&&!covered.has(c));
      matched.forEach(c=>covered.add(c));
      selected.push({...best, matchedCodes:matched});
    }
    setResults({ selected, missing });
  };

  const reset = () => {
    setCodesInput(''); setResults(null);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSearch}>
        <textarea
          rows="5"
          className="w-full p-2 border rounded mb-3"
          placeholder="Códigos, uno por línea"
          value={codesInput}
          onChange={e=>setCodesInput(e.target.value)}
        />
        <div className="flex gap-2 mb-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Buscar
          </button>
          <button type="button" onClick={reset}
            className="bg-gray-200 px-4 py-2 rounded">
            Limpiar
          </button>
        </div>
      </form>
      {results && (
        <div>
          {results.missing.length>0 && (
            <p className="text-yellow-600">
              Códigos no encontrados: {results.missing.join(', ')}
            </p>
          )}
          {results.selected.map(d=>(
            <div key={d.id} className="border p-3 rounded mb-2">
              <h4 className="font-medium">{d.name}</h4>
              <div className="space-x-2 mt-1">
                <button onClick={()=>onView([d.id])} className="text-blue-500">Ver</button>
                <button onClick={()=>onPrint([d.id])} className="text-green-500">Imprimir</button>
              </div>
              <div className="mt-2">
                {d.matchedCodes.map(c=>(
                  <span key={c} className="inline-block bg-blue-100 px-2 py-1 mr-1 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
