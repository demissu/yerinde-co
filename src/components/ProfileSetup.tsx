import React, { FormEvent, useState } from 'react';
import { UserProfile } from '../hooks/useAuth';

interface ProfileSetupProps {
  profile: UserProfile | null;
  onSave: (values: { username: string; displayName: string; avatarUrl: string }) => Promise<void>;
  onLogout: () => void;
}

export default function ProfileSetup({ profile, onSave, onLogout }: ProfileSetupProps) {
  const [username, setUsername] = useState(profile?.username ?? '');
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave({ username, displayName, avatarUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Profil kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex justify-center items-start">
      <div className="relative w-full max-w-md min-h-screen bg-[#F9F8F6] shadow-2xl border-x border-artistic-border overflow-hidden">
        <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-4">
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">İlk Kurulum</span>
          <h1 className="font-serif italic text-3xl font-light tracking-tight text-[#2C2C2C]">
            Defter adını seç.
          </h1>
          <p className="font-sans text-xs text-[#6A665D] leading-relaxed">
            Yerinde hesabını tamamlamak için benzersiz bir kullanıcı adı belirleyin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">Kullanıcı adı</span>
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              placeholder="ornek_kullanici"
              className="mt-1 w-full bg-white border border-artistic-border rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4A4A40]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">Görünen ad</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-1 w-full bg-white border border-artistic-border rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4A4A40]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">Avatar URL</span>
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              className="mt-1 w-full bg-white border border-artistic-border rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4A4A40]"
            />
          </label>

          {error && <p className="text-[11px] text-[#bd9a6f] leading-relaxed">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#4A4A40] text-white rounded-2xl py-3 text-xs font-mono font-bold tracking-widest uppercase disabled:opacity-60"
          >
            {isSaving ? 'Kaydediliyor...' : 'Profilimi tamamla'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-center font-mono text-[9px] font-bold tracking-widest uppercase text-[#8C8880]"
          >
            Çıkış yap
          </button>
        </form>
      </div>
    </div>
  );
}
