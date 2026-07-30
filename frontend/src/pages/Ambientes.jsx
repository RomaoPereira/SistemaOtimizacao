import { useState, useEffect } from 'react';
import { Thermometer, Users, Power, MoreVertical, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const AmbienteCard = ({ ambiente }) => {
  // Lógica temporária até termos as leituras associadas na view de ambiente
  const isDesperdicio = ambiente.is_occupied === false && false; // Mudar quando o SCT-013 for implementado

  return (
    <div className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-md ${isDesperdicio ? 'border-amber-200' : 'border-transparent shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{ambiente.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ambiente.is_occupied ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${ambiente.is_occupied ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-sm font-medium text-slate-500">
              {ambiente.is_occupied ? 'Ocupado' : 'Ocioso'}
            </span>
          </div>
        </div>
        <button className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3 text-slate-600">
            <Thermometer size={18} className="text-orange-500" />
            <span className="text-sm font-medium">Temperatura</span>
          </div>
          <span className="font-bold text-slate-800">-- °C</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3 text-slate-600">
            <Power size={18} className={isDesperdicio ? 'text-red-500' : 'text-blue-500'} />
            <span className="text-sm font-medium">Consumo Atual</span>
          </div>
          <span className={`font-bold ${isDesperdicio ? 'text-red-500' : 'text-slate-800'}`}>
            -- kWh
          </span>
        </div>
      </div>

      {isDesperdicio && (
        <div className="mt-4 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-2 rounded-lg border border-amber-200">
          ⚠️ Possível desperdício de energia
        </div>
      )}
    </div>
  );
};

const Ambientes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const response = await api.get('/environments/');
        setAmbientes(response.data.results || response.data || []);
      } catch (error) {
        console.error("Erro ao buscar ambientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAmbientes();
    const interval = setInterval(fetchAmbientes, 5000); // Poll a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoramento por Ambiente</h1>
          <p className="text-slate-500">Controle individual de cada cômodo mapeado.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Novo Ambiente
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-emerald-500" />
        </div>
      ) : ambientes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Thermometer size={48} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Nenhum Ambiente Cadastrado</h3>
          <p className="text-slate-500 mt-2 max-w-md">Para começar a receber os dados do Arduino, crie um novo ambiente e vincule os sensores a ele no painel do administrador.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ambientes.map((ambiente) => (
            <AmbienteCard key={ambiente.id} ambiente={ambiente} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Ambientes;
