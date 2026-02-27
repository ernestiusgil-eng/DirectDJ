
import React, { useState } from 'react';
import { Home } from './views/Home';
import { DJRegister } from './views/DJRegister';
import { DJLogin } from './views/DJLogin';
import { DJDashboard } from './views/DJDashboard';
import { ClientRequest } from './views/ClientRequest';
import { AdminDashboard } from './views/AdminDashboard';
import { RateService } from './views/RateService';
import { About } from './views/About';
import { Shield } from 'lucide-react';
import { getAppState } from './services/mockData';
import { DJProfile } from './types';

type View = 'home' | 'register-dj' | 'dj-login' | 'dj-dashboard' | 'request-dj' | 'admin-login' | 'admin-dashboard' | 'rate-service' | 'about';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [adminAuth, setAdminAuth] = useState({ email: '', password: '' });
  const [loggedInDj, setLoggedInDj] = useState<DJProfile | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const state = getAppState();
    
    // Check credentials against stored settings
    if (adminAuth.email === state.adminSettings.email && adminAuth.password === state.adminSettings.password) {
      setCurrentView('admin-dashboard');
    } else {
      alert('Credenciais inválidas. Verifique o e-mail e a palavra-passe.');
    }
  };

  const handleDjLoginSuccess = (dj: DJProfile) => {
    setLoggedInDj(dj);
    setCurrentView('dj-dashboard');
  };

  const handleDjLogout = () => {
    setLoggedInDj(null);
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView as any} />;
      case 'register-dj':
        return <DJRegister onBack={() => setCurrentView('dj-login')} />;
      case 'dj-login':
        return (
            <DJLogin 
                onBack={() => setCurrentView('home')} 
                onLoginSuccess={handleDjLoginSuccess}
                onRegisterClick={() => setCurrentView('register-dj')}
            />
        );
      case 'dj-dashboard':
        return loggedInDj ? <DJDashboard dj={loggedInDj} onLogout={handleDjLogout} /> : <Home onNavigate={setCurrentView as any} />;
      case 'request-dj':
        return <ClientRequest onBack={() => setCurrentView('home')} />;
      case 'rate-service':
        return <RateService onBack={() => setCurrentView('home')} />;
      case 'about':
        return <About onBack={() => setCurrentView('home')} />;
      case 'admin-login':
        return (
          <div className="min-h-screen flex items-center justify-center p-6 bg-black/40">
            <div className="glass p-10 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <Shield size={32} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-black">Acesso Restrito</h1>
                <p className="text-sm text-white/40">Área Administrativa</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase">E-mail</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="Seu e-mail de admin"
                    value={adminAuth.email}
                    onChange={e => setAdminAuth({...adminAuth, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase">Palavra-passe</label>
                  <input 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    placeholder="••••••••"
                    value={adminAuth.password}
                    onChange={e => setAdminAuth({...adminAuth, password: e.target.value})}
                  />
                </div>
                <div className="pt-4 space-y-4">
                  <button type="submit" className="w-full py-4 bg-orange-600 rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20">
                    Entrar no Painel
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrentView('home')} 
                    className="w-full text-sm text-white/40 hover:text-white transition-colors">
                    Voltar para o site
                  </button>
                </div>
              </form>
              <div className="mt-6 text-center">
                 <p className="text-[10px] text-white/20">Login padrão inicial: admin@directdj.ao / admin</p>
              </div>
            </div>
          </div>
        );
      case 'admin-dashboard':
        return <AdminDashboard onLogout={() => setCurrentView('home')} />;
      default:
        return <Home onNavigate={setCurrentView as any} />;
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-neutral-950 text-white selection:bg-pink-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-600/10 blur-[120px] rounded-full"></div>
      </div>
      
      {renderView()}
    </div>
  );
};

export default App;
