
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MessageSquare, CheckCircle2, User } from 'lucide-react';
import { Logo } from '../components/Logo';
import { StarRating } from '../components/StarRating';
import { getAppState, updateDJRating } from '../services/mockData';
import { DJProfile } from '../types';

interface RateServiceProps {
  onBack: () => void;
}

export const RateService: React.FC<RateServiceProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [djs, setDjs] = useState<DJProfile[]>([]);
  const [selectedDJ, setSelectedDJ] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const state = getAppState();
    // Only show approved DJs
    setDjs(state.djs.filter(dj => dj.status === 'approved'));
  }, []);

  const handleSubmit = () => {
    if (selectedDJ && rating > 0) {
      updateDJRating(selectedDJ, rating);
      setStep(2);
    }
  };

  const getDJName = (id: string) => djs.find(d => d.id === id)?.artisticName || '';

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft size={20} /> Voltar
        </button>
        <Logo size={40} />
      </header>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Avaliar Serviço</h1>
            <p className="text-white/60">A sua opinião ajuda-nos a manter a qualidade dos nossos DJs.</p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <User size={18} className="text-sky-400" /> Selecione o DJ
              </label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-colors"
                value={selectedDJ}
                onChange={(e) => setSelectedDJ(e.target.value)}
              >
                <option value="" className="bg-neutral-900">Selecione quem tocou no seu evento...</option>
                {djs.map(dj => (
                  <option key={dj.id} value={dj.id} className="bg-neutral-900">
                    {dj.artisticName} ({dj.fullName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4 text-center py-4 border-y border-white/5">
              <label className="text-sm font-semibold text-white/80 block mb-4">
                Quantas estrelas merece?
              </label>
              <div className="flex justify-center">
                <StarRating 
                  rating={rating} 
                  editable={true} 
                  size={40} 
                  onRatingChange={setRating} 
                />
              </div>
              <p className="text-sm text-sky-400 font-bold h-6">
                {rating === 1 && "Muito Insatisfeito"}
                {rating === 2 && "Insatisfeito"}
                {rating === 3 && "Razoável"}
                {rating === 4 && "Satisfeito"}
                {rating === 5 && "Extremamente Satisfeito!"}
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <MessageSquare size={18} className="text-pink-500" /> Comentário (Opcional)
              </label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500 transition-colors h-32 resize-none"
                placeholder="Conte-nos como foi a experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!selectedDJ || rating === 0}
              className={`w-full py-4 gradient-bg rounded-xl font-bold text-lg shadow-xl shadow-pink-500/20 active:scale-95 transition-all ${(!selectedDJ || rating === 0) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              Enviar Avaliação
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 shadow-2xl shadow-yellow-500/20">
            <Star size={48} className="text-yellow-500 fill-yellow-500" />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black">Obrigado!</h1>
            <p className="text-xl text-white/60">
              A sua avaliação foi registada com sucesso. <br/>
              <span className="text-white font-bold">{getDJName(selectedDJ)}</span> agradece o feedback.
            </p>
          </div>
          <button onClick={onBack} className="px-12 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">
            Voltar ao Início
          </button>
        </div>
      )}
    </div>
  );
};
