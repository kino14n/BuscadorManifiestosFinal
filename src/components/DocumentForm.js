// src/components/DocumentForm.js
import React, { useState } from 'react';
import { saveManifiesto } from '../utils/api';

export default function DocumentForm({ initialData = {}, onSaved }) {
  const [form, setForm] = useState({
    id: initialData.id || null,
    titulo: initialData.titulo || '',
    contenido: initialData.contenido || '',
    fecha: initialData.fecha?.slice(0,10) || new Date().toISOString().slice(0,10),
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await saveManifiesto(form);
      onSaved(saved);
    } catch (err) {
      console.error(err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="block">Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange}
          className="border px-2 py-1 w-full" required/>
      </div>
      <div className="mb-3">
        <label className="block">Contenido</label>
        <textarea name="contenido" value={form.contenido}
          onChange={handleChange} className="border px-2 py-1 w-full" required/>
      </div>
      <div className="mb-3">
        <label className="block">Fecha</label>
        <input type="date" name="fecha" value={form.fecha}
          onChange={handleChange} className="border px-2 py-1"/>
      </div>
      <button type="submit" disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded">
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  );
}
