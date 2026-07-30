import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const Alertas = () => {
  const alertasNaoConferidos = [
    { id: 1, ambiente: 'Sala de Reuniões', motivo: 'Ar condicionado ligado em sala vazia', tempo: 'Há 15 min' },
    { id: 2, ambiente: 'Laboratório 01', motivo: 'Consumo acima da meta semanal', tempo: 'Há 2 horas' },
  ];

  const alertasResolvidos = [
    { id: 3, ambiente: 'Recepção', motivo: 'Luzes esquecidas acesas', tempo: 'Ontem' },
    { id: 4, ambiente: 'Sala dos Professores', motivo: 'Pico de energia detectado', tempo: 'Semana passada' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Central de Alertas</h1>
        <p className="text-slate-500">Notificações e indícios de desperdício do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Não Conferidos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Requerem Atenção</h2>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">2</span>
          </div>

          {alertasNaoConferidos.map((alerta) => (
            <div key={alerta.id} className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 hover:border-red-200 transition-colors">
              <h3 className="font-bold text-slate-800">{alerta.ambiente}</h3>
              <p className="text-slate-600 mt-1">{alerta.motivo}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Clock size={14} />
                  <span>{alerta.tempo}</span>
                </div>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                  Marcar como Resolvido
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Conferidos / Resolvidos */}
        <div className="space-y-4 opacity-75">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-slate-100 p-2 rounded-lg">
              <CheckCircle2 size={20} className="text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Histórico Resolvido</h2>
          </div>

          {alertasResolvidos.map((alerta) => (
            <div key={alerta.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-medium text-slate-700">{alerta.ambiente}</h3>
              <p className="text-slate-500 mt-1 text-sm">{alerta.motivo}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
                <Clock size={14} />
                <span>Resolvido {alerta.tempo}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Alertas;
