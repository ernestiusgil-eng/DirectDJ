
import React, { useState } from 'react';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Music } from 'lucide-react';
import { Logo } from '../components/Logo';
import { getAppState } from '../services/mockData';
import { DJProfile } from '../types';

interface DJLoginProps {
  onBack: () => void;
  onLoginSuccess: (dj: DJProfile) => void;
  onRegisterClick: () => void;
}

export const DJLogin: React.FC<DJLoginProps> = ({ onBack, onLoginSuccess, onRegisterClick }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
        const state = getAppState();
        const dj = state.djs.find(d => d.phoneNumber === phone && d.password === password);

        if (dj) {
            onLoginSuccess(dj);
        } else {
            setError('Credenciais inválidas. Verifique o número e a senha.');
            setIsLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 max-w-md mx-auto">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="text-center mb-8">
        <Logo className="justify-center mb-6" size={60} />
        <h1 className="text-3xl font-bold mb-2">Área do DJ</h1>
        <p className="text-white/60">Entre para gerir a sua carreira.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl -z-10"></div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase flex items-center gap-2">
                <Phone size={14} /> Número de Telefone
            </label>
            <input 
                type="tel" required
                placeholder="923..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500 transition-colors text-base"
                value={phone} onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase flex items-center gap-2">
                <Lock size={14} /> Senha
            </label>
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} required
                    placeholder="Sua senha secreta"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500 transition-colors text-base"
                    value={password} onChange={e => setPassword(e.target.value)}
                />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-white/40 hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
              </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 gradient-bg rounded-xl font-bold text-lg shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? 'A entrar...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-white/60 mb-3">Ainda não tem conta?</p>
            <button 
                onClick={onRegisterClick}
                className="text-pink-500 font-bold hover:text-pink-400 flex items-center justify-center gap-2 mx-auto"
            >
                <Music size={16} /> Registar como DJ
            </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-white/20">
         <p>Esqueceu a senha? Contacte o suporte.</p>
      </div>
    </div>
  );
};
