import { ArrowRight, Drill, ShieldCheck, Clock, Layers, Sparkles, Phone, HelpCircle, HardHat, FileText } from 'lucide-react';
import { useState } from 'react';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
}

export default function Home({ onNavigate, onOpenLogin }: HomeProps) {
  // Calculator state
  const [calcWidth, setCalcWidth] = useState<number>(3);
  const [calcHeight, setCalcHeight] = useState<number>(2.4);
  const [calcCategory, setCalcCategory] = useState<'doors' | 'windows' | 'gates' | 'trusses'>('doors');
  const [calcMetalType, setCalcMetalType] = useState<'mild-steel' | 'galvanized' | 'aluminum'>('mild-steel');

  // Simple estimations based on dimensions
  const handleCalculate = () => {
    const area = calcWidth * calcHeight;
    let baseWeightPerSqm = 18; // kg
    let pricePerSqm = 350000; // UGX

    if (calcCategory === 'windows') {
      baseWeightPerSqm = 12;
      pricePerSqm = 240000;
    } else if (calcCategory === 'gates') {
      baseWeightPerSqm = 35;
      pricePerSqm = 420000;
    } else if (calcCategory === 'trusses') {
      baseWeightPerSqm = 25;
      pricePerSqm = 550000;
    }

    if (calcMetalType === 'galvanized') {
      baseWeightPerSqm *= 1.15;
      pricePerSqm *= 1.2;
    } else if (calcMetalType === 'aluminum') {
      baseWeightPerSqm *= 0.4;
      pricePerSqm *= 1.4;
    }

    const totalWeight = Math.round(area * baseWeightPerSqm);
    const estCost = Math.round(area * pricePerSqm);

    return {
      weight: totalWeight,
      cost: estCost.toLocaleString(),
      time: calcCategory === 'trusses' ? '15-20 Days' : '7-12 Days'
    };
  };

  const calcResult = handleCalculate();

  const services = [
    {
      title: 'Sliding Doors',
      desc: 'Precision roller gears, solid frames and heavy insulation glass panels. Custom designed for internal rooms, modern lounges & high-exposure commercial entrances.',
      icon: Layers,
      accent: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'Modern Windows',
      desc: 'Double-glazed soundproof options and robust burglar-proof steel structural security grilles that elevate security and natural daylight simultaneously.',
      icon: Sparkles,
      accent: 'from-amber-600 to-red-700',
    },
    {
      title: 'Architectural Gates',
      desc: 'Elite double-swing cathedral gates, horizontal timber-metal fusions, and fully automated custom rolling compound gates crafted to command prestige.',
      icon: ShieldCheck,
      accent: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'Heavy Canopy Tents',
      desc: 'Industrial clear-span tents, exhibition shaded structures, carports, and customized heavy-duty canvas fabrics tightly clamped over galvanized circular steel arches.',
      icon: Drill,
      accent: 'from-purple-600 to-fuchsia-700',
    },
    {
      title: 'Structural Steel',
      desc: 'Engineered high-tonnage warehouse roof trusses, columns, and mezzanine frameworks safely bolted and welded to resist wind loads.',
      icon: HardHat,
      accent: 'from-slate-700 to-slate-900',
    }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Dynamic Hero Banner Segment */}
      <div className="relative py-20 lg:py-28 overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-cover bg-center">
          <img 
            src="/src/assets/images/hm_hero_banner_1780923728355.png" 
            alt="Hollyking Metal Manufacturing sparks"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/90 text-amber-500 border border-amber-800 rounded-full text-xs font-mono mb-6">
              <span className="w-2 opacity-100 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>ESTABLISHED IN UGANDA — QUALITY METALWORKS CRAFTSMANSHIP</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              HOLLYKING <span className="text-amber-500">METALWORKS</span> U.LTD
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              We engineer, fabricate, and erect professional-grade metal architectural fittings and heavy structural steel framing. From bespoke sliding doors to giant clear-span canopy sheds, our work is forged to endure.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-display font-semibold text-sm rounded-lg transition-all shadow-md transform active:scale-95 cursor-pointer text-center"
              >
                <span>Browse Portfolio Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-display font-semibold text-sm rounded-lg transition-all cursor-pointer text-center"
              >
                <span>Request Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Highlights Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
            Specialized Metal fabrication Services
          </h2>
          <div className="w-16 h-1 mt-3 bg-amber-500 mx-auto rounded"></div>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            We operate a dedicated Kampala workshop utilizing modern machinery to construct residential and heavy commercial projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((svc) => {
            const IconComp = svc.icon;
            return (
              <div 
                key={svc.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-600/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${svc.accent} flex items-center justify-center mb-4 text-white shadow`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                  <button 
                    onClick={() => onNavigate('gallery')}
                    className="text-[10px] font-mono tracking-wider font-semibold uppercase text-amber-500 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>View examples</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-Column Interactive Calculator & Project Portal Callout */}
      <section className="py-12 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Interactive Steel Estimation Tool */}
          <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Drill className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-bold text-lg text-white">
                  Insta-Estimator: Metalwork Weight & Cost Calculator
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-6 font-sans">
                Get an instant estimate for your metal components. Simply toggle dimensions, material selections, and project groupings to size-up material payloads.
              </p>

              {/* Form elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Project Category</label>
                  <select 
                    value={calcCategory} 
                    onChange={(e) => setCalcCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="doors">Sliding Doors Frame</option>
                    <option value="windows">Window Grilles / Panels</option>
                    <option value="gates">Entrance Gate Structures</option>
                    <option value="trusses">Structural Trusses Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Material Composition</label>
                  <select 
                    value={calcMetalType} 
                    onChange={(e) => setCalcMetalType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="mild-steel">Mild Steel Carbon Section</option>
                    <option value="galvanized">Hot-Dip Galvanized Anti-Corrosive</option>
                    <option value="aluminum">Premium Lightweight Aluminum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Width in Metres ({calcWidth}m)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="0.5"
                    value={calcWidth}
                    onChange={(e) => setCalcWidth(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1m</span>
                    <span>15m max</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">Height in Metres ({calcHeight}m)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="6" 
                    step="0.2"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1m</span>
                    <span>6m max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Numerical Results area */}
            <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-lg grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Estimated Area</span>
                <span className="text-sm sm:text-base font-display font-bold text-white">{(calcWidth * calcHeight).toFixed(2)} m²</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Weight Payload</span>
                <span className="text-sm sm:text-base font-display font-bold text-amber-500">{calcResult.weight} kg approx</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Estimated Base Price</span>
                <span className="text-xs sm:text-sm font-display font-black text-emerald-400">UGX {calcResult.cost}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-3 text-center italic">
              *Calculations are for benchmark estimates only. Custom metal grades may fluctuate costs.
            </p>
          </div>

          {/* Column 2: Interactive Client Platform Showcase */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2 py-0.5 bg-amber-950 text-amber-500 border border-amber-800/60 rounded text-[9px] font-mono mb-3 uppercase">
                Client Workspace Enabled
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Real-Time Client Milestone Tracking
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                We believe in full engineering transparency. Our advanced customer tracking platform allows you to:
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                  <span>Track progressive stages: CAD approval, Raw procurement, Fabrication, Inspection, and Handover.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                  <span>Direct **Media Upload Space** to drop blueprint modifications, design ideas, or site dimension sheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                  <span>Instant contract payment balancing and engineer workshop notes.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <button 
                onClick={onOpenLogin}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-500 border border-amber-500/35 hover:border-amber-500 font-display font-bold text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Access Your Tracking Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Call Centers & Contacts Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-xl">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              HAVE A DESIGN READY OR NEED A SURVEY?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Speak directly with our Chief Engineer or workshop dispatch coordinator. We provide structural calculations, design modeling, and swift site assessments throughout Uganda.
            </p>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold">Chief Liaison Office:</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="tel:+256703025834" 
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs text-amber-500 font-mono rounded hover:bg-amber-600 hover:text-slate-950 transition-all font-bold"
                >
                  +256 703 025 834 (Airtel)
                </a>
                <a 
                  href="tel:+256771336689" 
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-xs text-amber-500 font-mono rounded hover:bg-amber-600 hover:text-slate-950 transition-all font-bold"
                >
                  +256 771 336 689 (MTN)
                </a>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <button
               onClick={() => onNavigate('contact')}
               className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-display font-medium text-sm rounded-lg transition-all shadow cursor-pointer font-bold"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Custom Request</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
