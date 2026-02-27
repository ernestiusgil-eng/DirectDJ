
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Music, ShieldCheck, Speaker, Info, CreditCard, Search, Banknote, User, CheckCircle2, Sparkles, CalendarX, AlertCircle, Phone, MessageSquare, Truck, Headphones, Check, Calculator } from 'lucide-react';
import { Logo } from '../components/Logo';
import { EventType, DJProfile } from '../types';
import { getAppState, saveAppState } from '../services/mockData';
import { StarRating } from '../components/StarRating';

interface ClientRequestProps {
  onBack: () => void;
}

const ANGOLA_PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
  'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
  'Namibe', 'Uíge', 'Zaire'
];

export const ClientRequest: React.FC<ClientRequestProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [displayedDjs, setDisplayedDjs] = useState<DJProfile[]>([]);
  const [busyDjIds, setBusyDjIds] = useState<string[]>([]);
  const [selectedDj, setSelectedDj] = useState<DJProfile | null>(null);
  const [showSmsSimulation, setShowSmsSimulation] = useState(false);
  
  // Transport State
  const [transportPrice, setTransportPrice] = useState(0);
  const [needsTransport, setNeedsTransport] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    eventType: EventType.Aniversario,
    needsGear: false,
    wantsTransport: false, // New field for Step 1 preference
    province: 'Luanda',
    municipality: '',
    budget: '',
    date: ''
  });

  const handleSearchDJs = (e: React.FormEvent) => {
    e.preventDefault();
    const state = getAppState();
    const budget = Number(formData.budget);

    // 1. Identify Busy DJs for the selected date
    const bookedIds = state.bookings
      .filter(b => b.date === formData.date && b.status !== 'completed')
      .map(b => b.djId || '');
    
    setBusyDjIds(bookedIds);

    // 2. Filter Logic (Budget & Equipment)
    const matched = state.djs.filter(dj => {
      if (dj.status !== 'approved') return false;
      if (formData.needsGear && !dj.hasSoundGear) return false;
      
      const relevantPrice = formData.needsGear ? dj.priceWithGear : dj.priceDjOnly;
      return relevantPrice <= budget;
    });

    // 3. Sort Logic
    matched.sort((a, b) => {
      const isBusyA = bookedIds.includes(a.id);
      const isBusyB = bookedIds.includes(b.id);
      if (isBusyA && !isBusyB) return 1;
      if (!isBusyA && isBusyB) return -1;

      const targetMun = formData.municipality.trim().toLowerCase();
      const targetProv = formData.province;

      const aMun = a.municipality.toLowerCase();
      const bMun = b.municipality.toLowerCase();

      const aMunMatch = targetMun.length > 0 && aMun.includes(targetMun) && a.province === targetProv;
      const bMunMatch = targetMun.length > 0 && bMun.includes(targetMun) && b.province === targetProv;
      const aProvMatch = a.province === targetProv;
      const bProvMatch = b.province === targetProv;

      if (aMunMatch && !bMunMatch) return -1;
      if (!aMunMatch && bMunMatch) return 1;
      if (aProvMatch && !bProvMatch) return -1;
      if (!aProvMatch && bProvMatch) return 1;
      
      return b.rating - a.rating;
    });

    setDisplayedDjs(matched);
    setStep(2);
  };

  const calculateTransportCost = (dj: DJProfile) => {
    const isSameMunicipality = dj.municipality.toLowerCase().includes(formData.municipality.toLowerCase().trim()) && dj.province === formData.province;
    // Avg of 100k-200k = 150k
    // Avg of 300k-600k = 450k
    return isSameMunicipality ? 150000 : 450000;
  };

  const handleSelectDj = (dj: DJProfile) => {
    setSelectedDj(dj);
    
    if (formData.needsGear) {
      if (formData.wantsTransport) {
        // If user already opted for transport in Step 1, calculate and skip to Step 4
        const cost = calculateTransportCost(dj);
        setTransportPrice(cost);
        setNeedsTransport(true);
        setStep(4);
      } else {
        // If they didn't opt in initially, show them the manual choice (Step 3)
        setStep(3);
      }
    } else {
      setTransportPrice(0);
      setNeedsTransport(false);
      setStep(4);
    }
  };

  const handleTransportSelection = (needsVan: boolean) => {
    setNeedsTransport(needsVan);
    if (needsVan && selectedDj) {
        const cost = calculateTransportCost(selectedDj);
        setTransportPrice(cost);
    } else {
        setTransportPrice(0);
    }
    setStep(4);
  };

  const handlePayment = () => {
    if (!selectedDj) return;
    const state = getAppState();
    
    const djPrice = formData.needsGear ? selectedDj.priceWithGear : selectedDj.priceDjOnly;
    const finalPrice = djPrice + transportPrice;
    
    // Commission is 10% of the DJ Service ONLY. 
    // Transport fee goes 100% to the App (Logistics Fund).
    const commission = djPrice * 0.10; 
    
    // Net Amount for DJ = DJ Price - Commission
    // DJ does NOT receive the transport money.
    const netAmount = djPrice - commission;
    
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: formData.clientPhone,
      djId: selectedDj.id,
      djName: selectedDj.artisticName,
      ...formData,
      price: finalPrice, // Total client paid
      transportPrice: transportPrice, // Logistics fund
      budget: Number(formData.budget),
      status: 'paid' as const,
      commission,
      netAmount // What DJ receives
    };

    state.bookings.push(newBooking);
    saveAppState(state);
    setStep(5);

    setTimeout(() => {
        setShowSmsSimulation(true);
        setTimeout(() => setShowSmsSimulation(false), 6000);
    }, 1000);
  };

  const isLocationMatch = (dj: DJProfile, type: 'municipality' | 'province') => {
    const targetMun = formData.municipality.trim().toLowerCase();
    if (type === 'municipality') {
      return targetMun.length > 0 && dj.municipality.toLowerCase().includes(targetMun) && dj.province === formData.province;
    }
    return dj.province === formData.province;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-3xl mx-auto relative">
      {/* SMS Simulation Toast */}
      {showSmsSimulation && selectedDj && (
        <div className="fixed top-4 right-4 z-[200] max-w-sm w-full animate-in slide-in-from-top-4 duration-500">
           <div className="bg-neutral-900 border border-white/10 p-4 rounded-2xl shadow-2xl flex gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <div className="p-2 bg-green-500/20 rounded-full h-fit text-green-500">
                 <MessageSquare size={20} />
              </div>
              <div>
                 <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Simulação: SMS enviado ao DJ</p>
                 <p className="text-xs text-white/80 leading-relaxed">
                    "Olá {selectedDj.artisticName}! Nova reserva confirmada. Contacte o cliente {formData.clientName} ({formData.clientPhone}). A DirectDJ tratará do transporte (se aplicável)."
                 </p>
              </div>
           </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-8 md:mb-12">
        <button onClick={() => step === 1 ? onBack() : setStep(step - 1)} className="flex items-center gap-2 text-white/60 hover:text-white p-2 -ml-2">
          <ArrowLeft size={24} /> <span className="text-lg">Voltar</span>
        </button>
        <Logo size={32} />
      </header>

      {/* STEP 1: EVENT DETAILS & BUDGET */}
      {step === 1 && (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Encontrar DJ</h1>
            <p className="text-white/60 text-sm md:text-base">Preencha os dados para que o DJ possa contactá-lo.</p>
          </div>

          <form onSubmit={handleSearchDJs} className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white/5 p-4 rounded-xl space-y-4 border border-white/5">
                <h3 className="text-sm font-bold text-white/40 uppercase flex items-center gap-2">
                    <User size={14} /> Seus Dados de Contacto
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/80">Seu Nome</label>
                        <input required placeholder="Ex: João Silva" className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                        value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white/80">Seu Telefone</label>
                        <input required type="tel" placeholder="923..." className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                        value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* Event Type & Date */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Music size={18} className="text-sky-400" /> Tipo de Evento
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                  value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value as EventType})}>
                  {Object.values(EventType).map(type => <option key={type} value={type} className="bg-neutral-900">{type}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Calendar size={18} className="text-pink-500" /> Data do Evento
                </label>
                <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <MapPin size={18} className="text-orange-400" /> Província
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                  value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
                  {ANGOLA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov} className="bg-neutral-900">{prov}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                   Município
                </label>
                <input required placeholder="Ex: Talatona" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors text-base"
                  value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} />
              </div>
            </div>

            {/* Gear & Budget */}
            <div className="pt-6 border-t border-white/5 space-y-6">
              <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Speaker size={18} className="text-purple-400" /> Material de Som (Opcional)
                </label>
                
                {/* IMPROVED VISIBILITY: Toggle Cards instead of Select */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => {
                        setFormData({...formData, needsGear: false, wantsTransport: false});
                    }}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col items-center justify-center gap-2 text-center ${!formData.needsGear ? 'bg-sky-500/20 border-sky-500 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60'}`}
                  >
                    <Headphones size={24} className={!formData.needsGear ? 'text-sky-400' : 'text-white/40'} />
                    <span className="font-bold text-sm">Apenas DJ</span>
                    <span className="text-[10px] opacity-60">Leva apenas USB/PC</span>
                  </div>
                  
                  <div 
                    onClick={() => setFormData({...formData, needsGear: true})}
                    className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden ${formData.needsGear ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60'}`}
                  >
                    {formData.needsGear && <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-bl-lg"></div>}
                    <Speaker size={24} className={formData.needsGear ? 'text-purple-400' : 'text-white/40'} />
                    <span className="font-bold text-sm">DJ + Som Completo</span>
                    <span className="text-[10px] opacity-60">Inclui Colunas e Logística</span>
                  </div>
                </div>

                {/* TRANSPORT OPTION IN STEP 1 */}
                {formData.needsGear && (
                    <div 
                        onClick={() => setFormData({...formData, wantsTransport: !formData.wantsTransport})}
                        className={`mt-4 p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 animate-in slide-in-from-top-2 ${formData.wantsTransport ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                        <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-1 transition-colors ${formData.wantsTransport ? 'bg-sky-500 border-sky-500' : 'border-white/40'}`}>
                            {formData.wantsTransport && <Check size={16} className="text-white" />}
                        </div>
                        <div>
                            <h4 className={`font-bold text-sm flex items-center gap-2 ${formData.wantsTransport ? 'text-sky-400' : 'text-white/80'}`}>
                                <Truck size={16} />
                                Adicionar Transporte DirectDJ
                            </h4>
                            <p className="text-xs text-white/60 mt-2 leading-relaxed font-mono">
                                100.000 - 200.000 Akz (Próximo) <br/>
                                300.000 - 600.000 Akz (Distante)
                            </p>
                            <p className="text-[10px] text-white/40 mt-1">A App organiza a logística para si.</p>
                        </div>
                    </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Banknote size={18} className="text-green-400" /> Seu Orçamento (Akz)
                </label>
                <input 
                  type="number" required 
                  min="100000"
                  placeholder="Quanto pode pagar?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors text-base font-mono"
                  value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} 
                />
                <p className="text-[10px] text-white/40">Valor disponível para o serviço</p>
              </div>

               {/* ESTIMATED TOTAL PANEL */}
               <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-white/60 text-sm border-b border-white/5 pb-2">
                        <Calculator size={16} /> Estimativa de Custos
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">Orçamento (Cache DJ)</span>
                        <span className="font-mono">{Number(formData.budget).toLocaleString()} Akz</span>
                    </div>
                    
                    {formData.wantsTransport && (
                        <div className="flex justify-between text-sm text-sky-400">
                            <span>Transporte (Estimado)</span>
                            <span className="font-mono text-xs">100k - 600k Akz</span>
                        </div>
                    )}
                    
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                        <span className="font-bold text-sm">Total a Pagar</span>
                        <span className="font-bold text-lg md:text-xl text-green-400 font-mono">
                            {formData.wantsTransport 
                                ? `${(Number(formData.budget) + 100000).toLocaleString()} - ${(Number(formData.budget) + 600000).toLocaleString()}`
                                : Number(formData.budget).toLocaleString()
                            } <span className="text-sm text-white/40">Akz</span>
                        </span>
                    </div>
                    {formData.wantsTransport && (
                        <p className="text-[10px] text-white/40 text-right">
                            *O valor exato do transporte depende da distância do DJ.
                        </p>
                    )}
                </div>
            </div>

            <button type="submit" className="w-full py-5 gradient-bg rounded-2xl font-black text-xl shadow-2xl shadow-pink-500/30 active:scale-95 transition-transform mt-4 flex items-center justify-center gap-2">
              <Search size={24} /> Procurar DJs Disponíveis
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: SELECT DJ */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
           <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">DJs Encontrados</h1>
            <div className="flex flex-col items-center gap-1">
                <p className="text-white/60 text-sm">
                <span className="text-white">{formData.date}</span> • Orçamento: <span className="text-green-400 font-bold">{Number(formData.budget).toLocaleString()} Akz</span>
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                    {formData.needsGear && (
                        <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Com Som
                        </span>
                    )}
                    {formData.wantsTransport && (
                         <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Com Transporte
                        </span>
                    )}
                </div>
            </div>
          </div>

          <div className="grid gap-4">
            {displayedDjs.length > 0 ? (
              displayedDjs.map((dj, index) => {
                const price = formData.needsGear ? dj.priceWithGear : dj.priceDjOnly;
                const isExactMatch = isLocationMatch(dj, 'municipality');
                const isProvMatch = isLocationMatch(dj, 'province');
                const isBusy = busyDjIds.includes(dj.id);

                return (
                  <div key={dj.id} className={`glass p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all group relative overflow-hidden ${isBusy ? 'opacity-60 grayscale border-white/5 bg-white/[0.02]' : isExactMatch ? 'border-sky-500/50 shadow-lg shadow-sky-500/10' : 'border-white/10 hover:border-white/30'}`}>
                    
                    {/* Visual Badges */}
                    <div className="absolute top-0 right-0 flex flex-col items-end">
                      {isBusy ? (
                        <div className="bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                          <CalendarX size={10} /> Indisponível na Data
                        </div>
                      ) : isExactMatch ? (
                         <div className="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                            <Sparkles size={10} /> Melhor Localização
                         </div>
                      ) : index === 0 && (
                        <div className="bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                           <CheckCircle2 size={10} /> Sugestão DirectDJ
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shrink-0 ${isBusy ? 'bg-white/10' : 'gradient-bg'}`}>
                        {dj.artisticName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {dj.artisticName}
                            {!isBusy && <StarRating rating={dj.rating} size={12} />}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-white/40 mb-2">{dj.fullName}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded border ${isExactMatch && !isBusy ? 'bg-sky-500/20 text-sky-400 border-sky-500/30 font-bold' : isProvMatch ? 'bg-white/10 text-white/60 border-white/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                             <MapPin size={10} /> {dj.municipality}, {dj.province}
                          </span>
                          
                          {formData.needsGear && (
                            <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <Speaker size={10} /> Inclui Som
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t border-white/5 md:border-none pt-4 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-white/40 uppercase font-bold">Valor do Cache</p>
                        <p className={`text-xl font-mono font-bold ${isBusy ? 'text-white/40 decoration-line-through' : 'text-green-400'}`}>{price.toLocaleString()} Akz</p>
                      </div>
                      <button 
                        onClick={() => !isBusy && handleSelectDj(dj)}
                        disabled={isBusy}
                        className={`px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex flex-col items-center justify-center ${
                          isBusy 
                            ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                            : isExactMatch 
                              ? 'gradient-bg shadow-lg shadow-sky-500/20' 
                              : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <span>{isBusy ? 'Ocupado' : 'Selecionar'}</span>
                        {/* Show Next Step Hint */}
                        {!isBusy && formData.needsGear && !formData.wantsTransport && (
                             <span className="text-[8px] opacity-80 font-normal block -mt-1">+ Transporte</span>
                        )}
                         {!isBusy && formData.needsGear && formData.wantsTransport && (
                             <span className="text-[8px] opacity-80 font-normal block -mt-1">Pagar Agora</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 glass rounded-3xl border border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nenhum DJ Encontrado</h3>
                <p className="text-white/60 max-w-sm mx-auto mb-6">
                  Não encontramos DJs com equipamento (se solicitado) dentro deste orçamento.
                </p>
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-white/10 rounded-xl font-bold">
                  Tentar outro valor
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: TRANSPORT LOGISTICS (ONLY IF GEAR IS SELECTED AND TRANSPORT NOT SELECTED IN STEP 1) */}
      {step === 3 && selectedDj && (
        <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500">
           <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                <Truck className="text-sky-400" size={32} />
                Logística e Transporte
            </h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Como escolheu a opção <span className="text-purple-400 font-bold">Com Som</span>, precisamos saber como o equipamento chegará ao local.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option A: Client has transport */}
            <div 
                onClick={() => handleTransportSelection(false)}
                className="glass p-8 rounded-3xl border border-white/10 hover:border-green-500/50 cursor-pointer group active:scale-[0.98] transition-all relative overflow-hidden flex flex-col items-center text-center"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl group-hover:bg-green-500/20 transition-all"></div>
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-500 shadow-xl shadow-green-500/10">
                    <Truck size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Sem Transporte</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    (Eu tenho transporte).<br/> O cliente responsabiliza-se por levar o DJ e o equipamento.
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 w-full">
                    <p className="text-green-400 font-bold font-mono text-xl">0,00 Akz</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Custo Adicional</p>
                </div>
            </div>

            {/* Option B: Need transport */}
            <div 
                onClick={() => handleTransportSelection(true)}
                className="glass p-8 rounded-3xl border border-sky-500/30 hover:border-sky-500 cursor-pointer group active:scale-[0.98] transition-all relative overflow-hidden flex flex-col items-center text-center bg-sky-500/5"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-all"></div>
                <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center mb-6 text-sky-500 shadow-xl shadow-sky-500/10">
                    <Truck size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Com Transporte</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Solicitar carrinha da DirectDJ para levar o equipamento até ao evento.
                </p>
                
                {/* Dynamic Price Preview Logic */}
                {(() => {
                    const cost = calculateTransportCost(selectedDj);
                    const isClose = cost < 200000;
                    return (
                        <div className="mt-auto pt-4 border-t border-white/5 w-full">
                            <p className="text-sky-400 font-bold font-mono text-xl">
                                + {cost.toLocaleString()} Akz
                            </p>
                            <p className="text-[10px] text-white/40 uppercase font-bold">
                                {isClose ? 'Taxa Próxima (100k - 200k)' : 'Taxa Distante (300k - 600k)'}
                            </p>
                        </div>
                    );
                })()}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRM & PAY */}
      {step === 4 && selectedDj && (
        <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Confirmar Contratação</h1>
            <p className="text-white/60 text-sm">Pagamento seguro com split automático.</p>
          </div>

          <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 flex justify-between items-center">
                <span>Detalhes do Serviço</span>
                <span className="text-xs font-normal bg-sky-500/10 text-sky-400 px-2 py-1 rounded">Ref: #PENDING</span>
              </h3>
              
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                 <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-bold text-lg">
                    {selectedDj.artisticName[0]}
                 </div>
                 <div>
                    <p className="text-xs text-white/40 uppercase font-bold">DJ Selecionado</p>
                    <p className="font-bold text-lg">{selectedDj.artisticName}</p>
                 </div>
              </div>

              <div className="space-y-2 text-white/80 text-sm md:text-base pt-2">
                <div className="flex justify-between"><span>Cliente</span> <span className="font-medium text-white">{formData.clientName}</span></div>
                <div className="flex justify-between"><span>Contacto</span> <span className="font-medium text-white">{formData.clientPhone}</span></div>
                <div className="flex justify-between"><span>Evento</span> <span className="font-medium text-white">{formData.eventType}</span></div>
                <div className="flex justify-between"><span>Data</span> <span className="font-medium text-white">{formData.date}</span></div>
                <div className="flex justify-between"><span>Local</span> <span className="font-medium text-white">{formData.municipality}, {formData.province}</span></div>
                <div className="flex justify-between"><span>Origem do DJ</span> <span className="font-medium text-sky-400">{selectedDj.municipality}, {selectedDj.province}</span></div>
                <div className="flex justify-between"><span>Material</span> <span className="font-medium text-white">{formData.needsGear ? 'Sim (Incluído)' : 'Não'}</span></div>
                
                {formData.needsGear && (
                    <div className="flex justify-between">
                        <span>Logística</span> 
                        <span className={`font-medium ${transportPrice > 0 ? 'text-sky-400' : 'text-green-400'}`}>
                            {transportPrice > 0 ? 'Com Transporte (App)' : 'Sem Transporte (Cliente)'}
                        </span>
                    </div>
                )}
                
                <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-white/60">
                        <span>Serviço DJ</span>
                        <span>{(formData.needsGear ? selectedDj.priceWithGear : selectedDj.priceDjOnly).toLocaleString('pt-AO')} Akz</span>
                    </div>
                    {transportPrice > 0 && (
                        <div className="flex justify-between text-sm text-sky-400 bg-sky-500/5 px-2 py-1 rounded">
                            <span>Taxa de Transporte (Logística)</span>
                            <span>{transportPrice.toLocaleString('pt-AO')} Akz</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-xl pt-2">
                    <span>Total a Pagar</span>
                    <span className="text-green-400 font-mono">
                        {(
                            (formData.needsGear ? selectedDj.priceWithGear : selectedDj.priceDjOnly) + transportPrice
                        ).toLocaleString('pt-AO')} Akz
                    </span>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="text-green-500 shrink-0" />
                    <p className="text-xs md:text-sm text-green-200 font-bold">
                    Distribuição Segura do Pagamento
                    </p>
                </div>
                <div className="text-[10px] md:text-xs text-green-200/60 pl-10 space-y-1">
                   <p>• DJ Recebe: <span className="text-white">90% do Cache</span></p>
                   <p>• Conta DirectDJ: <span className="text-white">Transporte + 10% Comissão</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-sky-500 bg-sky-500/10 rounded-xl font-bold flex flex-col items-center gap-2 active:scale-95 transition-transform">
                  <CreditCard size={24} className="text-sky-400"/>
                  <span className="text-xs text-center">Multicaixa Express</span>
                </button>
                <button className="p-4 border border-white/10 bg-white/5 rounded-xl font-bold opacity-50 cursor-not-allowed flex flex-col items-center gap-2">
                  <Banknote size={24} />
                  <span className="text-xs text-center">Transferência</span>
                </button>
              </div>
            </div>

            <button onClick={handlePayment} className="w-full py-4 gradient-bg rounded-xl font-bold text-lg shadow-lg shadow-pink-500/20">
              Pagar e Confirmar
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS */}
      {step === 5 && selectedDj && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black">Pagamento Confirmado!</h1>
            <p className="text-lg md:text-xl text-white/60">
              Notificação enviada. <span className="text-white font-bold">{selectedDj.artisticName}</span> recebeu os seus dados.
            </p>
            
            <div className="glass p-6 rounded-2xl w-full max-w-sm mx-auto space-y-3 text-left">
              <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                <span className="text-white/40">ID Transação</span>
                <span className="font-mono">#TX-{Math.floor(Math.random() * 999999)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Total Pago</span>
                <span className="text-white font-bold">
                   {(
                     (formData.needsGear ? selectedDj.priceWithGear : selectedDj.priceDjOnly) + transportPrice
                   ).toLocaleString('pt-AO')} Akz
                </span>
              </div>
               {transportPrice > 0 && (
                   <div className="text-[10px] text-center text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded p-2 mt-2">
                       <p className="font-bold">Nota de Logística:</p>
                       A DirectDJ gere os {transportPrice.toLocaleString()} Akz para contratar a carrinha.
                   </div>
               )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl max-w-sm mx-auto flex items-center gap-3 border border-white/10">
                <Phone size={24} className="text-green-500" />
                <p className="text-sm text-left text-white/60">
                    Enviámos um SMS para o DJ com o seu número <span className="text-white font-bold">({formData.clientPhone})</span>. Aguarde o contacto dele.
                </p>
            </div>
          </div>
          <button onClick={onBack} className="w-full md:w-auto px-12 py-4 gradient-bg rounded-2xl font-bold">Voltar ao Início</button>
        </div>
      )}
    </div>
  );
};
