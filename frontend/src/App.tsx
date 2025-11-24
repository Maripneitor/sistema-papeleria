import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Reportes from './pages/Reportes';
import Proveedores from './pages/Proveedores';
import Compras from './pages/Compras';
import Usuarios from './pages/Usuarios';
import Productos from './pages/Productos';
import Configuracion from './pages/Configuracion'; // <-- Importar

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/configuracion" element={<Configuracion />} /> {/* <-- Ruta Nueva */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;