import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Planificacion from './pages/Planificacion';
import Ejecucion from './pages/Ejecucion';
import Auditoria from './pages/Auditoria';
import Satisfaccion from './pages/Satisfaccion';
import Empleados from './pages/Empleados';
import TiposServicio from './pages/TiposServicio';
import Tecnicos from './pages/Tecnicos';
import OrdenesTrabajo from './pages/OrdenesTrabajo';
import Informes from './pages/Informes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicios/*" element={<Servicios />} />
          <Route path="ordenes-trabajo" element={<OrdenesTrabajo />} />
          <Route path="planificacion" element={<Planificacion />} />
          <Route path="ejecucion" element={<Ejecucion />} />
          <Route path="auditoria/*" element={<Auditoria />} />
          <Route path="informes" element={<Informes />} />
          <Route path="satisfaccion" element={<Satisfaccion />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="tipos-servicio" element={<TiposServicio />} />
          <Route path="tecnicos" element={<Tecnicos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
