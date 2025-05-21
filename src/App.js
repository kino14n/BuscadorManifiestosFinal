// src/App.js
import React, { useState, useEffect } from 'react';
import DocumentForm from './components/DocumentForm.js';
import DocumentList from './components/DocumentList.js';
import SearchForm from './components/SearchForm.js';
import Tabs from './components/Tabs.js';

function App() {
  // tu lógica de estado y efectos
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      <Tabs /* props */ />
      {/* renderea SearchForm, DocumentList, DocumentForm según la pestaña */}
    </div>
  );
}

export default App;
