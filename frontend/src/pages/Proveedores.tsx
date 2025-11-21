import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Proveedor } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Truck, Phone, Mail, MapPin, FileSpreadsheet, Save } from 'lucide-react';

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
            setForm({ nombre: '', contacto: '', telefono: '', correo: '' });
            cargar();
            alert('✅ Proveedor guardado');
        } catch (error) {
            alert('Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>🚚 Directorio de Proveedores</h1>
                <button className="btn btn-outline" onClick={() => exportToExcel(proveedores, 'Proveedores')}>
                    <FileSpreadsheet size={18} /> Exportar Lista
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px' }}>
                
                {/* FORMULARIO LATERAL */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Truck size={20} /> Nuevo Proveedor
                    </h3>
                    <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Empresa *</label>
                            <input className="buscador" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej. Papelera S.A." />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Contacto</label>
                            <input className="buscador" value={form.contacto} onChange={e => setForm({...form, contacto: e.target.value})} placeholder="Nombre del vendedor" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Teléfono</label>
                            <input className="buscador" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="555-0000" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Correo</label>
                            <input className="buscador" type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} placeholder="contacto@empresa.com" />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                            {loading ? 'Guardando...' : <><Save size={18}/> Registrar</>}
                        </button>
                    </form>
                </div>

                {/* GRID DE TARJETAS (Mejor que tabla para contactos) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                    {proveedores.map(p => (
                        <div key={p.id_proveedor} className="card" style={{ borderLeft: '4px solid #64748b' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{p.nombre}</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>{p.contacto || 'Sin contacto'}</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={14} color="#2563eb" /> {p.telefono || '--'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={14} color="#2563eb" /> {p.correo || '--'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
