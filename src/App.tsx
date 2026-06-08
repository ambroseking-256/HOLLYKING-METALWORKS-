import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Tracker from './components/Tracker';
import Contact from './components/Contact';
import LoginModal from './components/LoginModal';

import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_QUOTES } from './data';
import { UserAccount, ClientProject, QuoteRequest, ProjectMedia, PortfolioItem } from './types';
import { Award, ShieldCheck, Mail, Phone, Info, Wrench } from 'lucide-react';
import { 
  dbSubmitQuote, 
  dbFetchQuotes, 
  dbRegisterUser, 
  dbFetchUsers, 
  dbUpdateQuoteStatus, 
  dbFetchProjects, 
  dbUpsertProject,
  dbInsertProjectMedia,
  dbDeleteProjectMedia,
  dbUpdateMilestone
} from './supabaseClient';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [whatsappOpen, setWhatsappOpen] = useState<boolean>(false);

  // Persistence State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  // Preloaded Quote triggers from catalog
  const [selectedItemForQuote, setSelectedItemForQuote] = useState<PortfolioItem | null>(null);

  // Supabase connection status indicator
  const [dbStatus, setDbStatus] = useState<'online' | 'syncing' | 'offline'>('offline');

  // Initialize and load from localStorage & Sync with Supabase (Offline-First)
  useEffect(() => {
    // 1. Logged in user
    const savedUser = localStorage.getItem('hk_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // 2. Registrations
    const savedRegUsers = localStorage.getItem('hk_registered_users');
    if (savedRegUsers) {
      setRegisteredUsers(JSON.parse(savedRegUsers));
    } else {
      localStorage.setItem('hk_registered_users', JSON.stringify([]));
    }

    // 3. Contracts Projects
    const savedProjects = localStorage.getItem('hk_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      localStorage.setItem('hk_projects', JSON.stringify(INITIAL_PROJECTS));
      setProjects(INITIAL_PROJECTS);
    }

    // 4. Quote request submissions
    const savedQuotes = localStorage.getItem('hk_quotes');
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    } else {
      localStorage.setItem('hk_quotes', JSON.stringify(INITIAL_QUOTES));
      setQuotes(INITIAL_QUOTES);
    }

    // 5. Connect and update from Supabase DB in background
    async function syncWithSupabase() {
      setDbStatus('syncing');
      try {
        let hasSuccess = false;
        
        const dbUsers = await dbFetchUsers();
        if (dbUsers) {
          hasSuccess = true;
          if (dbUsers.length > 0) {
            setRegisteredUsers(dbUsers);
            localStorage.setItem('hk_registered_users', JSON.stringify(dbUsers));
            
            if (savedUser) {
              const parsed = JSON.parse(savedUser);
              const fresh = dbUsers.find(u => u.id === parsed.id || u.email === parsed.email);
              if (fresh) {
                setCurrentUser(fresh);
                localStorage.setItem('hk_current_user', JSON.stringify(fresh));
              }
            }
          }
        }

        const dbQuotes = await dbFetchQuotes();
        if (dbQuotes) {
          hasSuccess = true;
          if (dbQuotes.length > 0) {
            setQuotes(dbQuotes);
            localStorage.setItem('hk_quotes', JSON.stringify(dbQuotes));
          }
        }

        const dbProjs = await dbFetchProjects();
        if (dbProjs) {
          hasSuccess = true;
          if (dbProjs.length > 0) {
            setProjects(dbProjs);
            localStorage.setItem('hk_projects', JSON.stringify(dbProjs));
          }
        }

        setDbStatus(hasSuccess ? 'online' : 'offline');
      } catch (err) {
        console.warn('Background Supabase Sync error:', err);
        setDbStatus('offline');
      }
    }
    syncWithSupabase();
  }, []);

  // System State updaters
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('hk_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hk_current_user');
    // If we logout, push them to home page to keep state clean
    setActiveTab('home');
  };

  const handleRegisterSuccess = (newClient: UserAccount) => {
    const updatedUsers = [...registeredUsers, newClient];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('hk_registered_users', JSON.stringify(updatedUsers));
    
    // Auto login
    setCurrentUser(newClient);
    localStorage.setItem('hk_current_user', JSON.stringify(newClient));

    // Supabase Sync
    setDbStatus('syncing');
    dbRegisterUser(newClient).then(success => {
      setDbStatus(success ? 'online' : 'offline');
    });
  };

  // Portfolio quote linker
  const handleQuoteWithItem = (item: PortfolioItem) => {
    setSelectedItemForQuote(item);
    setActiveTab('contact');
  };

  // Submit quote to database
  const handleSubmitQuote = (formData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: QuoteRequest = {
      ...formData,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'received'
    };

    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);
    localStorage.setItem('hk_quotes', JSON.stringify(updatedQuotes));
    
    // Clear item link triggers
    setSelectedItemForQuote(null);

    // Supabase Sync
    setDbStatus('syncing');
    dbSubmitQuote(newQuote).then(success => {
      setDbStatus(success ? 'online' : 'offline');
    });
  };

  // Admin: Update quote pricing offer
  const handleUpdateQuoteStatus = (quoteId: string, status: 'pricing' | 'sent-quota' | 'confirmed', estimatedCost?: string) => {
    const updatedQuotes = quotes.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status,
          estimatedCost: estimatedCost || q.estimatedCost
        };
      }
      return q;
    });
    setQuotes(updatedQuotes);
    localStorage.setItem('hk_quotes', JSON.stringify(updatedQuotes));

    // Supabase Sync
    setDbStatus('syncing');
    dbUpdateQuoteStatus(quoteId, status, estimatedCost).then(success => {
      setDbStatus(success ? 'online' : 'offline');
    });
  };

  // File Upload Logic into Project tracking Space
  const handleAddMedia = (projectId: string, mediaItem: ProjectMedia) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          media: [mediaItem, ...p.media]
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('hk_projects', JSON.stringify(updatedProjects));

    // Supabase Sync
    setDbStatus('syncing');
    dbInsertProjectMedia(projectId, mediaItem).then(success => {
      setDbStatus(success ? 'online' : 'offline');
    });
  };

  const handleDeleteMedia = (projectId: string, mediaId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          media: p.media.filter(med => med.id !== mediaId)
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('hk_projects', JSON.stringify(updatedProjects));

    // Supabase Sync
    setDbStatus('syncing');
    dbDeleteProjectMedia(mediaId).then(success => {
      setDbStatus(success ? 'online' : 'offline');
    });
  };

  // Admin: Milestone state toggling
  const handleUpdateMilestone = (
    projectId: string, 
    milestoneId: string, 
    status: 'pending' | 'in-progress' | 'completed'
  ) => {
    let targetProject: ClientProject | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return {
              ...ms,
              status,
              completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return ms;
        });

        // Also recalculate overall total progress percentage automatically based on milestone completion weight!
        const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
        const totalCount = updatedMilestones.length;
        const calculatedProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        // Auto transition major contract tracker state
        let updatedContractStatus = p.status;
        if (calculatedProgress === 100) {
          updatedContractStatus = 'installed';
        } else if (calculatedProgress > 80) {
          updatedContractStatus = 'delivery';
        } else if (calculatedProgress > 50) {
          updatedContractStatus = 'fabrication';
        } else if (calculatedProgress > 15) {
          updatedContractStatus = 'designing';
        }

        const updatedProj = {
          ...p,
          milestones: updatedMilestones,
          progress: calculatedProgress,
          status: updatedContractStatus
        } as ClientProject;
        targetProject = updatedProj;
        return updatedProj;
      }
      return p;
    });

    setProjects(updatedProjects);
    localStorage.setItem('hk_projects', JSON.stringify(updatedProjects));

    // Supabase Sync
    setDbStatus('syncing');
    dbUpdateMilestone(milestoneId, status, status === 'completed' ? new Date().toISOString().split('T')[0] : undefined).then(async (success) => {
      if (success && targetProject) {
        const upsertSuccess = await dbUpsertProject(targetProject);
        setDbStatus(upsertSuccess ? 'online' : 'offline');
      } else {
        setDbStatus(success ? 'online' : 'offline');
      }
    });
  };

  // Admin: Update workshop supervisor notes
  const handleAddNote = (projectId: string, notesText: string) => {
    let targetProject: ClientProject | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedProj = {
          ...p,
          adminNotes: notesText
        };
        targetProject = updatedProj;
        return updatedProj;
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('hk_projects', JSON.stringify(updatedProjects));

    // Supabase Sync
    if (targetProject) {
      setDbStatus('syncing');
      dbUpsertProject(targetProject).then(success => {
        setDbStatus(success ? 'online' : 'offline');
      });
    }
  };

  // Client/Admin: Update project financials from Mobile Money Payment
  const handleUpdateProjectPayment = (projectId: string, paidIncrement: number) => {
    let targetProject: ClientProject | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const cleanedPaid = p.amountPaid.replace(/[^0-9]/g, '');
        const currentPaid = parseInt(cleanedPaid, 10) || 0;
        const newPaid = currentPaid + paidIncrement;
        const updatedProj = {
          ...p,
          amountPaid: `UGX ${newPaid.toLocaleString()}`
        };
        targetProject = updatedProj;
        return updatedProj;
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('hk_projects', JSON.stringify(updatedProjects));

    // Supabase Sync
    if (targetProject) {
      setDbStatus('syncing');
      dbUpsertProject(targetProject).then(success => {
        setDbStatus(success ? 'online' : 'offline');
      });
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col justify-between selection:bg-amber-600 selection:text-slate-900">
      
      {/* 1. Header Toolbar */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setLoginModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // When navigating tabs, automatically reset quote selections
          setSelectedItemForQuote(null);
        }}
        dbStatus={dbStatus}
      />

      {/* 2. Main Page views routing */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <Home 
            onNavigate={(tab) => setActiveTab(tab)} 
            onOpenLogin={() => setLoginModalOpen(true)} 
          />
        )}
        
        {activeTab === 'gallery' && (
          <Gallery 
            onQuoteWithItem={handleQuoteWithItem} 
          />
        )}
        
        {activeTab === 'tracker' && (
          <Tracker
            currentUser={currentUser}
            projects={projects}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
            onUpdateMilestone={handleUpdateMilestone}
            onAddNote={handleAddNote}
            onOpenLogin={() => setLoginModalOpen(true)}
            onUpdatePayment={handleUpdateProjectPayment}
          />
        )}
        
        {activeTab === 'contact' && (
          <Contact
            quotes={quotes}
            onSubmitQuote={handleSubmitQuote}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Linked active quote form autopopulation script */}
      {selectedItemForQuote && activeTab === 'contact' && (
        <div className="bg-slate-900 border-t border-amber-600/35 py-3.5 px-4 text-center text-xs text-amber-500 font-mono flex items-center justify-center gap-1.5 animate-bounce">
          <Info className="w-4 h-4" />
          <span>Note: Auto-populating specifications in the quote form for: <strong>"{selectedItemForQuote.title}"</strong></span>
        </div>
      )}

      {/* 3. Footer Block */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="font-display font-extrabold text-[#ffffff] tracking-wide text-sm uppercase">
              HOLLYKING METALWORKS U.LTD
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans">
              Quality general engineering, modern steel architectural installations, bespoke doors/windows, heavy steel roof assemblies, and industrial high-grade event clear canopy tents built to stand.
            </p>
            <div className="text-[10px] text-slate-500 font-mono mb-2">
              Reg. Kampala Uganda | EST. 2026
            </div>
            
            {/* Follow channels details */}
            <div className="pt-2 border-t border-slate-900">
              <span className="block font-semibold text-slate-300 font-mono uppercase text-[10px] tracking-wider mb-2">Social Platforms</span>
              <div className="space-y-1.5">
                <a 
                  href="https://www.tiktok.com/@hollyking_metal_fabricators" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.53 0c.1 0 .21 0 .31.01v4.83l.02-.01c1.38-1.02 3.1-1.63 4.96-1.63v3.7c-2.14 0-3.93-1.25-4.78-3.07v10.4c0 3.81-3.1 6.9-6.9 6.9S0 18.13 0 14.32s3.1-6.9 6.9-6.9c.8 0 1.56.14 2.27.39V0h3.36zm-5.63 11.2a3.11 3.11 0 100 6.22 3.11 3.11 0 000-6.22z"/>
                  </svg>
                  <span className="font-semibold text-[11px]">hollyking metal fabricators (TikTok)</span>
                </a>
                <a 
                  href="https://www.facebook.com/ayebare.ambroseking" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                  <span className="font-semibold text-[11px]">ayebare ambroseking (Facebook)</span>
                </a>
                <a 
                  href="https://x.com/ambroseayebare12" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 group text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-semibold text-[11px]">@ambroseayebare12 (X / Twitter)</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-slate-300 font-mono uppercase text-[11px] tracking-wider">SPECIALTIES</h5>
            <ul className="space-y-1 text-slate-400 font-sans">
              <li>• Sliding Doors & Windows</li>
              <li>• Wrought Architectural Gates</li>
              <li>• Event Canopy Shade Tents</li>
              <li>• Heavy Structural construction</li>
              <li>• Custom Laser Cut Screens</li>
              <li>• Anti-corrosive Powder Coating</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-slate-300 font-mono uppercase text-[11px] tracking-wider">OFFICE CONTACTS</h5>
            <ul className="space-y-1.5 text-slate-400 font-mono">
              <li>Airtel: <a href="tel:+256703025834" className="hover:text-amber-500 underline">+256 703 025 834</a></li>
              <li>MTN: <a href="tel:+256771336689" className="hover:text-amber-500 underline">+256 771 336 689</a></li>
              <li className="text-[11px]">Dispatch: Kampala Industrial Area, Uganda</li>
            </ul>
            
            <div className="pt-2">
              <span className="block font-semibold text-slate-300 font-mono uppercase text-[9px] mb-2 tracking-wider">WhatsApp Contact Desk:</span>
              <div className="flex gap-1.5 flex-wrap">
                <a 
                  href="https://wa.me/256703025834?text=Hello%20Hollyking%20Metalworks,%20I'd%20like%20to%20request%20an%20estimate%20on%20a%20construction%20project..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 rounded flex items-center gap-1.5 font-sans font-bold text-emerald-400 text-[10px] transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.91.538 3.69 1.474 5.22L2.05 22l4.904-1.285c1.47.785 3.125 1.285 5.05 1.285 5.524 0 10-4.48 10-10S17.528 2 12.004 2z"/>
                  </svg>
                  <span>Airtel WA</span>
                </a>
                <a 
                  href="https://wa.me/256771336689?text=Hello%20Hollyking%20Metalworks,%20I'd%20like%20to%20request%20an%20estimate%20on%20a%20construction%20project..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 rounded flex items-center gap-1.5 font-sans font-bold text-emerald-400 text-[10px] transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.91.538 3.69 1.474 5.22L2.05 22l4.904-1.285c1.47.785 3.125 1.285 5.05 1.285 5.524 0 10-4.48 10-10S17.528 2 12.004 2z"/>
                  </svg>
                  <span>MTN WA</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-slate-300 font-mono uppercase text-[11px] tracking-wider">SECURITY RATINGS</h5>
            <div className="flex gap-2.5 items-center bg-slate-900 p-2.5 rounded border border-slate-850">
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
              <div className="text-[10px] text-slate-400">
                <span className="block font-bold text-white uppercase font-mono">UNBS QA Standards</span>
                <span>Fittings tested for heavy Uganda wind loads.</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-900 text-center text-slate-600 font-mono">
          © {new Date().getFullYear()} HOLLYKING METALWORKS U.LTD. All rights reserved. Precision forged architecture.
        </div>
      </footer>

      {/* Persistent Floating WhatsApp Chat Helpdesk Widget */}
      <div className="fixed bottom-6 right-6 z-50 font-sans shadow-2xl">
        {whatsappOpen && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-72 overflow-hidden mb-3 animate-slide flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-xs">
                  HK
                </div>
                <div>
                  <h4 className="font-bold text-xs">Hollyking Metal Fabricators</h4>
                  <span className="text-[9px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Online • Kampala Workshop
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setWhatsappOpen(false)}
                className="text-white hover:text-slate-200 text-xs font-bold leading-none w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="p-3 bg-slate-950 text-left space-y-3">
              <p className="text-[10px] text-slate-400 leading-normal">
                Hello! Reach out to one of our metal fabrication desks on WhatsApp for speedy custom quote answers:
              </p>
              
              <div className="space-y-2">
                <a 
                  href="https://wa.me/256703025834?text=Hello%20Airtel%20Desk,%20I'm%20inquiring%20about%20Hollyking%20metal%20fabrication%20services.%20My%20name%20is..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/40 hover:bg-slate-850 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <div className="text-left">
                      <span className="block text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors">Airtel Desk (Ambrose)</span>
                      <span className="block text-[9px] text-slate-500 font-mono">+256 703 025 834</span>
                    </div>
                  </div>
                  <span className="p-1 rounded bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold uppercase group-hover:bg-emerald-900 group-hover:text-white transition-colors">CHAT</span>
                </a>

                <a 
                  href="https://wa.me/256771336689?text=Hello%20MTN%20Desk,%20I'm%20inquiring%20about%20Hollyking%20metal%20fabrication%20services.%20My%20name%20is..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/40 hover:bg-slate-850 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <div className="text-left">
                      <span className="block text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors">MTN Operations (Ambrose)</span>
                      <span className="block text-[9px] text-slate-500 font-mono">+256 771 336 689</span>
                    </div>
                  </div>
                  <span className="p-1 rounded bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold uppercase group-hover:bg-emerald-900 group-hover:text-white transition-colors">CHAT</span>
                </a>
              </div>

              <div className="pt-2 text-[9px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-900 px-1">
                <a href="https://www.tiktok.com/@hollyking_metal_fabricators" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">TikTok</a>
                <span>•</span>
                <a href="https://www.facebook.com/ayebare.ambroseking" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">Facebook</a>
                <span>•</span>
                <a href="https://x.com/ambroseayebare12" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">X</a>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setWhatsappOpen(!whatsappOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-display text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/40"
          aria-label="Contact us on WhatsApp"
        >
          <div className="relative">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 11.95.01c3.178.001 6.165 1.24 8.413 3.493 2.247 2.253 3.483 5.244 3.48 8.423-.003 6.602-5.34 11.94-11.896 11.94-2.004 0-3.974-.507-5.714-1.472L0 24zm6.59-4.846c1.6.95 3.16 1.45 4.903 1.451 5.394 0 9.782-4.388 9.784-9.783.002-2.613-1.015-5.07-2.863-6.92C16.623 2.05 14.167.818 11.56.818c-5.397 0-9.783 4.388-9.786 9.784-.001 1.83.49 3.618 1.42 5.19l-.93 3.398 3.48-.913zM15.75 13.92c-.322-.16-1.9-.938-2.193-1.044-.294-.107-.507-.16-.72.16-.214.32-.828 1.044-1.014 1.258-.187.214-.374.24-.697.08-.322-.16-1.36-.5-2.59-1.6c-.958-.855-1.602-1.91-1.79-2.23-.186-.32-.02-.493.14-.653.146-.143.32-.374.482-.56.16-.187.214-.32.32-.533.107-.214.054-.4-.027-.56-.08-.16-.72-1.734-.987-2.373-.26-.625-.526-.54-.72-.55h-.615c-.214 0-.56.08-.854.4-.293.32-1.12 1.1-1.12 2.67s1.146 3.1 1.307 3.31c.16.214 2.253 3.44 5.46 4.823.762.33 1.358.527 1.82.674.767.243 1.464.21 2.015.127.615-.093 1.9-.778 2.167-1.493.268-.715.268-1.328.188-1.45-.08-.12-.294-.2-.615-.36z"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-emerald-600 animate-ping"></span>
          </div>
          <span>Chat on WhatsApp</span>
        </button>
      </div>

      {/* 4. Login Portal Modal Dialog Overlay */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        registeredUsers={registeredUsers}
      />

      {/* Linked script behavior: Transfer item selection details straight to form components */}
      {selectedItemForQuote && (
        <QuoteAutoPopulator 
          item={selectedItemForQuote} 
          setClientName={setSelectedItemForQuote}
        />
      )}

    </div>
  );
}

// Side helper component to handle background state binding without infinite re-renders
function QuoteAutoPopulator({ item, setClientName }: { item: PortfolioItem, setClientName: any }) {
  useEffect(() => {
    // Find form elements in document sandbox to inject values safely without breaking form inputs
    const formSpecsTextarea = document.querySelector('textarea[placeholder*="Please specify detailed requirements"]') as HTMLTextAreaElement;
    const formDimensionsInput = document.querySelector('input[placeholder="E.g., 4m Wide x 2.2m High"]') as HTMLInputElement;
    const formCategoryDropdown = document.querySelector('select[class*="bg-slate-950 border border-slate-850"]') as HTMLSelectElement;

    if (formSpecsTextarea) {
      formSpecsTextarea.value = `Custom Inquiry for ${item.title}: Built with standard specifications: [${item.specs}]. Materials: [${item.materials.join(', ')}]. Base benchmark: [${item.estPriceRange}]`;
      // Trigger synthetically to let react form update it
      const event = new Event('input', { bubbles: true });
      formSpecsTextarea.dispatchEvent(event);
    }
    if (formDimensionsInput) {
      // Clean numbers out of standard properties
      const widthHeightMatched = item.specs.match(/\d+mm/g);
      if (widthHeightMatched && widthHeightMatched.length >= 2) {
        formDimensionsInput.value = `${(parseFloat(widthHeightMatched[0])/1000).toFixed(1)}m x ${(parseFloat(widthHeightMatched[1])/1000).toFixed(1)}m`;
      } else {
        formDimensionsInput.value = "As per catalog specification";
      }
      const event = new Event('input', { bubbles: true });
      formDimensionsInput.dispatchEvent(event);
    }
    if (formCategoryDropdown) {
      formCategoryDropdown.value = item.category;
      const event = new Event('change', { bubbles: true });
      formCategoryDropdown.dispatchEvent(event);
    }
  }, [item]);

  return null;
}
