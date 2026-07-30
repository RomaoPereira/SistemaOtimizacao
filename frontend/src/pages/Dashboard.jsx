import { useState, useEffect } from 'react';
import { Activity, Users, Battery, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

// Dados falsos para o gráfico (placeholders)
const data = [
  { time: '08:00', kwh: 4000 },
  { time: '10:00', kwh: 3000 },
  { time: '12:00', kwh: 2000 },
  { time: '14:00', kwh: 2780 },
  { time: '16:00', kwh: 1890 },
  { time: '18:00', kwh: 2390 },
  { time: '20:00', kwh: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total_readings: 0, average: 0, ambientes_ativos: 0, total_ambientes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, envRes] = await Promise.all([
          api.get('/statistics/'),
          api.get('/environments/')
        ]);
        
        const envs = envRes.data.results || envRes.data || [];
        const ativos = envs.filter(e => e.is_occupied).length;
        
        setStats({
          total_readings: statsRes.data.data.total_readings,
          average: statsRes.data.data.average,
          ambientes_ativos: ativos,
          total_ambientes: envs.length
        });
      } catch (error) {
        console.error("Erro ao buscar dados do Dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-500">Acompanhe o consumo energético em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600">Sistema Online</span>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Leituras Totais Capturadas" 
          value={isLoading ? "..." : stats.total_readings} 
          icon={Battery} 
          colorClass="bg-blue-500 shadow-lg shadow-blue-500/30"
          trend="up"
          trendValue="Em tempo real"
        />
        <StatCard 
          title="Ambientes Ativos" 
          value={isLoading ? "..." : `${stats.ambientes_ativos} / ${stats.total_ambientes}`} 
          icon={Activity} 
          colorClass="bg-emerald-500 shadow-lg shadow-emerald-500/30"
        />
        <StatCard 
          title="Média de Leituras (Geral)" 
          value={isLoading ? "..." : stats.average} 
          icon={Users} 
          colorClass="bg-indigo-500 shadow-lg shadow-indigo-500/30"
        />
        <StatCard 
          title="Alertas de Desperdício" 
          value="0" 
          icon={AlertTriangle} 
          colorClass="bg-amber-500 shadow-lg shadow-amber-500/30"
          trend="up"
          trendValue="Nenhum atual"
        />
      </div>

      {/* Área do Gráfico */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Curva de Consumo (kWh)</h2>
          <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Hoje</option>
            <option>Últimos 7 dias</option>
            <option>Este Mês</option>
          </select>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Area type="monotone" dataKey="kwh" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorKwh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
