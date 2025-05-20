// src/components/Tabs.js
import React, { useState } from 'react';

export default function Tabs() {
  const [active, setActive] = useState('all');
  return (
    <div className="flex mb-4 space-x-4">
      {['all', 'recent'].map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-3 py-1 rounded ${
            active === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {tab === 'all' ? 'Todos' : 'Recientes'}
        </button>
      ))}
    </div>
  );
}
