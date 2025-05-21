// src/App.js
import React from 'react';
import Tabs from './components/Tabs.js';

export default function App() {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <h1 className="text-center text-2xl font-bold mb-6">
        Buscador de Manifiestos
      </h1>
      <Tabs />
    </div>
  );
}
