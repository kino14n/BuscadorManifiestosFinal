import React, { useState } from 'react';
import { createOne } from '../utils/api.js';

export default function DocumentForm() {
  const [form, setForm] = useState({ titulo:'', contenido:'', fecha:'', codigos:'' });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const payload = {
      titulo: form.titulo,
      contenido: form.contenido,
      fecha: form.fecha,
      codigos: form.codigos.split('\n').map(c=>c.trim()).filter(Boolean)
    };
    try {
      await createOne(payload);
      alert('Documento guardado');
      setForm({ titulo:'', contenido:'', fecha:'', codigos:'' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label>Nombre</label>
        <input name="titulo" onChange={handle} value={form.titulo} className="border w-full px-2" />
      </div>
      <div>
        <label>Fecha</label>
        <input name="fecha" type="date" onChange={handle} value={form.fecha} className="border w-full px-2" />
      </div>
      <div>
        <label>Códigos (uno por línea)</label>
        <textarea name="codigos" onChange={handle} value={form.codigos} className="border w-full px-2 h-24" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Guardar</button>
    </form>
  );
}
