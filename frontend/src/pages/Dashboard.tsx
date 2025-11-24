import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { 
    PageContainer, HeaderSection, Title, Subtitle, 
    Grid4, Card, Button 
} from '../components/ui/SystemDesign';
import { 
    DollarSign, ShoppingBag, AlertTriangle, TrendingUp, ArrowRight, 
    Package, Truck, Users 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Componente Interno para KPI Cards
const KPICard = ({ title, value, subtext, icon, color }: any) => (
    <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ 
                width: 40, height: 40, borderRadius: '10px', 
                background: `${color}15`, color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
                {icon}
            </div>
        </div>
        <div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{subtext}</div>
    </Card>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [kpis, setKpis] = useState<any>(null);
    const [grafica, setGrafica] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await client.get('/reportes/dashboard');
                const data = res.data.data;
                
                const chartData = data.ventasSemana.map((v: any) => ({
                    name: new Date(v.fecha).toLocaleDateString('es-MX', { weekday: 'short' }),
                    total: parseFloat(v.total_venta)
                }));
                
                setGrafica(chartData);
                setKpis(data.kpis);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <PageContainer>Cargando panel...</PageContainer>;

    return (
        <PageContainer>
            <HeaderSection>
                <div>
                    <Title>Resumen General</Title>
                    <Subtitle>Bienvenido de nuevo, aquí tienes lo que sucede hoy.</Subtitle>
                </div>
                <Button onClick={() => navigate('/pos')}>
                    Ir al Punto de Venta <ArrowRight size={16} />
                </Button>
            </HeaderSection>

            {/* SECCIÓN 1: KPIs */}
            <Grid4 style={{ marginBottom: '32px' }}>
                <KPICard 
                    title="Ventas de Hoy" 
                    value={`$${kpis?.ventas_hoy?.toLocaleString() ?? '0'}`} 
                    subtext={`${kpis?.tickets_hoy ?? 0} tickets generados`}
                    icon={<DollarSign size={22} />}
                    color="#0071E3"
                />
                <KPICard 
                    title="Acumulado Mensual" 
                    value={`$${kpis?.ventas_mes?.toLocaleString() ?? '0'}`} 
                    subtext="Objetivo: $50,000"
                    icon={<TrendingUp size={22} />}
                    color="#34C759"
                />
                <KPICard 
                    title="Stock Crítico" 
                    value={kpis?.alertas_stock ?? 0} 
                    subtext="Productos por agotarse"
                    icon={<AlertTriangle size={22} />}
                    color="#FF9F0A"
                />
                <KPICard 
                    title="Eficiencia" 
                    value="$104.2" 
                    subtext="Ticket Promedio"
                    icon={<ShoppingBag size={22} />}
                    color="#AF52DE"
                />
            </Grid4>

            {/* SECCIÓN 2: GRÁFICA PRINCIPAL */}
            <Card style={{ height: '400px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Tendencia de Ventas (7 Días)</h3>
                    <Button $variant="ghost" style={{ height: '32px', fontSize: '13px' }}>Ver reporte completo</Button>
                </div>
                {/* Contenedor con dimensiones explícitas para corregir warning de Recharts */}
                <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={grafica}>
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#86868B', fontSize: 12}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#86868B', fontSize: 12}}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#0071E3" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorVentas)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* SECCIÓN 3: ATAJOS RÁPIDOS */}
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Gestión Rápida</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <Button $variant="secondary" onClick={() => navigate('/productos')} style={{ justifyContent: 'flex-start' }}>
                    <Package size={18} /> Inventario
                </Button>
                <Button $variant="secondary" onClick={() => navigate('/compras')} style={{ justifyContent: 'flex-start' }}>
                    <Truck size={18} /> Registrar Compra
                </Button>
                <Button $variant="secondary" onClick={() => navigate('/usuarios')} style={{ justifyContent: 'flex-start' }}>
                    <Users size={18} /> Usuarios
                </Button>
            </div>

        </PageContainer>
    );
}