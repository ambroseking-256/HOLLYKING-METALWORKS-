import { useState, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserAccount } from '../types';
import { INITIAL_USERS } from '../data';
import { KeyRound, Mail, Phone, Building, User, HelpCircle, HardHat, Check, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  registeredUsers
}: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Quick action presets for evaluations
  const handleUsePreset = (role: 'client' | 'admin') => {
    if (role === 'client') {
      setEmail('client@example.com');
      setPassword('client');
    } else {
      setEmail('admin@hollyking.com');
      setPassword('admin');
    }
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Combine INITIAL_USERS with registered ones
    const allUsers = [...INITIAL_USERS, ...registeredUsers];
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      setSuccessAnimation(true);
      setTimeout(() => {
        onLoginSuccess(user);
        setSuccessAnimation(false);
        // Clean form states
        setEmail('');
        setPassword('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg('Invalid email credentials or incorrect password. Please confirm details.');
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || !name || !phone) {
      setErrorMsg('All marked fields (*) are mandatory for account creation.');
      return;
    }

    const allUsers = [...INITIAL_USERS, ...registeredUsers];
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorMsg('An account with this email address is already registered.');
      return;
    }

    const newClient: UserAccount = {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      companyName: companyName.trim() || undefined,
      role: 'client' // Registered accounts are always clients initially
    };

    setSuccessAnimation(true);
    setTimeout(() => {
      onRegisterSuccess(newClient);
      setSuccessAnimation(false);
      setIsRegister(false);
      // Clean form states
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setCompanyName('');
      onClose();
    }, 1250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 relative shadow-2xl my-8 overflow-hidden"
        id="portal-modal-container"
      >
        {/* Dynamic Success curtain */}
        {successAnimation && (
          <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center text-center p-6 select-none border border-amber-600/30 rounded-xl">
            <div className="w-12 h-12 bg-emerald-950/40 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center mb-3 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">ACCESS GRANTED</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Synchronizing workspace...</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded p-1 cursor-pointer"
          title="Dismiss Modal"
        >
          ✕
        </button>

        {/* Brand Banner header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded bg-gradient-to-br from-slate-700 to-amber-600 flex items-center justify-center border border-slate-500 shadow mb-3">
            <span className="font-display font-black text-lg text-white">HK</span>
          </div>
          <h3 className="font-display text-xl font-bold tracking-tight text-white uppercase">
            {isRegister ? 'Client Account Creation' : 'HOLLYKING Portal Access'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister 
              ? 'Register to claim contracts, track blueprints & upload imagery' 
              : 'Enter details or use quick evaluation presets below'}
          </p>
        </div>

        {errorMsg && (
          <p className="p-3 bg-red-950 border border-red-900/40 text-red-400 text-xs rounded mb-4 text-center font-sans">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Main form toggle wrapper */}
        {isRegister ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Full Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="E.g., Ambrose Ayebare"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Phone Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+256..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Company/Entity</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Building className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Set Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <KeyRound className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 tracking-wide font-display font-extrabold text-xs uppercase rounded transition-all shadow cursor-pointer text-center-parent"
              >
                Create Account
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Already have an account? Sign In instead
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Operator/Client Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-10 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Access Pin / Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <KeyRound className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="E.g., client"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-10 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 tracking-wide font-display font-extrabold text-xs uppercase rounded transition-all shadow cursor-pointer text-center-parent"
              >
                Verify & Enter Portal
              </button>
            </div>

            {/* Quick Presets for Demo Reviewers */}
            <div className="bg-slate-950/90 rounded-lg p-3.5 border border-slate-850 mt-4 text-slate-400">
              <span className="block text-[9px] font-mono text-amber-500 uppercase font-semibold mb-2 tracking-wider">⚡ Quick Demo testing shortcuts</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleUsePreset('client')}
                  className="p-2 border border-slate-850 hover:border-amber-500/40 bg-slate-900 rounded text-left transition-all hover:text-white cursor-pointer"
                >
                  <span className="block font-bold text-slate-300">👤 client Demo</span>
                  <span className="block text-[9px] font-mono text-slate-500 truncate">client@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUsePreset('admin')}
                  className="p-2 border border-slate-850 hover:border-red-500/40 bg-slate-900 rounded text-left transition-all hover:text-white cursor-pointer"
                >
                  <span className="block font-bold text-amber-500">🛡️ Admin Operator</span>
                  <span className="block text-[9px] font-mono text-slate-500 truncate">admin@hollyking.com</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className="text-[11px] text-slate-400 hover:text-amber-500 flex items-center justify-center gap-1 mx-auto"
                id="btn-switch-register"
              >
                <UserPlus className="w-3 h-3" />
                <span>New client? Click here to create account</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
