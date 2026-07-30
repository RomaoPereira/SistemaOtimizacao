import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Download } from 'lucide-react';

const data = [
  { name: 'Seg', 'Laboratório 1': 4000, 'Recepção': 2400, 'Sala Profs': 2400 },
  { name: 'Ter', 'Laboratório 1': 3000, 'Recepção': 1398, 'Sala Profs': 2210 },
  { name: 'Qua', 'Laboratório 1': 2000, 'Recepção': 9800, 'Sala Profs': 2290 },
  { name: 'Qui', 'Laboratório 1': 2780, 'Recepção': 3908, 'Sala Profs': 2000 },
  { name: 'Sex', 'Laboratório 1': 1890, 'Recepção': 4800, 'Sala Profs': 2181 },
  { name: 'Sáb', 'Laboratório 1': 2390, 'Recepção': 3800, 'Sala Profs': 2500 },
  { name: 'Dom', 'Laboratório 1': 3490, 'Recepção': 4300, 'Sala Profs': 2100 },
];

const Monitoramento = () => {
  
  const handleExportCSV = () => {
    // Cabeçalho do CSV
    let csvContent = "data:text/csv;charset=utf-8,Dia,Laboratório 1,Recepção,Sala Profs\n";
    
    // Dados mapeados para linhas CSV
    data.forEach(row => {
      csvContent += `${row.name},${row['Laboratório 1']},${row['Recepção']},${row['Sala Profs']}\n`;
    });
    
    // Criar o download invisível
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_consumo_energia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios e Histórico</h1>
          <p className="text-slate-500">Análise profunda do consumo energético.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            <span>Últimos 7 dias</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Download size={18} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-8">Comparativo de Consumo por Ambiente (kWh)</h2>
        
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}
                cursor={{fill: '#f8fafc'}}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Laboratório 1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recepção" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sala Profs" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Monitoramento;
