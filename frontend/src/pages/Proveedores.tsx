import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Proveedor } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Truck, Phone, Mail, FileSpreadsheet, Save, User } from 'lucide-react';
import { PageContainer, Card, CardTitle, Input, Button, Grid2, GridAuto, FormGroup } from '../components/ui/StyledComponents';

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Proveedores</h1>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '14px' }}>Directorio de socios comerciales</p>
                </div>
                <Button variant="outline" onClick={() => exportToExcel(proveedores, 'Proveedores')}>
                    <FileSpreadsheet size={18} /> Exportar Lista
                </Button>
            </div>

            <Grid2 style={{ gridTemplateColumns: '350px 1fr' }}>
                
                {/* FORMULARIO LATERAL */}
                <Card style={{ height: 'fit-content' }}>
                    <CardTitle><Truck size={20} /> Registrar Proveedor</CardTitle>
                    <form onSubmit={guardar}>
                        <FormGroup>
                            <label>Empresa *</label>
                            <Input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej. Papelera S.A." />
                        </FormGroup>
                        <FormGroup>
                            <label>Nombre de Contacto</label>
                            <Input value={form.contacto} onChange={e => setForm({...form, contacto: e.target.value})} placeholder="Ej. Juan Pérez" />
                        </FormGroup>
                        <FormGroup>
                            <label>Teléfono</label>
                            <Input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="555-0000" />
                        </FormGroup>
                        <FormGroup>
                            <label>Correo Electrónico</label>
                            <Input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} placeholder="contacto@empresa.com" />
                        </FormGroup>
                        <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                            {loading ? 'Guardando...' : <><Save size={18}/> Registrar Proveedor</>}
                        </Button>
                    </form>
                </Card>

                {/* GRID DE TARJETAS VISUALES */}
                <GridAuto>
                    {proveedores.map(p => (
                        <Card key={p.id_proveedor} style={{ padding: '20px', borderLeft: '4px solid #4480FF' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{p.nombre}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                    <User size={14}/> {p.contacto || 'Sin contacto'}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155' }}>
                                    <div style={{ padding: '6px', background: '#eff6ff', borderRadius: '6px', color: '#4480FF' }}><Phone size={14} /></div>
                                    {p.telefono || '--'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155' }}>
                                    <div style={{ padding: '6px', background: '#eff6ff', borderRadius: '6px', color: '#4480FF' }}><Mail size={14} /></div>
                                    {p.correo || '--'}
                                </div>
                            </div>
                        </Card>
                    ))}
                </GridAuto>
            </Grid2>
        </PageContainer>
    );
}