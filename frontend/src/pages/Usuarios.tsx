import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Usuario } from '../types';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [form, setForm] = useState({ 
        nombre: '', 
        usuario: '', 
        password_hash: '', 
        rol: 'empleado' 
    });
    const [loading, setLoading] = useState(false);

    const cargar = () => {
        client.get('/usuarios').then(res => setUsuarios(res.data.data));
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post('/usuarios', form);
            setForm({ nombre: '', usuario: '', password_hash: '', rol: 'empleado' }); // Reset
            cargar();
            alert('✅ Usuario registrado');
        } catch (error: any) {
            alert('❌ ' + (error.response?.data?.message || 'Error al guardar'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>👥 Gestión de Personal</h1>

            {/* FORMULARIO */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <h3>Nuevo Empleado</h3>
                <form onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    
                    <div style={{gridColumn: 'span 2'}}>
                        <label>Nombre Completo:</label>
                        <input 
                            required style={{ width: '100%', padding: '8px' }}
                            value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                        />
                    </div>

                    <div>
                        <label>Usuario (Login):</label>
                        <input 
                            required style={{ width: '100%', padding: '8px' }}
                            value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})}
                        />
                    </div>

                    <div>
                        <label>Contraseña:</label>
                        <input 
                            type="password" required style={{ width: '100%', padding: '8px' }}
                            value={form.password_hash} onChange={e => setForm({...form, password_hash: e.target.value})}
                        />
                    </div>

                    <div>
                        <label>Rol:</label>
                        <select 
                            style={{ width: '100%', padding: '8px' }}
                            value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}
                        >
                            <option value="empleado">Empleado (Cajero)</option>
                            <option value="admin">Administrador (Total)</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', height: '100%', marginTop: 'auto' }}>
                        {loading ? 'Guardando...' : 'Crear Usuario'}
                    </button>
                </form>
            </div>

            {/* LISTA */}
            <div style={{ display: 'grid', gap: '10px' }}>
                {usuarios.map(u => (
                    <div key={u.id_usuario} style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: u.rol === 'admin' ? '5px solid #e11d48' : '5px solid #2563eb' }}>
                        <div>
                            <strong style={{ fontSize: '1.1em' }}>{u.nombre}</strong>
                            <div style={{ color: '#666', fontSize: '0.9em' }}>@{u.usuario}</div>
                        </div>
                        <span style={{ 
                            background: u.rol === 'admin' ? '#ffe4e6' : '#dbeafe', 
                            color: u.rol === 'admin' ? '#e11d48' : '#1e40af',
                            padding: '5px 10px', borderRadius: '15px', fontSize: '0.8em', fontWeight: 'bold'
                        }}>
                            {u.rol.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
