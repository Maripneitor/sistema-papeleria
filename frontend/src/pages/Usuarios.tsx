import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Usuario } from '../types';
import { UserPlus, Shield, User } from 'lucide-react';
import { 
    PageContainer, HeaderSection, Title, Subtitle, Card, 
    Input, Button, Grid2, Badge 
} from '../components/ui/SystemDesign';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [form, setForm] = useState({ nombre: '', usuario: '', password_hash: '', rol: 'empleado' });
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
            setForm({ nombre: '', usuario: '', password_hash: '', rol: 'empleado' });
            cargar();
            alert('✅ Usuario registrado');
        } catch (error: any) {
            alert('Error: ' + (error.response?.data?.message || 'Error al guardar'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <HeaderSection>
                <div>
                    <Title>Equipo de Trabajo</Title>
                    <Subtitle>Gestiona los accesos al sistema</Subtitle>
                </div>
            </HeaderSection>

            <Grid2 style={{ gridTemplateColumns: '350px 1fr' }}>
                <Card style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <UserPlus size={18} /> Nuevo Usuario
                    </h3>
                    <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Nombre Completo</label>
                            <Input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Usuario (Login)</label>
                            <Input required value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Contraseña</label>
                            <Input type="password" required value={form.password_hash} onChange={e => setForm({...form, password_hash: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Rol</label>
                            <select 
                                style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid #E5E5EA', background: '#F2F2F7' }}
                                value={form.rol} 
                                onChange={e => setForm({...form, rol: e.target.value})}
                            >
                                <option value="empleado">Empleado (Ventas)</option>
                                <option value="admin">Administrador (Total)</option>
                            </select>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </Button>
                    </form>
                </Card>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {usuarios.map(u => (
                        <Card key={u.id_usuario} style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '20px' }}>
                            <div style={{ 
                                width: 48, height: 48, borderRadius: '50%', 
                                background: u.rol === 'admin' ? '#FFE5E5' : '#E5F2FF',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: u.rol === 'admin' ? 'var(--danger)' : 'var(--primary)'
                            }}>
                                {u.rol === 'admin' ? <Shield size={24} /> : <User size={24} />}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '16px' }}>{u.nombre}</div>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>@{u.usuario}</div>
                                <Badge type={u.rol === 'admin' ? 'danger' : 'neutral'}>
                                    {u.rol.toUpperCase()}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </Grid2>
        </PageContainer>
    );
}