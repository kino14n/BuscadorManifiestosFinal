// src/App.js
import React from 'react';
import Tabs from './components/Tabs';

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Manifiestos</h1>
      <Tabs />
    </div>
  );
}
