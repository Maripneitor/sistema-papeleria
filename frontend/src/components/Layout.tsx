import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Truck, Users, BarChart3, Boxes } from 'lucide-react';
import styled from 'styled-components';

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6; /* Fondo global suave */
`;

const Sidebar = styled.aside`
  width: 260px;
  background: #FFFFFF; /* Sidebar Blanco limpio */
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  z-index: 50;
  box-shadow: 4px 0 24px rgba(0,0,0,0.02);
`;

const Main = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  width: calc(100% - 260px);
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.$active ? '#FFFFFF' : '#64748b'};
  background: ${props => props.$active ? 'linear-gradient(90deg, #4480FF 0%, #115DFC 100%)' : 'transparent'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(68, 128, 255, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.$active ? '' : '#f8fafc'};
    color: ${props => props.$active ? '#FFFFFF' : '#4480FF'};
    transform: translateX(2px);
  }
`;

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/pos', label: 'Punto de Venta', icon: <ShoppingCart size={20} /> },
        { path: '/productos', label: 'Inventario', icon: <Boxes size={20} /> },
        { path: '/compras', label: 'Compras', icon: <Package size={20} /> },
        { path: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
        { path: '/usuarios', label: 'Usuarios', icon: <Users size={20} /> },
        { path: '/reportes', label: 'Reportes', icon: <BarChart3 size={20} /> },
    ];

    return (
        <LayoutContainer>
            <Sidebar>
                <div style={{ padding: '30px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        🖇️ Papelería <span style={{color: '#4480FF'}}>PRO</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '20px 0' }}>
                    {menuItems.map((item) => (
                        <NavItem key={item.path} to={item.path} $active={location.pathname === item.path}>
                            {item.icon}
                            <span>{item.label}</span>
                        </NavItem>
                    ))}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4480FF 0%, #0550ED 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>AD</div>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ color: '#1e293b', fontWeight: '700' }}>Administrador</div>
                            <div style={{ color: '#94a3b8' }}>Activo ahora</div>
                        </div>
                    </div>
                </div>
            </Sidebar>

            <Main>
                {children}
            </Main>
        </LayoutContainer>
    );
}