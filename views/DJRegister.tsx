
import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText, Banknote, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';
import { getAppState, saveAppState } from '../services/mockData';
import { DJProfile } from '../types';

interface DJRegisterProps {
  onBack: () => void;
}

const ANGOLA_PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
  'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
  'Namibe', 'Uíge', 'Zaire'
];

export const DJRegister: React.FC<DJRegisterProps> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [errors, setErrors] = useState<{ iban?: string; price?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    artisticName: '',
    idNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    province: 'Luanda',
    municipality: '',
    iban: '',
    hasSoundGear: false,
    priceDjOnly: '',
    priceWithGear: ''
  });

  const MIN_PRICE = 100000;
  const MAX_PRICE = 25000000;

  const validateIBAN = (iban: string) => {
    const ibanRegex = /^AO06\d{21}$/;
    if (!iban) return "O IBAN é obrigatório.";
    if (!iban.startsWith('AO06')) return "O IBAN deve começar com AO06.";
    if (iban.length !== 25) return `O IBAN deve ter 25 caracteres (Faltam ${25 - iban.length}).`;
    if (!ibanRegex.test(iban)) return "O IBAN deve conter apenas números após o prefixo AO06.";
    return null;
  };

  const handleIBANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    setFormData({ ...formData, iban: value });
    const error = validateIBAN(value);
    setErrors(prev => ({ ...prev, iban: error || undefined }));
  };

  const validatePrices = () => {
    const djOnly = Number(formData.priceDjOnly);
    if (isNaN(djOnly) || djOnly < MIN_PRICE || djOnly > MAX_PRICE) {
      return `O cache (Apenas DJ) deve estar entre ${MIN_PRICE.toLocaleString()} e ${MAX_PRICE.toLocaleString()} Akz.`;
    }

    if (formData.hasSoundGear) {
      const withGear = Number(formData.priceWithGear);
      if (isNaN(withGear) || withGear < MIN_PRICE || withGear > MAX_PRICE) {
        return `O cache (Com Som) deve estar entre ${MIN_PRICE.toLocaleString()} e ${MAX_PRICE.toLocaleString()} Akz.`;
      }
      if (withGear <= djOnly) {
        return "O valor com som deve ser superior ao valor apenas DJ.";
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Passwords
    if (formData.password.length < 6) {
        setErrors(prev => ({ ...prev, password: "A senha deve ter pelo menos 6 caracteres." }));
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, password: "As senhas não coincidem." }));
        return;
    }

    const ibanError = validateIBAN(formData.iban);
    const priceError = validatePrices();

    if (ibanError || priceError) {
      setErrors({ iban: ibanError || undefined, price: priceError || undefined });
      return;
    }

    const generatedRef = `DJ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setRefId(generatedRef);

    const state = getAppState();
    
    // Check if phone already exists
    if (state.djs.some(dj => dj.phoneNumber === formData.phoneNumber)) {
        alert("Este número de telefone já está registado.");
        return;
    }

    const newDJ: DJProfile = {
      ...formData,
      priceDjOnly: Number(formData.priceDjOnly),
      priceWithGear: formData.hasSoundGear ? Number(formData.priceWithGear) : 0,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      rating: 0,
      reviewCount: 0
    };
    state.djs.push(newDJ);
    saveAppState(state);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-in zoom-in duration-500">
        <div className="glass p-8 md:p-12 rounded-[2rem] max-w-2xl w-full border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl -z-10"></div>
          
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-4xl font-black">Candidatura Recebida!</h2>
            <p className="text-xl text-white/80">
              Parabéns, <span className="text-sky-400 font-bold">{formData.artisticName}</span>. <br/>O teu perfil foi enviado para análise.
            </p>
            <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-white/40">
              Ref ID: {refId}
            </div>
            <p className="text-sm text-white/60">
                Use o seu número de telefone e a senha criada para entrar no painel após aprovação.
            </p>
          </div>
          <div className="pt-4">
            <button onClick={onBack} className="w-full py-5 gradient-bg rounded-2xl font-black text-lg shadow-xl shadow-pink-500/20 active:scale-95 transition-all">
              Voltar à Página Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-8">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="mb-10 text-center">
        <Logo className="justify-center mb-6" size={60} />
        <h1 className="text-3xl font-bold">Torne-se um DJ Oficial</h1>
        <p className="text-white/60">Crie a sua conta, defina o valor e receba propostas.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-3xl border border-white/10">
        
        {/* Account Credentials */}
        <div className="space-y-4 pb-6 border-b border-white/10">
            <h3 className="font-bold flex items-center gap-2 text-sky-400">
                <Lock size={18} /> Dados de Acesso
            </h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Telefone (Login)</label>
                    <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                    placeholder="923..."
                    value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Senha</label>
                    <div className="relative">
                        <input 
                            required 
                            type={showPassword ? "text" : "password"} 
                            className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-sky-500`}
                            placeholder="Criar senha"
                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-white/40 hover:text-white">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-white/60">Confirmar Senha</label>
                    <input 
                        required 
                        type="password" 
                        className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-sky-500`}
                        placeholder="Repetir senha"
                        value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password}</p>
                    )}
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Nome Completo</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500" 
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Nome Artístico</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
              value={formData.artisticName} onChange={e => setFormData({...formData, artisticName: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Bilhete de Identidade (Nº BI)</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
              value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
        </div>

        {/* Location Fields */}
        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/60">
              <MapPin size={16} className="text-orange-400" /> Província de Residência
            </label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors"
              value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
              {ANGOLA_PROVINCES.map((prov) => (
                <option key={prov} value={prov} className="bg-neutral-900">{prov}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/60">
               Município
            </label>
            <input required placeholder="Ex: Talatona" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors"
              value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/5">
          <label className="text-sm font-medium text-white/60">IBAN para Recebimento (25 dígitos)</label>
          <div className="relative">
            <input required placeholder="AO06..." className={`w-full bg-white/5 border ${errors.iban ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-sky-500 font-mono transition-colors uppercase`}
              value={formData.iban} onChange={handleIBANChange} maxLength={25} />
            {errors.iban && (
              <div className="flex items-center gap-1 mt-2 text-red-400 text-xs animate-in slide-in-from-top-1">
                <AlertCircle size={12} /> <span>{errors.iban}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-6">
           <h3 className="font-bold flex items-center gap-2">
            <Banknote size={18} className="text-green-400" /> Definição de Preços (Cache)
          </h3>
          <p className="text-xs text-white/40 -mt-4">
             Defina quanto cobra por evento. O valor deve estar entre 100.000 Akz e 25.000.000 Akz.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Cache Apenas DJ (Sem Som)</label>
              <div className="relative">
                <input 
                  type="number" required 
                  min={MIN_PRICE} max={MAX_PRICE}
                  placeholder="Ex: 150000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 font-mono"
                  value={formData.priceDjOnly} onChange={e => setFormData({...formData, priceDjOnly: e.target.value})} 
                />
                <span className="absolute right-4 top-3 text-white/20 text-sm">Akz</span>
              </div>
            </div>

             <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/60">Cache com Som Completo</label>
                <div className="flex items-center gap-2">
                   <input type="checkbox" id="gear" className="w-4 h-4 rounded accent-sky-500" 
                    checked={formData.hasSoundGear} onChange={e => setFormData({...formData, hasSoundGear: e.target.checked})} />
                   <label htmlFor="gear" className="text-xs cursor-pointer select-none text-sky-400">Tenho Som</label>
                </div>
              </div>
              
              <div className="relative">
                <input 
                  type="number" 
                  required={formData.hasSoundGear}
                  disabled={!formData.hasSoundGear}
                  min={MIN_PRICE} max={MAX_PRICE}
                  placeholder={formData.hasSoundGear ? "Ex: 300000" : "Não aplicável"}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 font-mono ${!formData.hasSoundGear ? 'opacity-30 cursor-not-allowed' : ''}`}
                  value={formData.priceWithGear} onChange={e => setFormData({...formData, priceWithGear: e.target.value})} 
                />
                <span className="absolute right-4 top-3 text-white/20 text-sm">Akz</span>
              </div>
            </div>
          </div>
          
          {errors.price && (
            <div className="flex items-center gap-1 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-in slide-in-from-top-1">
              <AlertCircle size={14} /> <span>{errors.price}</span>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <FileText size={18} className="text-sky-400" /> Documentação
            </h3>
            <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/60">Opcional</span>
          </div>
          
          <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.png" />
            <Upload className="mx-auto mb-2 text-white/40 group-hover:text-white" />
            <p className="text-xs text-white/40">Anexar Carteira Profissional (PDF/PNG)</p>
            <p className="text-[10px] text-white/20 mt-2">Se não tiver agora, pode enviar depois no seu perfil.</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!!errors.iban || !!errors.password}
          className={`w-full py-4 gradient-bg rounded-xl font-bold text-lg shadow-xl shadow-pink-500/20 active:scale-95 transition-all mt-8 ${!!errors.iban || !!errors.password ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          Submeter Registo
        </button>
      </form>
    </div>
  );
};
