import React from 'react';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <a href="/admin/places" className="text-sm font-bold tracking-tight">
              Yerinde Admin
            </a>
            <p className="text-xs text-slate-500 mt-0.5">Public place management</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <a href="/admin/places" className="text-slate-700 hover:text-slate-950">
              Places
            </a>
            <a href="/" className="text-slate-500 hover:text-slate-950">
              Public App
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <a
            href="/admin/places/new"
            className="bg-slate-950 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800"
          >
            New place
          </a>
        </div>
        {children}
      </main>
    </div>
  );
}
