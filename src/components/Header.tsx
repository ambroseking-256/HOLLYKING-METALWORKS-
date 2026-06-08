import { useState } from 'react';
import { Phone, User, LogOut, Menu, X, Shield, Hammer } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dbStatus?: 'online' | 'syncing' | 'offline';
}

export default function Header({
  currentUser,
  onLogout,
  onOpenLogin,
  activeTab,
  setActiveTab,
  dbStatus = 'offline'
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Bespoke Portfolio' },
    { id: 'tracker', label: 'Project Tracking' },
    { id: 'contact', label: 'Get a Quote' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
      {/* Upper info ribbon with specified phone numbers */}
      <div className="bg-[#0b0e17] border-b border-slate-800/60 px-4 py-2.5 text-[10px] md:text-xs font-mono tracking-wider flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold">
          <Hammer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="uppercase text-slate-300">Hollyking Industrial Steel Fabricators</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center text-slate-400 font-medium">
          <a href="tel:+256703025834" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
            <Phone className="w-3 h-3 text-amber-505 shrink-0 text-amber-500" />
            <span>Airtel: +256 703 025 834</span>
          </a>
          <span className="hidden sm:inline text-slate-705 select-none text-slate-700">•</span>
          <a href="tel:+256771336689" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
            <Phone className="w-3 h-3 text-amber-505 shrink-0 text-amber-500" />
            <span>MTN: +256 771 336 689</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Brand Brand & Supabase connection badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              id="brand-logo"
            >
              <div className="w-10 h-10 rounded bg-gradient-to-br from-slate-700 to-amber-600 flex items-center justify-center border border-slate-500 shadow-inner group-hover:scale-105 transition-all">
                <span className="font-display font-bold text-lg text-white tracking-widest">HK</span>
              </div>
              <div>
                <h1 className="font-display font-black text-lg sm:text-xl tracking-tight leading-none group-hover:text-amber-500 transition-all text-white">
                  HOLLYKING
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase font-semibold">
                  METALWORKS U.LTD
                </span>
              </div>
            </div>

            {/* Supabase connection indicator */}
            <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono select-none"
              title={`Supabase connection status: ${dbStatus === 'online' ? 'Online' : dbStatus === 'syncing' ? 'Syncing...' : 'Offline'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                dbStatus === 'syncing' ? 'bg-amber-500 animate-pulse' :
                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
              }`} />
              <span className="hidden sm:inline-block text-slate-400 font-medium">Supabase:</span>
              <span className={`font-bold ${
                dbStatus === 'online' ? 'text-emerald-400' :
                dbStatus === 'syncing' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {dbStatus === 'online' ? 'Online' : dbStatus === 'syncing' ? 'Syncing...' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded font-mono text-[11px] uppercase tracking-wider relative transition-all duration-200 cursor-pointer border ${
                  activeTab === item.id
                    ? 'border-amber-600/30 bg-amber-950/20 text-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                    : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 font-bold'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Profile Section */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-lg shadow-inner">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400 font-mono">
                    {currentUser.role === 'admin' ? '🛡️ ADMIN PORTAL' : '👷 CLIENT PORTAL'}
                  </span>
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                {currentUser.role === 'admin' ? (
                  <div className="p-1.5 rounded-full bg-red-950 text-red-400 border border-red-800" title="Administrator Role">
                    <Shield className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-full bg-amber-950 text-amber-500 border border-amber-800">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                  title="Log out"
                  id="btn-logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-display font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md transform active:scale-95 cursor-pointer text-sm"
                id="btn-login-open"
              >
                <User className="w-4 h-4" />
                <span>Client & Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-3">
            {!currentUser && (
              <button
                onClick={onOpenLogin}
                className="p-2 text-amber-500 bg-slate-900 rounded-md border border-slate-800 cursor-pointer"
                title="Login"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-900 rounded-md cursor-pointer-parent"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-display font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            {currentUser ? (
              <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    {currentUser.role === 'admin' ? '🛡️ Admin Account' : '👷 Active Client'}
                  </div>
                  <div className="text-sm font-bold text-white">{currentUser.name}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 text-red-400 hover:text-red-300 border border-red-900/40 rounded text-xs select-none cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 py-3 rounded-md text-white font-display font-semibold"
              >
                <User className="w-4 h-4" />
                <span>Portal Access</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
