// src/components/SearchForm.js
import React, { useState } from 'react';
import { fetchDocuments } from '../utils/api.js';

export default function SearchForm({ onView }) {
  const [codes, setCodes] = useState('');
  const [results, setResults] = useState([]);
  const handleSearch = async e => {
    e.preventDefault();
    const all = await fetchDocuments();
    const list = codes.split('\n').filter(c=>c);
    // here aplica tu greedy cover search
    // ...
    setResults(/*selectedDocs*/);
  };
  return (
    <div>{/* tu UI de búsqueda + resultados */}</div>
  );
}
