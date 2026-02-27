
import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Users, CreditCard, LogOut, Check, X, ShieldAlert, Search, Filter, Trash2, AlertTriangle, TrendingUp, DollarSign, PieChart, Calendar, Download, Eye, User, Phone, Hash, FileText, Music, Info, Maximize2, ExternalLink, Settings, Lock, Menu, MapPin, Truck, Navigation, LocateFixed, Radio } from 'lucide-react';
import { Logo } from '../components/Logo';
import { StarRating } from '../components/StarRating';
import { getAppState, saveAppState, updateAdminSettings } from '../services/mockData';
import { DJProfile } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface MediaViewer {
  type: 'image' | 'document';
  url?: string;
  title: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'djs' | 'finance' | 'settings' | 'locator'>('djs');
  const [state, setState] = useState(getAppState());
  const [djToDelete, setDjToDelete] = useState<DJProfile | null>(null);
  const [selectedDJForDetails, setSelectedDJForDetails] = useState<DJProfile | null>(null);
  const [viewingMedia, setViewingMedia] = useState<MediaViewer | null>(null);

  // Locator State
  const [locatorSearch, setLocatorSearch] = useState('');
  const [locatedDJ, setLocatedDJ] = useState<DJProfile | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Settings State
  const [newAdminEmail, setNewAdminEmail] = useState(state.adminSettings.email);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // DJ Filter states
  const [filterArtisticName, setFilterArtisticName] = useState('');
  const [filterFullName, setFilterFullName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Finance Filter states
  const [financeSearch, setFinanceSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleLocateDJ = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLocating(true);
    setLocatedDJ(null);
    
    // Simulate network delay
    setTimeout(() => {
      const found = state.djs.find(d => d.phoneNumber.includes(locatorSearch) || d.artisticName.toLowerCase().includes(locatorSearch.toLowerCase()));
      setLocatedDJ(found || null);
      setIsLocating(false);
    }, 1500);
  };

  const handleApproveDJ = (id: string) => {
    const newState = { ...state };
    const dj = newState.djs.find(d => d.id === id);
    if (dj) dj.status = 'approved';
    saveAppState(newState);
    setState(newState);
  };

  const handleRejectDJ = (id: string) => {
    const newState = { ...state };
    const dj = newState.djs.find(d => d.id === id);
    if (dj) dj.status = 'rejected';
    saveAppState(newState);
    setState(newState);
  };

  const handleDeleteDJ = () => {
    if (!djToDelete) return;
    const newState = { ...state };
    newState.djs = newState.djs.filter(d => d.id !== djToDelete.id);
    saveAppState(newState);
    setState(newState);
    setDjToDelete(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminEmail && newAdminPassword) {
        updateAdminSettings(newAdminEmail, newAdminPassword);
        const updatedState = getAppState();
        setState(updatedState);
        setSettingsSaved(true);
        setNewAdminPassword(''); // Clear password field for security
        setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  const filteredDJs = useMemo(() => {
    return state.djs.filter(dj => {
      const matchesArtistic = dj.artisticName.toLowerCase().includes(filterArtisticName.toLowerCase());
      const matchesFull = dj.fullName.toLowerCase().includes(filterFullName.toLowerCase());
      const matchesStatus = filterStatus === 'all' || dj.status === filterStatus;
      return matchesArtistic && matchesFull && matchesStatus;
    });
  }, [state.djs, filterArtisticName, filterFullName, filterStatus]);

  const filteredBookings = useMemo(() => {
    return state.bookings.filter(b => {
      const matchesSearch = b.eventType.toLowerCase().includes(financeSearch.toLowerCase()) ||
        b.municipality.toLowerCase().includes(financeSearch.toLowerCase()) ||
        b.province.toLowerCase().includes(financeSearch.toLowerCase());
      
      const matchesStartDate = startDate ? b.date >= startDate : true;
      const matchesEndDate = endDate ? b.date <= endDate : true;

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [state.bookings, financeSearch, startDate, endDate]);

  const totalProcessed = filteredBookings.reduce((acc, b) => acc + b.price, 0);
  const totalCommission = filteredBookings.reduce((acc, b) => acc + b.commission, 0);
  const totalLogistics = filteredBookings.reduce((acc, b) => acc + (b.transportPrice || 0), 0);
  const totalDJPayout = filteredBookings.reduce((acc, b) => acc + b.netAmount, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-950 pb-20 md:pb-0">
      {/* Media Viewer Modal */}
      {viewingMedia && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setViewingMedia(null)}></div>
          <div className="relative glass w-full max-w-5xl h-full max-h-[85vh] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <header className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  {viewingMedia.type === 'document' ? <FileText className="text-sky-400" /> : <Music className="text-pink-500" />}
                </div>
                <h3 className="font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">{viewingMedia.title}</h3>
              </div>
              <button onClick={() => setViewingMedia(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-white/60" />
              </button>
            </header>
            <div className="flex-1 bg-neutral-900 flex items-center justify-center p-4 md:p-8 overflow-auto">
              {viewingMedia.url ? (
                viewingMedia.type === 'image' ? (
                  <img src={viewingMedia.url} alt={viewingMedia.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                ) : (
                  <iframe src={viewingMedia.url} className="w-full h-full rounded-lg border-0 bg-white" title="Document Preview" />
                )
              ) : (
                <div className="text-center space-y-4 max-w-xs">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto">
                    <AlertTriangle size={40} className="text-white/20" />
                  </div>
                  <p className="text-white/40 font-medium">O ficheiro original não está disponível nesta versão de demonstração.</p>
                </div>
              )}
            </div>
            <footer className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex flex-col md:flex-row justify-end gap-4">
               <button onClick={() => setViewingMedia(null)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all w-full md:w-auto">Fechar</button>
               <button className="px-6 py-3 gradient-bg rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all w-full md:w-auto">
                 <Download size={18} /> Descarregar
               </button>
            </footer>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {djToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDjToDelete(null)}></div>
          <div className="glass p-8 rounded-3xl max-w-md w-full border border-white/10 relative shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold">Remover DJ?</h2>
              <p className="text-white/60">
                Tem certeza que deseja remover <span className="text-white font-bold">{djToDelete.artisticName}</span>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4 w-full pt-4">
                <button 
                  onClick={() => setDjToDelete(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors">
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteDJ}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DJ Details Modal (Full Screen on Mobile) */}
      {selectedDJForDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center md:p-6">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedDJForDetails(null)}></div>
          <div className="glass bg-neutral-900 md:bg-transparent rounded-none md:rounded-[2.5rem] w-full max-w-4xl h-full md:h-auto max-h-screen md:max-h-[90vh] border-none md:border border-white/10 relative shadow-2xl animate-in zoom-in duration-300 overflow-hidden flex flex-col">
            <header className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 safe-top">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full gradient-bg flex items-center justify-center font-black text-xl md:text-2xl shadow-xl shrink-0">
                  {selectedDJForDetails.artisticName[0]}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black">{selectedDJForDetails.artisticName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-white/40 text-xs md:text-sm">Perfil Completo</p>
                    <span className="text-white/20">•</span>
                    <StarRating rating={selectedDJForDetails.rating} count={selectedDJForDetails.reviewCount} showCount={true} size={12} />
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDJForDetails(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-white/40" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal & Professional Info */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 flex items-center gap-2">
                    <User size={14} /> Dados Pessoais
                  </h3>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Nome Completo</p>
                      <p className="font-medium text-sm md:text-base">{selectedDJForDetails.fullName}</p>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                      <MapPin className="text-orange-400" size={20} />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Localização</p>
                        <p className="font-medium text-sm md:text-base">{selectedDJForDetails.municipality}, {selectedDJForDetails.province}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Bilhete de Identidade (BI)</p>
                      <p className="font-medium font-mono text-sm md:text-base">{selectedDJForDetails.idNumber}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Telefone</p>
                        <p className="font-medium text-sm md:text-base">{selectedDJForDetails.phoneNumber}</p>
                      </div>
                      <a href={`tel:${selectedDJForDetails.phoneNumber}`} className="p-2 bg-white/10 rounded-full">
                         <Phone size={18} className="text-white/60" />
                      </a>
                    </div>
                  </div>
                </section>

                {/* Finance Section */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                    <CreditCard size={14} /> Dados Bancários e Cache
                  </h3>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-1">IBAN de Recebimento</p>
                      <p className="font-medium font-mono break-all text-sm">{selectedDJForDetails.iban}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Cache (Sem Som)</p>
                          <p className="font-medium text-green-400">{selectedDJForDetails.priceDjOnly.toLocaleString()} Akz</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Cache (Com Som)</p>
                          <p className="font-medium text-green-400">{selectedDJForDetails.priceWithGear > 0 ? selectedDJForDetails.priceWithGear.toLocaleString() + ' Akz' : '-'}</p>
                        </div>
                     </div>
                    <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-sky-400/60 uppercase font-bold mb-1">Status da Conta</p>
                          <p className="text-sm font-bold capitalize text-sky-400">{selectedDJForDetails.status}</p>
                        </div>
                        <Info size={18} className="text-sky-400/40" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Documents & Gear */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500 flex items-center gap-2">
                  <FileText size={14} /> Documentação
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500">
                        <FileText size={18} />
                      </div>
                      <p className="font-bold text-sm">Carteira Profissional</p>
                    </div>
                    <button 
                      onClick={() => setViewingMedia({ type: 'document', url: selectedDJForDetails.professionalCardUrl, title: 'Carteira Profissional' })}
                      className="w-full py-3 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <Maximize2 size={14} /> Visualizar Documento
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                          <Music size={18} />
                        </div>
                        <p className="font-bold text-sm">Material de Som</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${selectedDJForDetails.hasSoundGear ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {selectedDJForDetails.hasSoundGear ? 'POSSUI' : 'NÃO POSSUI'}
                      </span>
                    </div>
                    {selectedDJForDetails.hasSoundGear && (
                         <button 
                           onClick={() => setViewingMedia({ type: 'image', url: selectedDJForDetails.gearImageUrl, title: 'Equipamento de Som' })}
                           className="w-full py-3 bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                           <Eye size={14} /> Ver Equipamento
                         </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
            
            <footer className="p-6 md:p-8 border-t border-white/10 bg-black/20 flex flex-col md:flex-row gap-4 safe-bottom">
              {selectedDJForDetails.status === 'pending' && (
                <>
                  <button onClick={() => { handleApproveDJ(selectedDJForDetails.id); setSelectedDJForDetails(null); }} className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-600/20">Aprovar Candidatura</button>
                  <button onClick={() => { handleRejectDJ(selectedDJForDetails.id); setSelectedDJForDetails(null); }} className="flex-1 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold rounded-2xl transition-all border border-red-500/20">Rejeitar</button>
                </>
              )}
              {selectedDJForDetails.status !== 'pending' && (
                <button onClick={() => setSelectedDJForDetails(null)} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all">Fechar Detalhes</button>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-white/10 glass p-8 flex-col sticky top-0 h-screen">
        <Logo size={32} className="mb-12" />
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('djs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'djs' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:bg-white/5'}`}>
            <Users size={20} /> DJs Registados
          </button>
          <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'finance' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:bg-white/5'}`}>
            <CreditCard size={20} /> Histórico Financeiro
          </button>
          <button onClick={() => setActiveTab('locator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'locator' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:bg-white/5'}`}>
            <LocateFixed size={20} /> Localizador GPS
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:bg-white/5'}`}>
            <Settings size={20} /> Configurações
          </button>
        </nav>
        <div className="pt-8 mt-auto border-t border-white/10">
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full glass border-t border-white/10 flex justify-around p-2 pb-safe z-50 bg-black/90 backdrop-blur-xl">
        <button onClick={() => setActiveTab('djs')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'djs' ? 'text-sky-400' : 'text-white/40'}`}>
          <Users size={24} />
          <span className="text-[10px] font-bold">DJs</span>
        </button>
        <button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'finance' ? 'text-sky-400' : 'text-white/40'}`}>
          <CreditCard size={24} />
           <span className="text-[10px] font-bold">Finanças</span>
        </button>
        <button onClick={() => setActiveTab('locator')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'locator' ? 'text-sky-400' : 'text-white/40'}`}>
          <LocateFixed size={24} />
           <span className="text-[10px] font-bold">GPS</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'settings' ? 'text-sky-400' : 'text-white/40'}`}>
          <Settings size={24} />
           <span className="text-[10px] font-bold">Config</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center gap-1 p-2 rounded-xl text-red-400 opacity-60">
          <LogOut size={24} />
           <span className="text-[10px] font-bold">Sair</span>
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
             <h1 className="text-2xl md:text-3xl font-black">
              {activeTab === 'djs' ? 'Gestão de DJs' : activeTab === 'finance' ? 'Finanças' : 'Configurações'}
            </h1>
            <div className="md:hidden">
              <Logo size={24} />
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs w-full md:w-auto">
            <ShieldAlert size={14} className="text-orange-400 shrink-0" />
            <span className="truncate">Painel de Segurança Activo</span>
          </div>
        </header>

        {activeTab === 'locator' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Search Panel */}
                <div className="w-full md:w-1/3 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Radio className="text-orange-500 animate-pulse" /> Rastreio GPS
                    </h2>
                    <p className="text-sm text-white/40">Localize um DJ pelo número de telefone ou nome artístico em caso de litígio.</p>
                  </div>

                  <form onSubmit={handleLocateDJ} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 uppercase">Número ou Nome</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required 
                          placeholder="Ex: 923000111" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-orange-500 transition-colors"
                          value={locatorSearch} 
                          onChange={(e) => setLocatorSearch(e.target.value)} 
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLocating}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                      {isLocating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Localizando...
                        </>
                      ) : (
                        <>
                          <LocateFixed size={18} /> Localizar DJ
                        </>
                      )}
                    </button>
                  </form>

                  {/* Recent/Quick List could go here */}
                </div>

                {/* Map/Result Panel */}
                <div className="w-full md:w-2/3 bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative min-h-[400px] flex flex-col">
                  {locatedDJ ? (
                    <>
                      {/* Map Visualization (Mock) */}
                      <div className="flex-1 relative bg-[#0f172a] overflow-hidden group">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        
                        {/* Radar Scan Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-scan pointer-events-none"></div>

                        {/* Map Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                          <div className="relative">
                            <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-4 h-4 bg-orange-500 rounded-full relative z-10 border-2 border-white shadow-[0_0_20px_rgba(249,115,22,0.6)]"></div>
                          </div>
                          <div className="mt-2 bg-black/80 backdrop-blur px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold whitespace-nowrap">
                            {locatedDJ.artisticName}
                          </div>
                        </div>

                        {/* Coordinates Overlay */}
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 text-[10px] font-mono text-white/60">
                          <p>LAT: {locatedDJ.currentLocation?.lat.toFixed(6)}</p>
                          <p>LNG: {locatedDJ.currentLocation?.lng.toFixed(6)}</p>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{locatedDJ.artisticName}</h3>
                            <p className="text-xs text-white/40">{locatedDJ.fullName}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`w-2 h-2 rounded-full ${locatedDJ.currentLocation?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              <span className="text-xs font-bold uppercase text-white/60">
                                {locatedDJ.currentLocation?.status === 'active' ? 'Sinal Activo' : 'Sinal Intermitente'}
                              </span>
                              <span className="text-[10px] text-white/20 ml-2">
                                Atualizado: {new Date(locatedDJ.currentLocation?.lastUpdate || '').toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                             <a href={`tel:${locatedDJ.phoneNumber}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors mb-2">
                               <Phone size={14} /> Ligar
                             </a>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                          <button className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                            <AlertTriangle size={14} /> Reportar Recusa
                          </button>
                          <button className="flex-1 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                            <Navigation size={14} /> Ver Rota
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <MapPin size={40} />
                      </div>
                      <p className="font-bold">Aguardando pesquisa...</p>
                      <p className="text-xs mt-2 max-w-[200px]">Insira os dados do DJ para iniciar o rastreamento via satélite.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 max-w-xl animate-in fade-in duration-500">
             <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
               <Lock className="text-sky-400" /> Credenciais
             </h2>
             <form onSubmit={handleSaveSettings} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-white/60">Novo E-mail</label>
                 <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-base"
                   value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-white/60">Nova Senha</label>
                 <input type="password" required placeholder="Nova senha" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 text-base"
                   value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} />
               </div>
               <button type="submit" className="w-full py-4 gradient-bg rounded-xl font-bold text-lg shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                 Guardar Alterações
               </button>
               {settingsSaved && (
                 <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold animate-in slide-in-from-bottom-2 text-sm">
                   <Check size={20} /> Dados atualizados com sucesso!
                 </div>
               )}
             </form>
          </div>
        )}

        {activeTab === 'djs' && (
          <div className="space-y-6 md:space-y-8">
            {/* Filter Bar */}
            <div className="glass p-4 md:p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Nome Artístico</label>
                <input type="text" placeholder="Pesquisar..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-2 text-sm outline-none focus:border-sky-500"
                  value={filterArtisticName} onChange={(e) => setFilterArtisticName(e.target.value)} />
              </div>
               {/* Hidden on mobile to save space unless expanded, simplified here for demo */}
              <div className="space-y-2 hidden md:block">
                <label className="text-xs font-bold text-white/40 uppercase">Nome Completo</label>
                <input type="text" placeholder="Pesquisar..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-sky-500"
                  value={filterFullName} onChange={(e) => setFilterFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase">Status</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-2 text-sm outline-none focus:border-sky-500"
                  value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                  <option value="all" className="bg-neutral-900">Todos</option>
                  <option value="pending" className="bg-neutral-900">Pendentes</option>
                  <option value="approved" className="bg-neutral-900">Aprovados</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
              {filteredDJs.map(dj => (
                <div key={dj.id} className="glass p-4 md:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-bold text-lg shadow-lg shrink-0">
                      {dj.artisticName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base md:text-lg">{dj.artisticName}</h3>
                         {dj.status === 'approved' && <StarRating rating={dj.rating} size={12} />}
                      </div>
                      <p className="text-xs text-white/40">{dj.fullName}</p>
                      <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                         <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                          dj.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                          dj.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {dj.status === 'approved' ? 'Aprovado' : dj.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 border-t border-white/5 md:border-none pt-4 md:pt-0">
                     <div className="text-right hidden md:block">
                        <p className="text-xs text-white/40 mb-1">Status</p>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          dj.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                          dj.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {dj.status === 'approved' ? 'Aprovado' : dj.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <button onClick={() => setSelectedDJForDetails(dj)} className="flex-1 md:flex-none p-3 bg-sky-500/10 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all">
                          <Eye size={18} className="mx-auto" />
                        </button>
                        {dj.status === 'pending' ? (
                          <>
                            <button onClick={() => handleApproveDJ(dj.id)} className="flex-1 md:flex-none p-3 bg-green-500/10 text-green-500 rounded-xl">
                              <Check size={18} className="mx-auto" />
                            </button>
                            <button onClick={() => handleRejectDJ(dj.id)} className="flex-1 md:flex-none p-3 bg-red-500/10 text-red-500 rounded-xl">
                              <X size={18} className="mx-auto" />
                            </button>
                          </>
                        ) : (
                             <button onClick={() => setDjToDelete(dj)} className="flex-1 md:flex-none p-3 bg-red-500/10 text-red-500 rounded-xl">
                              <Trash2 size={18} className="mx-auto" />
                            </button>
                        )}
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Financial Summary Cards (Carousel on mobile) */}
            <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-4 md:pb-0 snap-x">
              <div className="glass p-5 rounded-3xl border border-white/10 bg-sky-500/5 min-w-[250px] snap-center">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-sky-500/20 rounded-xl text-sky-400">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-400/10 px-2 py-1 rounded-full">TOTAL PROCESSADO</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">{totalProcessed.toLocaleString('pt-AO')} Akz</h3>
              </div>
              <div className="glass p-5 rounded-3xl border border-white/10 bg-green-500/5 min-w-[250px] snap-center">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
                    <PieChart size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">LUCRO (10%)</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">{totalCommission.toLocaleString('pt-AO')} Akz</h3>
              </div>
              <div className="glass p-5 rounded-3xl border border-white/10 bg-orange-500/5 min-w-[250px] snap-center border-orange-500/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                    <Truck size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full">FUNDO LOGÍSTICA</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">{totalLogistics.toLocaleString('pt-AO')} Akz</h3>
              </div>
              <div className="glass p-5 rounded-3xl border border-white/10 bg-purple-500/5 min-w-[250px] snap-center">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                    <DollarSign size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">PAGO AOS DJs</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">{totalDJPayout.toLocaleString('pt-AO')} Akz</h3>
              </div>
            </div>

            {/* Transaction List (Cards on Mobile, Table on Desktop) */}
            <div className="space-y-4">
               <h2 className="text-lg font-bold px-2">Transações Recentes</h2>
               
               {/* Mobile Cards */}
               <div className="md:hidden space-y-3">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="glass p-4 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="font-bold text-white">{booking.eventType}</p>
                              <p className="text-xs text-white/40">{booking.date} • {booking.municipality}</p>
                           </div>
                           <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">PAGO</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs">
                           <div>
                              <p className="text-white/30 uppercase">Valor Total</p>
                              <p className="font-bold text-white">{booking.price.toLocaleString()}</p>
                           </div>
                           {(booking.transportPrice || 0) > 0 && (
                               <div className="text-center">
                                  <p className="text-white/30 uppercase text-orange-400">Logística</p>
                                  <p className="font-bold text-orange-400">{booking.transportPrice?.toLocaleString()}</p>
                               </div>
                           )}
                           <div className="text-right">
                              <p className="text-white/30 uppercase">Líquido DJ</p>
                              <p className="font-bold text-sky-400">{booking.netAmount.toLocaleString()}</p>
                           </div>
                        </div>
                    </div>
                  ))}
                  {filteredBookings.length === 0 && <p className="text-center text-white/40 text-sm py-10">Sem registos.</p>}
               </div>

               {/* Desktop Table */}
               <div className="hidden md:block glass rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-5">Data</th>
                      <th className="px-6 py-5">Evento</th>
                      <th className="px-6 py-5">Valor Bruto</th>
                      <th className="px-6 py-5 text-orange-400">Logística</th>
                      <th className="px-6 py-5">Comissão</th>
                      <th className="px-6 py-5">Líquido DJ</th>
                      <th className="px-6 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredBookings.map(booking => (
                        <tr key={booking.id} className="text-sm hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-white/60">{booking.date}</td>
                          <td className="px-6 py-4 font-bold">{booking.eventType}</td>
                          <td className="px-6 py-4 font-mono text-white">{booking.price.toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-orange-400 font-bold">{(booking.transportPrice || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-green-400">{booking.commission.toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-sky-400">{booking.netAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right"><span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded font-bold">PAGO</span></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
