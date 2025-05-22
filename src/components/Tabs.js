import React, { useState } from 'react';
import DocumentForm from './DocumentForm.js';
import SearchForm from './SearchForm.js';
import DocumentList from './DocumentList.js';

const Tabs = () => {
  const [active, setActive] = useState('search');
  const [pdfOpen, setPdfOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  const handleView = ids => {
    if (ids.length === 1) {
      // abre iframe
      const url = window.location.origin + `/api/manifiestos/${ids[0]}/file`;
      setCurrentPdf(url);
      setPdfOpen(true);
    } else {
      ids.forEach(id => window.open(`/api/manifiestos/${id}/file`, '_blank'));
    }
  };

  const handlePrint = ids => handleView(ids) && window.print();

  return (
    <div className="max-w-4xl mx-auto">
      {pdfOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white w-full h-full p-4">
            <button onClick={() => setPdfOpen(false)} className="mb-2">Cerrar</button>
            <iframe src={currentPdf} className="w-full h-full"></iframe>
          </div>
        </div>
      )}

      <div className="flex space-x-4 border-b mb-4">
        {['search','upload','list'].map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`py-2 px-4 ${
              active === tab
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
          >
            {tab === 'search' ? 'Buscar' : tab === 'upload' ? 'Subir' : 'Consultar'}
          </button>
        ))}
      </div>

      {active === 'search' && <SearchForm onView={handleView} onPrint={handlePrint} />}
      {active === 'upload' && <DocumentForm onSave={() => setActive('list')} />}
      {active === 'list' && <DocumentList onView={handleView} onPrint={handlePrint} />}
    </div>
  );
};

export default Tabs;
