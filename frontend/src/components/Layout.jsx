import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, AlertTriangle, Monitor, LogOut, Menu } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/ambientes', icon: <Monitor size={20} />, label: 'Ambientes' },
    { path: '/alertas', icon: <AlertTriangle size={20} />, label: 'Alertas' },
    { path: '/monitoramento', icon: <Zap size={20} />, label: 'Monitoramento' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Principal */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">EcoGestor IoT</h1>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile/Tablet */}
        <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-emerald-500" />
            <h1 className="font-bold text-slate-800">EcoGestor</h1>
          </div>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* Conteúdo Dinâmico das Telas */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
