import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ambientes from './pages/Ambientes';
import Alertas from './pages/Alertas';
import Monitoramento from './pages/Monitoramento';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rotas protegidas pelo Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ambientes" element={<Ambientes />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="monitoramento" element={<Monitoramento />} />
      </Route>
    </Routes>
  );
}

export default App;
