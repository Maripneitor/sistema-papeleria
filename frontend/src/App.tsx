import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Reportes from './pages/Reportes';
import Proveedores from './pages/Proveedores';
import Compras from './pages/Compras';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: '#1e293b', padding: '1rem', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>📊 Inventario</Link>
        <Link to="/pos" style={{ color: 'white', textDecoration: 'none' }}>🏪 POS</Link>
        <Link to="/compras" style={{ color: '#f43f5e', textDecoration: 'none' }}>📦 Compras</Link>
        <Link to="/proveedores" style={{ color: 'white', textDecoration: 'none' }}>🚚 Proveedores</Link>
        <Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>👥 Usuarios</Link>
        <div style={{ flex: 1 }}></div>
        <Link to="/reportes" style={{ color: '#4ade80', textDecoration: 'none' }}>📈 Reportes</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
