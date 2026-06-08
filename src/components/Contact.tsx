import { useState, FormEvent } from 'react';
import { QuoteRequest } from '../types';
import { 
  Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2, ListFilter, ShieldAlert, Award, FileText, Sparkles 
} from 'lucide-react';

interface ContactProps {
  quotes: QuoteRequest[];
  onSubmitQuote: (quote: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateQuoteStatus?: (quoteId: string, status: 'pricing' | 'sent-quota' | 'confirmed', estimatedCost?: string) => void;
  currentUser: any;
}

export default function Contact({
  quotes,
  onSubmitQuote,
  onUpdateQuoteStatus,
  currentUser
}: ContactProps) {
  // Form state
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'sliding-doors' | 'windows' | 'gates' | 'tents' | 'structural-steel'>('sliding-doors');
  const [dimensions, setDimensions] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>('medium');
  
  const [success, setSuccess] = useState(false);

  // Admin simulation states
  const [quoteCostEdit, setQuoteCostEdit] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !specifications) return;
    
    onSubmitQuote({
      clientName,
      email: email || 'not-specified@example.com',
      phone,
      category,
      dimensions: dimensions || 'To be calculated by site survey',
      specifications,
      urgency
    });

    setSuccess(true);
    // Reset Form
    setClientName('');
    setEmail('');
    setPhone('');
    setDimensions('');
    setSpecifications('');
    setUrgency('medium');

    setTimeout(() => {
      setSuccess(false);
    }, 4500);
  };

  const handleAdminPriceUpdate = (quoteId: string) => {
    const cost = quoteCostEdit[quoteId];
    if (!cost || !onUpdateQuoteStatus) return;
    
    onUpdateQuoteStatus(quoteId, 'sent-quota', cost);
    // Clear state check
    setQuoteCostEdit({
      ...quoteCostEdit,
      [quoteId]: ''
    });
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center sm:text-left mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            REQUEST A CUSTOM <span className="text-amber-500">ESTIMATE</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Submit your site measurements, drawing plans or project requirements below. Our workshop engineers calculate customized bills of materials and deliver formal digital quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 5 COLUMNS: PHONE CONTACT INFORMATION & CORNER DETAILS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Contact Card highlighting required numbers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl"></div>
              
              <h3 className="font-display font-extrabold text-lg text-white mb-4 uppercase">
                Direct Work Desks
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Contact our head offices in Kampala for instant support regarding structural design metrics and site survey appointments.
              </p>

              <div className="space-y-4">
                <a 
                  href="tel:+256703025834" 
                  className="flex items-center gap-3.5 bg-slate-950 p-3.5 rounded-lg border border-slate-850 hover:border-amber-600/50 transition-all select-none group"
                >
                  <div className="p-2.5 bg-amber-950/40 text-amber-500 rounded border border-amber-900/40 group-hover:scale-105 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">Airtel Corporate Desk</span>
                    <span className="text-sm font-bold text-white font-mono tracking-tight group-hover:text-amber-500 transition-colors">+256 703 025 834</span>
                  </div>
                </a>

                <a 
                  href="tel:+256771336689" 
                  className="flex items-center gap-3.5 bg-slate-950 p-3.5 rounded-lg border border-slate-850 hover:border-amber-600/50 transition-all select-none group"
                >
                  <div className="p-2.5 bg-amber-950/40 text-amber-500 rounded border border-amber-900/40 group-hover:scale-105 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-slate-500 uppercase font-semibold">MTN Operations Desk</span>
                    <span className="text-sm font-bold text-white font-mono tracking-tight group-hover:text-amber-500 transition-colors">+256 771 336 689</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 px-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400 font-mono">info@hollykingmetalworks.com</span>
                </div>

                <div className="flex items-center gap-3 px-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400 font-sans">Plot 24, Industrial Area Road, Kampala, Uganda</span>
                </div>

                {/* WhatsApp Quick Link Buttons */}
                <div className="pt-4 border-t border-slate-850 space-y-2">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">WhatsApp Live Chat</span>
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href="https://wa.me/256703025834?text=Hello%20Airtel%20Desk,%20I'd%20like%20to%20request%20a%20quote%20for%20metal%20fabrication..."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-2 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-900/60 transition-all hover:scale-105"
                    >
                      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.91.538 3.69 1.474 5.22L2.05 22l4.904-1.285c1.47.785 3.125 1.285 5.05 1.285 5.524 0 10-4.48 10-10S17.528 2 12.004 2z"/>
                      </svg>
                      <span>Airtel WA</span>
                    </a>
                    
                    <a 
                      href="https://wa.me/256771336689?text=Hello%20MTN%20Desk,%20I'd%20like%20to%20request%20a%20quote%20for%20metal%20fabrication..."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-2 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-900/60 transition-all hover:scale-105"
                    >
                      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.91.538 3.69 1.474 5.22L2.05 22l4.904-1.285c1.47.785 3.125 1.285 5.05 1.285 5.524 0 10-4.48 10-10S17.528 2 12.004 2z"/>
                      </svg>
                      <span>MTN WA</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Official Social Media Channels Info Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h3 className="font-display font-extrabold text-sm text-white mb-2 uppercase tracking-wide">
                Social Media Platforms
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://www.tiktok.com/@hollyking_metal_fabricators" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-850 hover:border-amber-600/50 transition-all select-none group"
                >
                  <div className="p-2 bg-slate-900 text-amber-500 rounded border border-slate-800 group-hover:scale-110 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.53 0c.1 0 .21 0 .31.01v4.83l.02-.01c1.38-1.02 3.1-1.63 4.96-1.63v3.7c-2.14 0-3.93-1.25-4.78-3.07v10.4c0 3.81-3.1 6.9-6.9 6.9S0 18.13 0 14.32s3.1-6.9 6.9-6.9c.8 0 1.56.14 2.27.39V0h3.36zm-5.63 11.2a3.11 3.11 0 100 6.22 3.11 3.11 0 000-6.22z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase font-semibold">TikTok Feed</span>
                    <span className="text-xs font-bold text-white font-sans group-hover:text-amber-500 transition-colors">hollyking metal fabricators</span>
                  </div>
                </a>

                <a 
                  href="https://www.facebook.com/ayebare.ambroseking" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-850 hover:border-amber-600/50 transition-all select-none group"
                >
                  <div className="p-2 bg-slate-900 text-amber-500 rounded border border-slate-800 group-hover:scale-110 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase font-semibold">Facebook Page</span>
                    <span className="text-xs font-bold text-white font-sans group-hover:text-amber-500 transition-colors">ayebare ambroseking</span>
                  </div>
                </a>

                <a 
                  href="https://x.com/ambroseayebare12" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-850 hover:border-amber-600/50 transition-all select-none group"
                >
                  <div className="p-2 bg-slate-900 text-amber-500 rounded border border-slate-800 group-hover:scale-110 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase font-semibold">X / Twitter Channel</span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">ambroseayebare12</span>
                  </div>
                </a>
              </div>
            </div>

            {/* QA Badging details */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex gap-3 mb-3">
                <Award className="w-6 h-6 text-amber-500 shrink-0" />
                <h4 className="font-display font-bold text-sm text-white uppercase">Our Integrity Guarantee</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• **Structural Integrity**: Built according to heavy-duty architectural design specifications.</li>
                <li>• **Premium Finishes**: Double-spray anti-rust protection and UV-safe topcoats are standard.</li>
                <li>• **On-Site Installation**: Guided safe delivery, rigging, crane fits, and anchor fasteners.</li>
              </ul>
            </div>

          </div>

          {/* RIGHT 8 COLUMNS: DETAILED CUSTOM QUOTATION FORM */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
              <h3 className="font-display font-extrabold text-lg text-white mb-4">
                Structured Request Form
              </h3>

              {success ? (
                <div className="p-4 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold">Quotation Request Successfully Registered!</span>
                    <p className="text-xs text-emerald-500/90 mt-1">
                      Our structural estimating department will review your physical parameters and prepare a customized estimate. We will call you on the provided number.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Your Full Name / Company *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Ambrose Ayebare"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Phone Number (Airtel or MTN) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g., +256 703 025 834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="E.g., owner@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Required Specialty Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="sliding-doors">Sliding Doors & Glazing</option>
                        <option value="windows">Security Windows & Grilles</option>
                        <option value="gates">Architectural Ornamental Gates</option>
                        <option value="tents">Heavy Canopy Tents</option>
                        <option value="structural-steel">Structural Steel Construction</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Target Dimension Parameters (Width x Height)</label>
                      <input
                        type="text"
                        placeholder="E.g., 4m Wide x 2.2m High"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Project Urgency Level</label>
                      <div className="flex gap-3">
                        {['low', 'medium', 'high'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setUrgency(lvl as any)}
                            className={`flex-1 py-1.5 rounded uppercase font-mono text-[10px] border tracking-wider transition-all cursor-pointer ${
                              urgency === lvl
                                ? 'bg-amber-600 border-amber-600 text-slate-950 font-bold'
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Custom specifications, Materials & Core Details *</label>
                    <textarea
                      required
                      placeholder="Please specify detailed requirements (E.g. Double swing, automatic hydraulic rolling gear, burglar grilles mesh code, 10mm insulated tinted locks, galvanized materials preference etc.)"
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded p-2.5 text-xs text-white uppercase-labels-neutral focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[100px]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-display font-extrabold text-sm rounded shadow transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Estimate Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Simulated Live Quotes Ledger Table for visual feedback & interaction */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md" id="quotes-history-ledger">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Simulated Estimate Inbox / Pricing Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    See where estimate queries land. Under the active Admin demo account, you can simulate pricing and reply directly with price counts!
                  </p>
                </div>
              </div>

              {quotes.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No estimate submissions lodged yet.</p>
              ) : (
                <div className="space-y-4">
                  {quotes.map((q) => (
                    <div 
                      key={q.id}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{q.clientName}</span>
                          <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold text-[9px]">
                            {q.category.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 italic font-mono leading-normal">
                          "{q.specifications}"
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                          <div>Dimensions: {q.dimensions} | Mobile: {q.phone}</div>
                          <div>Status: <span className="text-amber-400 uppercase">{q.status}</span></div>
                        </div>

                        {q.estimatedCost && (
                          <div className="mt-2 text-xs text-emerald-400 font-mono">
                            ⚡ Price Offered: <span className="font-bold font-display text-white">{q.estimatedCost}</span>
                          </div>
                        )}
                      </div>

                      {/* Admin action update */}
                      {currentUser?.role === 'admin' && q.status === 'received' && onUpdateQuoteStatus && (
                        <div className="sm:self-end shrink-0 w-full sm:w-auto">
                          <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">State Price Offer (UGX)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="E.g., UGX 4.5M"
                              value={quoteCostEdit[q.id] || ''}
                              onChange={(e) => setQuoteCostEdit({
                                ...quoteCostEdit,
                                [q.id]: e.target.value
                              })}
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white max-w-[120px] focus:outline-none"
                            />
                            <button
                              onClick={() => handleAdminPriceUpdate(q.id)}
                              className="px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded transition-all cursor-pointer"
                            >
                              Send Quote
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
