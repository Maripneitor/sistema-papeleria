import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Reportes from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: '#1e293b', padding: '1rem', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📊 Inventario</Link>
        <Link to="/pos" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏪 Punto de Venta</Link>
        <Link to="/reportes" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold' }}>📈 Reportes</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
