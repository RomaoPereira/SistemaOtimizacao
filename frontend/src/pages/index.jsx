import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary bypass for login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-white/40">
        
        <h1 className="text-2xl md:text-3xl font-light text-slate-700 text-center mb-8">
          Sistema de <span className="font-semibold">Gestão de Energia</span>
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="text" 
              placeholder="Matrícula" 
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full mt-4 bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Entrar
          </button>
          
          <div className="text-center mt-6">
            <button 
              type="button" 
              className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
