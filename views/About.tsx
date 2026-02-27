
import React from 'react';
import { ArrowLeft, Code, Target, Heart, Sparkles, Globe } from 'lucide-react';
import { Logo } from '../components/Logo';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={20} /> <span className="font-bold">Voltar</span>
        </button>
        <Logo size={32} />
      </header>

      <main className="flex-1 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Mais que uma App,<br/>
            uma <span className="gradient-text">Revolução Sonora.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            A DirectDJ nasceu para transformar a forma como Angola celebra os seus momentos mais importantes.
          </p>
        </div>

        {/* Creator Card */}
        <div className="glass p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[80px] group-hover:bg-sky-500/20 transition-all duration-500"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300">
              <Code size={40} className="text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={12} />
                <span>Mente Criativa</span>
              </div>
              <h2 className="text-3xl font-black">Gil Ernesto</h2>
              <p className="text-white/60 leading-relaxed">
                Desenvolvedor e Visionário. Criou o DirectDJ com o propósito de empoderar artistas locais e facilitar a vida de quem organiza eventos, unindo tecnologia de ponta e paixão pela música.
              </p>
            </div>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl border border-white/10 hover:border-pink-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-500">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">O Nosso Objetivo</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Eliminar a burocracia na contratação de entretenimento. Queremos garantir que cada casamento, festa corporativa ou festival em Angola tenha acesso fácil, seguro e rápido aos melhores DJs do mercado.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
             <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-500">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Impacto Nacional</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Valorizamos a cultura Angolana. Oferecemos uma plataforma onde DJs de todas as províncias, desde Luanda ao Cunene, podem expor o seu talento e gerir as suas carreiras profissionalmente.
            </p>
          </div>
        </div>

      </main>

      <footer className="mt-16 pt-8 border-t border-white/5 text-center space-y-4">
        <p className="flex items-center justify-center gap-2 text-white/40 text-sm font-medium">
          Desenvolvido com <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> em Angola
        </p>
        <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
          Versão 1.0.0 • DirectDJ © 2024
        </p>
      </footer>
    </div>
  );
};
