import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  LayoutDashboard, ShoppingCart, Package, Truck, 
  Users, BarChart3, Settings, LogOut, FileText 
} from 'lucide-react';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-app);
`;

const Sidebar = styled.aside`
  width: 260px;
  background: var(--bg-sidebar);
  border-right: var(--border-subtle);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  padding: 24px 16px;
  z-index: 50;
`;

const LogoArea = styled.div`
  margin-bottom: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    span { color: var(--primary); }
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  /* Estados */
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  background: ${props => props.$active ? 'rgba(0, 113, 227, 0.08)' : 'transparent'};

  &:hover {
    background: ${props => props.$active ? 'rgba(0, 113, 227, 0.12)' : 'rgba(0,0,0,0.03)'};
    color: ${props => props.$active ? 'var(--primary)' : 'var(--text-primary)'};
  }
`;

const UserProfile = styled.div`
  margin-top: auto;
  padding: 16px;
  border-top: var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00C6FB 0%, #005BEA 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }
  
  .info {
    flex: 1;
    h4 { margin: 0; font-size: 14px; color: var(--text-primary); }
    p { margin: 0; font-size: 12px; color: var(--text-secondary); }
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px; /* Ancho del sidebar */
  /* El padding se maneja dentro de PageContainer */
`;

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/pos', label: 'Punto de Venta', icon: <ShoppingCart size={20} /> },
        { path: '/productos', label: 'Inventario', icon: <Package size={20} /> },
        { path: '/compras', label: 'Entradas', icon: <FileText size={20} /> },
        { path: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
        { path: '/reportes', label: 'Analíticas', icon: <BarChart3 size={20} /> },
        { path: '/usuarios', label: 'Equipo', icon: <Users size={20} /> },
    ];

    // Items secundarios (Configuración, Auditoría)
    const secondaryItems = [
        { path: '/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
    ];

    return (
        <LayoutWrapper>
            <Sidebar>
                <LogoArea>
                    <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8 }}></div>
                    <h2>Papelería <span>PRO</span></h2>
                </LogoArea>

                <NavList>
                    {menuItems.map(item => (
                        <NavLink key={item.path} to={item.path} $active={location.pathname === item.path}>
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
                    {secondaryItems.map(item => (
                        <NavLink key={item.path} to={item.path} $active={location.pathname === item.path}>
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </NavList>

                <UserProfile>
                    <div className="avatar">JD</div>
                    <div className="info">
                        <h4>Juan Dueño</h4>
                        <p>Administrador</p>
                    </div>
                    <LogOut size={18} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                </UserProfile>
            </Sidebar>

            <MainContent>
                {children}
            </MainContent>
        </LayoutWrapper>
    );
}