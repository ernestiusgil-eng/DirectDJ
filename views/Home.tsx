
import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { Music, Users, ShieldCheck, CreditCard, Menu as MenuIcon, X, User, Globe, Shield, Star, Headphones, Info } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'PT' | 'EN'>('PT');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col relative pb-safe">
      {/* Side Menu Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className={`absolute right-0 top-0 h-full w-[80vw] max-w-sm glass border-l border-white/10 p-6 md:p-8 transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <Logo size={32} />
            <button onClick={toggleMenu} className="p-3 hover:bg-white/5 rounded-full transition-colors active:scale-95">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-4">
            <button 
              onClick={() => { onNavigate('dj-login'); toggleMenu(); }}
              className="w-full flex items-center gap-4 text-left p-4 hover:bg-white/5 rounded-2xl transition-all group active:bg-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/40 transition-colors">
                <User size={24} className="text-pink-500" />
              </div>
              <div>
                <p className="font-bold text-lg">Área do DJ</p>
                <p className="text-xs text-white/40">Entrar ou Registar</p>
              </div>
            </button>

             <button 
              onClick={() => { onNavigate('rate-service'); toggleMenu(); }}
              className="w-full flex items-center gap-4 text-left p-4 hover:bg-white/5 rounded-2xl transition-all group active:bg-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/40 transition-colors">
                <Star size={24} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-lg">Avaliar Serviço</p>
                <p className="text-xs text-white/40">Classifique o seu DJ</p>
              </div>
            </button>

            <button 
              onClick={() => { onNavigate('about'); toggleMenu(); }}
              className="w-full flex items-center gap-4 text-left p-4 hover:bg-white/5 rounded-2xl transition-all group active:bg-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/40 transition-colors">
                <Info size={24} className="text-green-500" />
              </div>
              <div>
                <p className="font-bold text-lg">Sobre Nós</p>
                <p className="text-xs text-white/40">História e Missão</p>
              </div>
            </button>

            <button 
              onClick={() => { onNavigate('admin-login'); toggleMenu(); }}
              className="w-full flex items-center gap-4 text-left p-4 hover:bg-white/5 rounded-2xl transition-all group active:bg-white/10"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/40 transition-colors">
                <Shield size={24} className="text-sky-400" />
              </div>
              <div>
                <p className="font-bold text-lg">Administração</p>
                <p className="text-xs text-white/40">Acesso restrito</p>
              </div>
            </button>
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
            <p className="text-xs font-bold text-white/40 uppercase mb-4 flex items-center gap-2">
              <Globe size={14} /> Linguagem / Language
            </p>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setLanguage('PT')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${language === 'PT' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                PT
              </button>
              <button 
                onClick={() => setLanguage('EN')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${language === 'EN' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="p-4 md:p-6 flex justify-between items-center border-b border-white/10 glass sticky top-0 z-50">
        <Logo size={32} />
        <button 
          onClick={toggleMenu}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-sm font-bold hidden md:inline">Menu</span>
          <MenuIcon size={24} />
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full">
        <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-7xl font-black mb-2 leading-tight tracking-tight">
            O Teu Evento Merece o <br/>
            <span className="gradient-text">Som Perfeito.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto px-4">
            A app oficial de Angola que conecta organizadores de eventos aos DJs mais talentosos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {/* Card: Client */}
          <div onClick={() => onNavigate('request-dj')} className="glass p-6 md:p-8 rounded-3xl border border-white/10 hover:border-sky-500/50 transition-all cursor-pointer group hover:-translate-y-2 duration-300 relative overflow-hidden active:scale-[0.98]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-all"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Headphones size={28} className="text-sky-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Solicitar DJ</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Encontre o profissional ideal para o seu casamento, festa ou evento corporativo em minutos.
            </p>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm group-hover:gap-4 transition-all">
              Começar Agora <span className="text-xl">→</span>
            </div>
          </div>

          {/* Card: DJ */}
          <div onClick={() => onNavigate('dj-login')} className="glass p-6 md:p-8 rounded-3xl border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group hover:-translate-y-2 duration-300 relative overflow-hidden active:scale-[0.98]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Music size={28} className="text-pink-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Sou DJ Profissional</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Entre na sua conta ou junte-se à maior rede de DJs de Angola.
            </p>
             <div className="flex items-center gap-2 text-pink-500 font-bold text-sm group-hover:gap-4 transition-all">
              Aceder ao Painel <span className="text-xl">→</span>
            </div>
          </div>

           {/* Card: Rate */}
          <div onClick={() => onNavigate('rate-service')} className="glass p-6 md:p-8 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer group hover:-translate-y-2 duration-300 relative overflow-hidden md:col-span-2 lg:col-auto active:scale-[0.98]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star size={28} className="text-yellow-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Avaliar Serviço</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Já contratou um DJ? Deixe a sua opinião e ajude outros utilizadores.
            </p>
             <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm group-hover:gap-4 transition-all">
              Dar Feedback <span className="text-xl">→</span>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="text-2xl md:text-3xl font-black text-sky-400 mb-1">500+</h3>
                <p className="text-[10px] md:text-xs uppercase font-bold text-white/40">DJs Registados</p>
            </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="text-2xl md:text-3xl font-black text-pink-500 mb-1">18</h3>
                <p className="text-[10px] md:text-xs uppercase font-bold text-white/40">Províncias</p>
            </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="text-2xl md:text-3xl font-black text-orange-500 mb-1">24/7</h3>
                <p className="text-[10px] md:text-xs uppercase font-bold text-white/40">Suporte</p>
            </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="text-2xl md:text-3xl font-black text-green-500 mb-1">100%</h3>
                <p className="text-[10px] md:text-xs uppercase font-bold text-white/40">Seguro</p>
            </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/40 py-8 md:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size={24} />
          <p className="text-white/40 text-xs text-center md:text-left">© 2024 DirectDJ Angola. <br className="md:hidden"/>Todos os direitos reservados.</p>
          <div className="flex gap-6 text-xs font-bold">
             <a href="#" className="text-white/40 hover:text-white transition-colors">Termos</a>
             <a href="#" className="text-white/40 hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
