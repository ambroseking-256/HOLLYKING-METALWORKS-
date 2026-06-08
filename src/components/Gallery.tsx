import { useState, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { INITIAL_PORTFOLIO } from '../data';
import { Search, SlidersHorizontal, Ruler, DollarSign, Calendar, Eye, Send, Check, Share2 } from 'lucide-react';
import { PortfolioItem } from '../types';

interface GalleryProps {
  onQuoteWithItem: (item: PortfolioItem) => void;
}

export default function Gallery({ onQuoteWithItem }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusedItem, setFocusedItem] = useState<PortfolioItem | null>(null);
  const [fastQueryText, setFastQueryText] = useState('');
  const [fastQueryPhone, setFastQueryPhone] = useState('');
  const [fastQuerySuccess, setFastQuerySuccess] = useState(false);
  const [shareToastText, setShareToastText] = useState<string | null>(null);

  // Match correct database key
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'sliding-doors', label: 'Sliding Doors' },
    { id: 'windows', label: 'Windows & Grilles' },
    { id: 'gates', label: 'Bespoke Gates' },
    { id: 'tents', label: 'Canopy Tents' },
    { id: 'structural-steel', label: 'Structural Steel' },
  ];

  const filteredItems = INITIAL_PORTFOLIO.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareItem = async (item: PortfolioItem) => {
    const itemUrl = `${window.location.origin}${window.location.pathname}?item=${item.id}`;
    const shareText = `Check out this premier Hollyking metalwork reference: "${item.title}". Range: ${item.estPriceRange}. Build time: ${item.estDuration}.`;
    
    const shareData = {
      title: `Hollyking Metalworks: ${item.title}`,
      text: shareText,
      url: itemUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        triggerToast('Shared successfully!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyFallback(item, itemUrl);
        }
      }
    } else {
      copyFallback(item, itemUrl);
    }
  };

  const copyFallback = async (item: PortfolioItem, url: string) => {
    try {
      await navigator.clipboard.writeText(`Hollyking Metalworks: ${item.title}\nSpecs: ${item.specs}\nEst: ${item.estPriceRange}\nView at: ${url}`);
      triggerToast('Link copied to Clipboard!');
    } catch (err) {
      triggerToast('Unable to copy reference link.');
    }
  };

  const triggerToast = (text: string) => {
    setShareToastText(text);
    setTimeout(() => {
      setShareToastText(null);
    }, 2500);
  };

  const handleFastQuerySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fastQueryPhone) return;
    
    // Simulate query recording
    setFastQuerySuccess(true);
    setTimeout(() => {
      setFastQuerySuccess(false);
      setFastQueryText('');
      setFastQueryPhone('');
      setFocusedItem(null);
    }, 2800);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Alert Indicator */}
      {shareToastText && (
        <div 
          id="share-success-toast"
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-sans font-black text-xs px-4 py-3 rounded-lg shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce uppercase tracking-widest"
        >
          <Check className="w-4 h-4" />
          <span>{shareToastText}</span>
        </div>
      )}

      {/* Upper header block */}
      <div className="max-w-7xl mx-auto mb-10 text-center sm:text-left">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          ARCHITECTURAL & STRUCTURAL <span className="text-amber-500">PORTFOLIO</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Review our physical metalwork fabrications built inside our shop and erected on sites across Kampala and beyond. Filter by architectural category and select any item to learn about its technical properties or request pricing.
        </p>

        {/* Search & Category Filter Section */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
          {/* Categories select row */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded font-sans text-xs font-semibold cursor-pointer uppercase transition-all tracking-wider ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search components or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs pl-10 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Grid display with staggered fade entrances */}
      <div className="max-w-7xl mx-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300 uppercase font-mono tracking-wider">No metalwork items found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Adjust your filters or query to find structural sliding doors, windows, gates, event tents or heavy steel frames.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden hover:border-amber-600/50 transition-all duration-300 flex flex-col justify-between shadow-lg group hover:translate-y-[-4px]"
                id={`item-${item.id}`}
              >
                <div>
                  {/* Aspect Ratio Box */}
                  <div className="aspect-video w-full relative bg-slate-950 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 text-amber-500 text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded border border-slate-800 uppercase">
                      {item.category.replace('-', ' ')}
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[50px] mb-4">
                      {item.description}
                    </p>

                    {/* Short Technical spec chips */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-800/85">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-sans">
                        <Ruler className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.specs}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-sans">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-emerald-400 text-xs">{item.estPriceRange}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-sans">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Fabrication period: {item.estDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom interactive buttons */}
                <div className="px-5 pb-5 pt-3 bg-slate-900/80 flex gap-2">
                  <button
                    onClick={() => setFocusedItem(item)}
                    className="flex-grow inline-flex items-center justify-center gap-1 bg-slate-950 hover:bg-slate-800 text-slate-300 py-2 rounded text-xs transition-all border border-slate-800 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>Specs</span>
                  </button>
                  <button
                    onClick={() => onQuoteWithItem(item)}
                    className="flex-grow inline-flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold py-2 rounded text-xs transition-all cursor-pointer font-bold"
                  >
                    <span>Quote</span>
                  </button>
                  <button
                    id={`btn-share-${item.id}`}
                    onClick={() => handleShareItem(item)}
                    className="px-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-amber-500 rounded border border-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    title="Share metalwork design"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Lightbox Overlay (Specification Modal) */}
      <AnimatePresence>
        {focusedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl my-8"
              id="specifications-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setFocusedItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded p-1"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-950/65 px-2.5 py-1 rounded border border-amber-900/40">
                      {focusedItem.category.replace('-', ' ')}
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-white mt-3 leading-tight">
                      {focusedItem.title}
                    </h3>
                  </div>
                  
                  {/* Share option in specs modal */}
                  <button
                    onClick={() => handleShareItem(focusedItem)}
                    className="mt-6 shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-500 border border-slate-800 rounded font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    title="Share reference sheet with client"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Visual card */}
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={focusedItem.imageUrl}
                    alt={focusedItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Spec sheets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-400 uppercase font-mono tracking-wider text-[10px]">Technical Specifications</h4>
                      <p className="text-slate-200 mt-1 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
                        {focusedItem.specs}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-400 uppercase font-mono tracking-wider text-[10px]">Estimated Price Range</h4>
                      <p className="text-emerald-400 font-bold mt-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-sm">
                        {focusedItem.estPriceRange}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-400 uppercase font-mono tracking-wider text-[10px]">Standard Materials Employed</h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {focusedItem.materials.map((m) => (
                          <span key={m} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-400 uppercase font-mono tracking-wider text-[10px]">Workshop Lead Time</h4>
                      <p className="text-amber-500 font-semibold mt-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                        {focusedItem.estDuration} (Kampala Dispatch)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fast Instant Call-back Inquiry Form */}
                <div className="border-t border-slate-800 pt-5 mt-4">
                  <h4 className="font-display font-medium text-xs text-white uppercase tracking-wider mb-2">
                    Quick Mobile Callback for {focusedItem.title}
                  </h4>
                  
                  {fastQuerySuccess ? (
                    <div className="p-3.5 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Thank you! We registered your request. An engineer will call you back shortly.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleFastQuerySubmit} className="flex gap-2">
                      <input
                        type="tel"
                        required
                        placeholder="Your MTN/Airtel Phone (+256...)"
                        value={fastQueryPhone}
                        onChange={(e) => setFastQueryPhone(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 py-2 text-xs font-bold rounded transition-all cursor-pointer select-none"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Call Me</span>
                      </button>
                    </form>
                  )}
                  <p className="text-[9px] text-slate-500 mt-2 font-mono">
                    *For direct emergency metal inquiries, you can also dial +256 703 025 834 or +256 771 336 689.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
