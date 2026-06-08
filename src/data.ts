import { PortfolioItem, ClientProject, UserAccount, QuoteRequest } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Minimalist Black Steel Sliding Doors',
    description: 'High-security premium sliding doors with a sleek black powder-coated structural steel frame and heavy-duty 10mm impact-resistant tempered glass. Built for smooth glide performance and flawless weathering.',
    category: 'sliding-doors',
    imageUrl: '/src/assets/images/hm_doors_windows_gates_1780923745826.png',
    materials: ['High-tensile structural steel', 'Double-glazed tempered glass', 'Heavy-duty roller tracks', 'Multi-point safety locks'],
    specs: '3000mm Width x 2400mm Height, 2-leaf configuration, custom architectural handle, scratch-proof powder topcoat.',
    estPriceRange: 'UGX 3,500,000 - UGX 6,800,000',
    estDuration: '10 to 14 Days'
  },
  {
    id: 'port-2',
    title: 'Architectural Geometric Compound Gate',
    description: 'A modern bespoke luxury gate showcasing clean laser-cut geometric lines, heavy structural tubing, and integrated pedestrian door entry. Fitted with automated motor-ready roller gears.',
    category: 'gates',
    imageUrl: '/src/assets/images/hm_doors_windows_gates_1780923745826.png',
    materials: ['Galvanized hot-rolled square tubing', 'Solid iron reinforcement brackets', 'Heavy-duty pivot hinges', 'Industrial anti-rust undercoat'],
    specs: '4500mm Gate Opening x 2200mm Height, automation-ready framework, built-in separate secure access keyhole lock.',
    estPriceRange: 'UGX 4,200,000 - UGX 8,500,000',
    estDuration: '14 to 21 Days'
  },
  {
    id: 'port-3',
    title: 'Double-Glazed Commercial Heavy Windows',
    description: 'Fully insulated commercial-grade aluminum and steel reinforced windows. Features thermal break design to keep indoor temperatures comfortable and reduce ambient noise.',
    category: 'windows',
    imageUrl: '/src/assets/images/hm_doors_windows_gates_1780923745826.png',
    materials: ['Reinforced mild steel core', 'Powder-coated aluminum surround', 'Acoustic lamination film', 'Dual silicon heavy weather seals'],
    specs: '1200mm x 1500mm, dual swing/tilt options, fly-screen mesh integration, weather-tight draft rating.',
    estPriceRange: 'UGX 850,000 - UGX 1,500,000 per Unit',
    estDuration: '7 to 10 Days'
  },
  {
    id: 'port-4',
    title: 'Heavy-Duty Industrial Canopy Tents',
    description: 'Engineered heavy-duty outdoor tents designed for high-capacity workshops, agricultural storage, or premier corporate event venues. High wind resistance and tear-proof fire retardant fabric.',
    category: 'tents',
    imageUrl: '/src/assets/images/hm_tents_steel_construction_1780923763181.png',
    materials: ['Hot-dip galvanized circular steel trusses', '850g/m² double PVC-coated polyester textile', 'Expanding anchor plate brackets'],
    specs: '12m Span Width x 24m Length x 4m Eave Height, UV-ray resistance certification, 100% waterproof thermal seals.',
    estPriceRange: 'UGX 12,000,000 - UGX 35,000,000',
    estDuration: '15 to 25 Days'
  },
  {
    id: 'port-5',
    title: 'Structural Steel Warehouse Truss Framework',
    description: 'Precision-engineered industrial steel warehouse trusses and column columns. Prefabricated to extreme tolerances and primed for immediate field assembly to secure multi-level roof weights.',
    category: 'structural-steel',
    imageUrl: '/src/assets/images/hm_tents_steel_construction_1780923763181.png',
    materials: ['I-Beams (Grade Q345B equivalent)', 'C/Z purlins section steel', 'High-tensile chemical anchors', 'Zinc-chromate yellow primer'],
    specs: 'Designed per engineer structural blueprints. Covers span ranges from 15m up to 50m clear-span systems.',
    estPriceRange: 'UGX 25,000,000 - UGX 180,000,000 (Based on Tonnage)',
    estDuration: '20 to 45 Days'
  },
  {
    id: 'port-6',
    title: 'High-Impact Security Window Grilles',
    description: 'Hand-crafted grid burglar-proof steel structural grilles. Perfect protection for residential villas and offices, pairing uncompromising high security with sophisticated geometry.',
    category: 'windows',
    imageUrl: '/src/assets/images/hm_doors_windows_gates_1780923745826.png',
    materials: ['16mm solid square steel rods', 'Cold-rolled steel external frame', 'Hidden internal tamper-resistant masonry bolts'],
    specs: '1500mm x 1500mm modular, geometric lattice pattern, smooth grind welds, high gloss protective lacquer overlay.',
    estPriceRange: 'UGX 550,000 - UGX 950,000 per Window',
    estDuration: '5 to 8 Days'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    email: 'admin@hollyking.com',
    password: 'admin',
    name: 'Hollyking Admin Operator',
    phone: '+256771336689',
    role: 'admin'
  },
  {
    id: 'usr-client-1',
    email: 'client@example.com',
    password: 'client',
    name: 'Ambrose Ayebare',
    phone: '+256703025834',
    companyName: 'Ayebare Properties Ltd',
    role: 'client'
  },
  {
    id: 'usr-client-2',
    email: 'uganda.dev@gmail.com',
    password: 'password',
    name: 'Nsubuga Ronald',
    phone: '+256772200200',
    companyName: 'Ronald Event Planners',
    role: 'client'
  }
];

export const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: 'proj-1',
    contractNumber: 'HK-2026-0034',
    clientId: 'usr-client-1',
    clientName: 'Ambrose Ayebare',
    clientPhone: '+256703025834',
    title: 'Kampala Heights Structural Roof Truss',
    category: 'structural-steel',
    description: 'Fabrication and erection of heavy-span hollow structural steel roofing trusses for the new commercial penthouse complex in Kampala.',
    status: 'fabrication',
    progress: 65,
    startDate: '2026-05-12',
    estCompletionDate: '2026-07-28',
    totalValue: 'UGX 45,000,000',
    amountPaid: 'UGX 30,000,000',
    milestones: [
      { id: 'm-1', title: 'On-site Survey & Measurements', status: 'completed', completedAt: '2026-05-15', description: 'Double check client dimensions and prepare engineered structural drawing sheets.' },
      { id: 'm-2', title: 'Raw Steel Procurement', status: 'completed', completedAt: '2026-05-22', description: 'Acquiring Q345 metal sections, angles, plates and anchor packages.' },
      { id: 'm-3', title: 'Workshop Cutting & Welding', status: 'in-progress', description: 'Jig alignment and robotic welding of industrial hollow truss sections. Anti-rust primer is being sprayed.' },
      { id: 'm-4', title: 'Delivery & Crane Rigging', status: 'pending', description: 'Ship assemblies to Kampala building site and lift to column heads.' },
      { id: 'm-5', title: 'Final Structural Fastening & Handover', status: 'pending', description: 'Torque bolt inspections and hand-off certificate signature.' }
    ],
    media: [
      {
        id: 'med-1',
        url: '/src/assets/images/hm_tents_steel_construction_1780923763181.png',
        name: 'Approved Structural Roof Trusses CAD.png',
        uploadedBy: 'admin',
        uploadedAt: '2026-05-14',
        size: '1.2 MB',
        type: 'blueprint'
      },
      {
        id: 'med-2',
        url: '/src/assets/images/hm_hero_banner_1780923728355.png',
        name: 'Truss Welding Progress Workshop.png',
        uploadedBy: 'admin',
        uploadedAt: '2026-06-01',
        size: '850 KB',
        type: 'image'
      }
    ],
    adminNotes: 'Client requested extra anti-corrosion coating due to height exposure. Prime paint upgrade successful.'
  },
  {
    id: 'proj-2',
    contractNumber: 'HK-2026-0042',
    clientId: 'usr-client-1',
    clientName: 'Ambrose Ayebare',
    clientPhone: '+256703025834',
    title: 'Bespoke Double Sliding Patio Glass Window Set',
    category: 'sliding-doors',
    description: 'Supplying modern powder coated glass sliding doors and aluminum frames for the master lounge facing the valley.',
    status: 'designing',
    progress: 30,
    startDate: '2026-06-02',
    estCompletionDate: '2026-06-25',
    totalValue: 'UGX 7,800,000',
    amountPaid: 'UGX 4,000,000',
    milestones: [
      { id: 'm-201', title: 'CAD Architectural Blueprint Approval', status: 'completed', completedAt: '2026-06-05', description: 'Client APPROVED the double glide leaf schema.' },
      { id: 'm-202', title: 'Glass Selection & Milling', status: 'in-progress', description: 'Cutting the 10mm safety reinforced glass unit.' },
      { id: 'm-203', title: 'Frame Assembly & Track Seeding', status: 'pending', description: 'Welding modern heavy rectangular core profiles around glass sheets.' },
      { id: 'm-204', title: 'Site Fitout & Installation', status: 'pending', description: 'Placing frame guides into structural rough openings, testing seamless glides.' }
    ],
    media: [
      {
        id: 'med-201',
        url: '/src/assets/images/hm_doors_windows_gates_1780923745826.png',
        name: 'Target Fitting Space Site Photo.png',
        uploadedBy: 'client',
        uploadedAt: '2026-06-03',
        size: '980 KB',
        type: 'image'
      }
    ],
    adminNotes: 'Ensure lock set is upgraded as per safety specification.'
  },
  {
    id: 'proj-3',
    contractNumber: 'HK-2026-0010',
    clientId: 'usr-client-2',
    clientName: 'Nsubuga Ronald',
    clientPhone: '+256772200200',
    title: 'Massive Arch Canopy Shed Tent for Events',
    category: 'tents',
    description: 'Heavy canopy event shed designed for high-end wedding receptions, featuring fully hot-rolled steel frame arcs and custom premium PVC membrane sheets.',
    status: 'delivery',
    progress: 90,
    startDate: '2026-04-10',
    estCompletionDate: '2026-06-15',
    totalValue: 'UGX 22,000,000',
    amountPaid: 'UGX 22,000,000',
    milestones: [
      { id: 'm-301', title: 'Framework Designing', status: 'completed', completedAt: '2026-04-13', description: 'Creating secure curved trusses specs.' },
      { id: 'm-302', title: 'Bespoke PVC Fabric Customization', status: 'completed', completedAt: '2026-04-28', description: 'Welding high density 850g fabric panels together.' },
      { id: 'm-303', title: 'Structural Assembly Test', status: 'completed', completedAt: '2026-05-18', description: 'Erecting standard parts inside our central yard to guarantee accuracy.' },
      { id: 'm-304', title: 'Delivery to Ronald Grounds', status: 'in-progress', description: 'Shipping main structures via heavy trailers.' }
    ],
    media: [
      {
        id: 'med-301',
        url: '/src/assets/images/hm_tents_steel_construction_1780923763181.png',
        name: 'Shed Tent Yard Test.png',
        uploadedBy: 'admin',
        uploadedAt: '2026-05-18',
        size: '1.4 MB',
        type: 'image'
      }
    ]
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-1',
    clientName: 'Patricia Namubiru',
    email: 'patricia@gmail.com',
    phone: '+256755443322',
    category: 'windows',
    dimensions: '1.5m x 1.2m (4 units)',
    specifications: 'Double glazing window frames with high-end steel grids for extra home security. Anti-rust gray finish required.',
    urgency: 'medium',
    status: 'sent-quota',
    estimatedCost: 'UGX 3,600,000 total',
    notes: 'Draft quote sent with options for circular grids vs straight security grids.',
    createdAt: '2026-06-03T10:00:00Z'
  },
  {
    id: 'quote-2',
    clientName: 'Ambrose Ayebare',
    email: 'owner@example.com',
    phone: '+256703025834',
    category: 'gates',
    dimensions: '4.2m width x 2.2m height',
    specifications: 'Sliding compound gate with beautiful modern geometrical bars. Remote motor opener tracking mechanism desired.',
    urgency: 'high',
    status: 'received',
    createdAt: '2026-06-07T14:30:00Z'
  }
];
