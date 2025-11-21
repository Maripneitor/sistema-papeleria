import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Proveedor } from '../types';

export default function Proveedores() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [form, setForm] = useState<Partial<Proveedor>>({ nombre: '', contacto: '', telefono: '', correo: '' });
    const [loading, setLoading] = useState(false);

    const cargar = () => {
        client.get('/proveedores').then(res => setProveedores(res.data.data));
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post('/proveedores', form);
            setForm({ nombre: '', contacto: '', telefono: '', correo: '' }); // Limpiar
            cargar(); // Recargar tabla
            alert('✅ Proveedor guardado');
        } catch (error) {
            alert('Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>🚚 Gestión de Proveedores</h1>

            {/* FORMULARIO */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <h3>Nuevo Proveedor</h3>
                <form onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                        placeholder="Nombre Empresa *" required 
                        value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <input 
                        placeholder="Nombre Contacto" 
                        value={form.contacto} onChange={e => setForm({...form, contacto: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <input 
                        placeholder="Teléfono" 
                        value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <input 
                        placeholder="Correo Electrónico" type="email"
                        value={form.correo} onChange={e => setForm({...form, correo: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <button type="submit" disabled={loading} style={{ gridColumn: 'span 2', padding: '10px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
                        {loading ? 'Guardando...' : 'Guardar Proveedor'}
                    </button>
                </form>
            </div>

            {/* TABLA */}
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: '#f8fafc' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Empresa</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Contacto</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map(p => (
                        <tr key={p.id_proveedor} style={{ borderTop: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{p.nombre}</td>
                            <td style={{ padding: '10px' }}>{p.contacto || '-'}</td>
                            <td style={{ padding: '10px' }}>{p.telefono || '-'}</td>
                            <td style={{ padding: '10px' }}>{p.correo || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
