import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Usuario } from '../types';
import { PageContainer, Card, CardTitle, Input, Select, Button, Grid2, GridAuto, FormGroup, Badge } from '../components/ui/StyledComponents';
import { UserPlus, Shield, User } from 'lucide-react';

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
            alert('❌ ' + (error.response?.data?.message || 'Error al guardar'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Equipo de Trabajo</h1>
                <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '14px' }}>Gestiona el acceso al sistema</p>
            </div>

            <Grid2 style={{ gridTemplateColumns: '350px 1fr' }}>
                <Card style={{ height: 'fit-content' }}>
                    <CardTitle><UserPlus size={20} /> Nuevo Empleado</CardTitle>
                    <form onSubmit={guardar}>
                        <FormGroup>
                            <label>Nombre Completo</label>
                            <Input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <label>Usuario (Login)</label>
                            <Input required value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <label>Contraseña</label>
                            <Input type="password" required value={form.password_hash} onChange={e => setForm({...form, password_hash: e.target.value})} />
                        </FormGroup>
                        <FormGroup>
                            <label>Rol de Acceso</label>
                            <Select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
                                <option value="empleado">Empleado (Cajero)</option>
                                <option value="admin">Administrador (Total)</option>
                            </Select>
                        </FormGroup>
                        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', marginTop: '15px' }}>
                            {loading ? 'Guardando...' : 'Crear Usuario'}
                        </Button>
                    </form>
                </Card>

                <GridAuto>
                    {usuarios.map(u => (
                        <Card key={u.id_usuario} style={{ flexDirection: 'row', alignItems: 'center', gap: '15px', padding: '20px' }}>
                            <div style={{ 
                                width: 50, height: 50, borderRadius: '50%', 
                                background: u.rol === 'admin' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'linear-gradient(135deg, #4480FF 0%, #0550ED 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                            }}>
                                {u.rol === 'admin' ? <Shield size={24} /> : <User size={24} />}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>{u.nombre}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>@{u.usuario}</div>
                                <Badge color={u.rol === 'admin' ? '#e11d48' : '#4480FF'}>
                                    {u.rol.toUpperCase()}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </GridAuto>
            </Grid2>
        </PageContainer>
    );
}