import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Proveedor } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Truck, Phone, Mail, FileSpreadsheet, Save, User } from 'lucide-react';
import { 
    PageContainer, HeaderSection, Title, Subtitle, Card, 
    Input, Button, Grid2 
} from '../components/ui/SystemDesign';

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
        <PageContainer>
            <HeaderSection>
                <div>
                    <Title>Proveedores</Title>
                    <Subtitle>Directorio de socios comerciales</Subtitle>
                </div>
                {/* CORRECCIÓN: Usamos $variant */}
                <Button $variant="secondary" onClick={() => exportToExcel(proveedores, 'Proveedores')}>
                    <FileSpreadsheet size={18} /> Exportar
                </Button>
            </HeaderSection>

            <Grid2 style={{ gridTemplateColumns: '350px 1fr' }}>
                {/* FORMULARIO LATERAL */}
                <Card style={{ height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Truck size={18} /> Registrar Proveedor
                    </h3>
                    <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Empresa *</label>
                            <Input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre comercial" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Contacto</label>
                            <Input value={form.contacto} onChange={e => setForm({...form, contacto: e.target.value})} placeholder="Nombre del vendedor" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Teléfono</label>
                            <Input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="555-0000" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Correo</label>
                            <Input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} placeholder="contacto@empresa.com" />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : <><Save size={18}/> Guardar</>}
                        </Button>
                    </form>
                </Card>

                {/* LISTA DE PROVEEDORES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {proveedores.map(p => (
                        <Card key={p.id_proveedor} style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)' }}></div>
                            <div style={{ paddingLeft: '12px' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700' }}>{p.nombre}</div>
                                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <User size={14}/> {p.contacto || 'Sin contacto'}
                                </div>
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', alignItems: 'center' }}>
                                        <Phone size={14} color="var(--primary)"/> {p.telefono || '--'}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', alignItems: 'center' }}>
                                        <Mail size={14} color="var(--primary)"/> {p.correo || '--'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Grid2>
        </PageContainer>
    );
}