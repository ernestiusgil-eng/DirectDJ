
import React from 'react';
import { DJProfile } from '../types';
import { Logo } from '../components/Logo';
import { LogOut, User, Star, CreditCard, Calendar, TrendingUp, Music, Settings, AlertCircle } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { getAppState } from '../services/mockData';

interface DJDashboardProps {
  dj: DJProfile;
  onLogout: () => void;
}

export const DJDashboard: React.FC<DJDashboardProps> = ({ dj, onLogout }) => {
  const state = getAppState();
  const myBookings = state.bookings.filter(b => b.djId === dj.id);
  
  const totalEarnings = myBookings.reduce((acc, curr) => acc + curr.netAmount, 0);
  const pendingBookings = myBookings.filter(b => b.status === 'paid').length; // Paid by client = pending for DJ to execute

  return (
    <div className="min-h-screen bg-neutral-950 pb-safe">
      <header className="sticky top-0 z-50 glass border-b border-white/10 p-4 md:p-6 flex justify-between items-center">
        <Logo size={24} />
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center font-bold text-sm">
                    {dj.artisticName[0]}
                </div>
                <span className="font-bold hidden md:inline">{dj.artisticName}</span>
            </div>
            <button onClick={onLogout} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
                <LogOut size={18} />
            </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Status Banner */}
        {dj.status === 'pending' && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-orange-500 shrink-0" />
                <div>
                    <h3 className="font-bold text-orange-500">Perfil em Análise</h3>
                    <p className="text-sm text-white/60">A sua conta ainda está a ser verificada pela nossa equipa. Algumas funcionalidades podem estar limitadas.</p>
                </div>
            </div>
        )}

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/10 bg-green-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={60} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase mb-2">Total Ganho</p>
                <h2 className="text-3xl font-black text-white">{totalEarnings.toLocaleString()} <span className="text-sm font-normal text-white/40">Akz</span></h2>
            </div>
             <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Calendar size={60} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase mb-2">Eventos Realizados</p>
                <h2 className="text-3xl font-black text-white">{myBookings.length}</h2>
            </div>
             <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star size={60} />
                </div>
                <p className="text-xs font-bold text-white/40 uppercase mb-2">Classificação</p>
                <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black text-white">{dj.rating}</h2>
                    <StarRating rating={dj.rating} size={14} />
                </div>
                <p className="text-xs text-white/40 mt-1">{dj.reviewCount} avaliações</p>
            </div>
        </div>

        {/* Profile Summary */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <User size={18} className="text-sky-400" /> Meu Perfil
                </h3>
                <button className="text-xs font-bold text-sky-400 hover:text-white transition-colors bg-sky-500/10 px-3 py-1.5 rounded-lg">
                    Editar Dados
                </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Nome Artístico</span>
                        <span className="font-bold">{dj.artisticName}</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Telefone</span>
                        <span className="font-bold">{dj.phoneNumber}</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Localização</span>
                        <span className="font-bold">{dj.municipality}, {dj.province}</span>
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Cache (DJ)</span>
                        <span className="font-bold text-green-400">{dj.priceDjOnly.toLocaleString()} Akz</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">Cache (Com Som)</span>
                        <span className="font-bold text-green-400">{dj.priceWithGear > 0 ? dj.priceWithGear.toLocaleString() + ' Akz' : '-'}</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/40">IBAN</span>
                        <span className="font-mono">{dj.iban}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Bookings */}
        <div className="space-y-4">
            <h3 className="text-lg font-bold px-2">Histórico de Eventos</h3>
            {myBookings.length > 0 ? (
                <div className="grid gap-4">
                    {myBookings.map(booking => (
                        <div key={booking.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white">{booking.eventType}</span>
                                    <span className="text-xs text-white/40">• {booking.date}</span>
                                </div>
                                <p className="text-xs text-white/60">{booking.municipality}, {booking.province}</p>
                                <p className="text-xs text-white/40 mt-1">Cliente: {booking.clientId}</p>
                            </div>
                            <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t border-white/5 pt-3 md:pt-0 md:border-none">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded mb-1 uppercase ${
                                    booking.status === 'completed' ? 'bg-white/10 text-white/60' : 'bg-green-500/10 text-green-400'
                                }`}>
                                    {booking.status === 'paid' ? 'Confirmado' : 'Concluído'}
                                </span>
                                <span className="font-mono text-sky-400 font-bold">{booking.netAmount.toLocaleString()} Akz</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-white/5 rounded-3xl bg-white/5">
                    <Music size={32} className="mx-auto text-white/20 mb-3" />
                    <p className="text-white/40">Ainda não tem eventos registados.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};
