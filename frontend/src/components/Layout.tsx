import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Truck, 
    Users, 
    BarChart3, 
    Boxes 
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/pos', label: 'Punto de Venta', icon: <ShoppingCart size={20} /> },
        { path: '/productos', label: 'Inventario', icon: <Boxes size={20} /> }, // NUEVO
        { path: '/compras', label: 'Compras', icon: <Package size={20} /> },
        { path: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
        { path: '/usuarios', label: 'Usuarios', icon: <Users size={20} /> },
        { path: '/reportes', label: 'Reportes', icon: <BarChart3 size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ 
                width: '260px', 
                background: '#0f172a', 
                color: 'white', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'fixed',
                height: '100%',
                zIndex: 10
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1e293b' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🖇️ Papelería <span style={{color: '#3b82f6'}}>PRO</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '20px 10px' }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    marginBottom: '4px',
                                    borderRadius: '8px',
                                    color: isActive ? 'white' : '#94a3b8',
                                    background: isActive ? '#2563eb' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {item.icon}
                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#334155' }}></div>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: 'white' }}>Administrador</div>
                            <div>Admin</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main style={{ 
                flex: 1, 
                marginLeft: '260px', 
                padding: '30px',
                maxWidth: '1600px',
                width: 'calc(100% - 260px)'
            }}>
                {children}
            </main>
        </div>
    );
}
