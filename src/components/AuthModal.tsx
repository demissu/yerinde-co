import React, { FormEvent, useState } from 'react';
import { X, Mail, Chrome } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onGoogle: () => void;
  onEmailLogin: (email: string, password: string) => Promise<void>;
  onEmailSignup: (email: string, password: string) => Promise<void>;
  error?: string | null;
}

export default function AuthModal({
  onClose,
  onGoogle,
  onEmailLogin,
  onEmailSignup,
  error,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await onEmailLogin(email, password);
      } else {
        await onEmailSignup(email, password);
        setLocalError('E-posta kutunuzu kontrol edin. Onay sonrası giriş yapabilirsiniz.');
      }
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Giriş tamamlanamadı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-sm z-50 flex items-end justify-center max-w-md mx-auto">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full bg-[#F9F8F6] rounded-t-[2.5rem] border-t border-artistic-border shadow-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">Yerinde Hesabı</span>
            <h2 className="font-serif italic text-2xl font-light text-[#2C2C2C] mt-1">
              Defterini yanında taşı.
            </h2>
            <p className="font-sans text-xs text-[#6A665D] leading-relaxed mt-2">
              Kaydettiğin yerler cihazlar arasında seninle gelsin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-artistic-border flex items-center justify-center text-[#2C2C2C]"
          >
            <X size={15} />
          </button>
        </div>

        <button
          onClick={onGoogle}
          className="w-full bg-[#4A4A40] text-white rounded-2xl py-3 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <Chrome size={15} className="text-[#bd9a6f]" />
          Google ile devam et
        </button>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">E-posta</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full bg-white border border-artistic-border rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4A4A40]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">Şifre</span>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full bg-white border border-artistic-border rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4A4A40]"
            />
          </label>
          {(localError || error) && (
            <p className="text-[11px] text-[#bd9a6f] leading-relaxed">{localError || error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white border border-artistic-border rounded-2xl py-3 text-xs font-mono font-bold tracking-widest uppercase text-[#2C2C2C] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Mail size={14} className="text-[#bd9a6f]" />
            {isSubmitting ? 'Bekleyin...' : mode === 'login' ? 'E-posta ile giriş' : 'Hesap oluştur'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center font-mono text-[9px] font-bold tracking-widest uppercase text-[#8C8880]"
        >
          {mode === 'login' ? 'Yeni hesap oluştur' : 'Zaten hesabım var'}
        </button>
      </div>
    </div>
  );
}
