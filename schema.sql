-- ====================================================================
-- PostgreSQL Database Schema & Seeding Script
-- Application: Hollyking Metal Fabricators
-- Registered: Kampala, Uganda • Est. 2026
-- Date: June 08, 2026
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Database Cleanup (Safe Execution & Re-seeding)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS client_projects CASCADE;
DROP TABLE IF EXISTS quote_requests CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS user_accounts CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS metalwork_category CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS milestone_status CASCADE;
DROP TYPE IF EXISTS media_uploader CASCADE;
DROP TYPE IF EXISTS media_type CASCADE;
DROP TYPE IF EXISTS quote_urgency CASCADE;
DROP TYPE IF EXISTS quote_status CASCADE;

-- --------------------------------------------------------------------
-- 2. Custom Type Formats / Domains
-- --------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE metalwork_category AS ENUM ('sliding-doors', 'windows', 'gates', 'tents', 'structural-steel');
CREATE TYPE project_status AS ENUM ('planning', 'designing', 'fabrication', 'inspection', 'delivery', 'installed');
CREATE TYPE milestone_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE media_uploader AS ENUM ('client', 'admin');
CREATE TYPE media_type AS ENUM ('image', 'blueprint', 'document');
CREATE TYPE quote_urgency AS ENUM ('high', 'medium', 'low');
CREATE TYPE quote_status AS ENUM ('received', 'pricing', 'sent-quota', 'confirmed');

-- --------------------------------------------------------------------
-- 3. Solid Relational Table Layouts
-- --------------------------------------------------------------------

-- User Accounts
CREATE TABLE user_accounts (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Plain text for simplified tracking / Hashed in production
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catalog Portfolio Items
CREATE TABLE portfolio_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category metalwork_category NOT NULL,
    image_url TEXT NOT NULL,
    materials TEXT[] NOT NULL, -- Heavy-duty text array
    specs TEXT NOT NULL,
    est_price_range VARCHAR(100) NOT NULL,
    est_duration VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client Quotes Submissions
CREATE TABLE quote_requests (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    category metalwork_category NOT NULL,
    dimensions VARCHAR(100) NOT NULL,
    specifications TEXT NOT NULL,
    urgency quote_urgency NOT NULL DEFAULT 'medium',
    status quote_status NOT NULL DEFAULT 'received',
    estimated_cost VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Active Building / Fabrication Projects
CREATE TABLE client_projects (
    id VARCHAR(50) PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    client_id VARCHAR(50) REFERENCES user_accounts(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category metalwork_category NOT NULL,
    description TEXT NOT NULL,
    status project_status NOT NULL DEFAULT 'planning',
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    start_date DATE NOT NULL,
    est_completion_date DATE NOT NULL,
    total_value VARCHAR(100) NOT NULL,
    amount_paid VARCHAR(100) NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Building Milestones
CREATE TABLE project_milestones (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status milestone_status NOT NULL DEFAULT 'pending',
    completed_at DATE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project Attachments / Blueprints Media
CREATE TABLE project_media (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    uploaded_by media_uploader NOT NULL DEFAULT 'client',
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    size VARCHAR(50),
    type media_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 4. High-Performance Indices
-- --------------------------------------------------------------------
CREATE INDEX idx_user_role ON user_accounts(role);
CREATE INDEX idx_portfolio_category ON portfolio_items(category);
CREATE INDEX idx_quote_status ON quote_requests(status);
CREATE INDEX idx_project_client ON client_projects(client_id);
CREATE INDEX idx_project_status ON client_projects(status);
CREATE INDEX idx_milestone_project ON project_milestones(project_id);
CREATE INDEX idx_media_project ON project_media(project_id);


-- ====================================================================
-- 5. Seed Insertion Seed Data (Matching src/data.ts)
-- ====================================================================

-- A. Users Seeding
INSERT INTO user_accounts (id, email, password, name, phone, company_name, role) VALUES
('usr-admin', 'admin@hollyking.com', 'admin', 'Hollyking Admin Operator', '+256771336689', NULL, 'admin'),
('usr-client-1', 'client@example.com', 'client', 'Ambrose Ayebare', '+256703025834', 'Ayebare Properties Ltd', 'client'),
('usr-client-2', 'uganda.dev@gmail.com', 'password', 'Nsubuga Ronald', '+256772200200', 'Ronald Event Planners', 'client');

-- B. Portfolio Seeding
INSERT INTO portfolio_items (id, title, description, category, image_url, materials, specs, est_price_range, est_duration) VALUES
('port-1', 'Minimalist Black Steel Sliding Doors', 'High-security premium sliding doors with a sleek black powder-coated structural steel frame and heavy-duty 10mm impact-resistant tempered glass. Built for smooth glide performance and flawless weathering.', 'sliding-doors', '/src/assets/images/hm_doors_windows_gates_1780923745826.png', ARRAY['High-tensile structural steel', 'Double-glazed tempered glass', 'Heavy-duty roller tracks', 'Multi-point safety locks'], '3000mm Width x 2400mm Height, 2-leaf configuration, custom architectural handle, scratch-proof powder topcoat.', 'UGX 3,500,000 - UGX 6,800,000', '10 to 14 Days'),
('port-2', 'Architectural Geometric Compound Gate', 'A modern bespoke luxury gate showcasing clean laser-cut geometric lines, heavy structural tubing, and integrated pedestrian door entry. Fitted with automated motor-ready roller gears.', 'gates', '/src/assets/images/hm_doors_windows_gates_1780923745826.png', ARRAY['Galvanized hot-rolled square tubing', 'Solid iron reinforcement brackets', 'Heavy-duty pivot hinges', 'Industrial anti-rust undercoat'], '4500mm Gate Opening x 2200mm Height, automation-ready framework, built-in separate secure access keyhole lock.', 'UGX 4,200,000 - UGX 8,500,000', '14 to 21 Days'),
('port-3', 'Double-Glazed Commercial Heavy Windows', 'Fully insulated commercial-grade aluminum and steel reinforced windows. Features thermal break design to keep indoor temperatures comfortable and reduce ambient noise.', 'windows', '/src/assets/images/hm_doors_windows_gates_1780923745826.png', ARRAY['Reinforced mild steel core', 'Powder-coated aluminum surround', 'Acoustic lamination film', 'Dual silicon heavy weather seals'], '1200mm x 1500mm, dual swing/tilt options, fly-screen mesh integration, weather-tight draft rating.', 'UGX 850,000 - UGX 1,500,000 per Unit', '7 to 10 Days'),
('port-4', 'Heavy-Duty Industrial Canopy Tents', 'Engineered heavy-duty outdoor tents designed for high-capacity workshops, agricultural storage, or premier corporate event venues. High wind resistance and tear-proof fire retardant fabric.', 'tents', '/src/assets/images/hm_tents_steel_construction_1780923763181.png', ARRAY['Hot-dip galvanized circular steel trusses', '850g/m² double PVC-coated polyester textile', 'Expanding anchor plate brackets'], '12m Span Width x 24m Length x 4m Eave Height, UV-ray resistance certification, 100% waterproof thermal seals.', 'UGX 12,000,000 - UGX 35,000,000', '15 to 25 Days'),
('port-5', 'Structural Steel Warehouse Truss Framework', 'Precision-engineered industrial steel warehouse trusses and column columns. Prefabricated to extreme tolerances and primed for immediate field assembly to secure multi-level roof weights.', 'structural-steel', '/src/assets/images/hm_tents_steel_construction_1780923763181.png', ARRAY['I-Beams (Grade Q345B equivalent)', 'C/Z purlins section steel', 'High-tensile chemical anchors', 'Zinc-chromate yellow primer'], 'Designed per engineer structural blueprints. Covers span ranges from 15m up to 50m clear-span systems.', 'UGX 25,000,000 - UGX 180,000,000 (Based on Tonnage)', '20 to 45 Days'),
('port-6', 'High-Impact Security Window Grilles', 'Hand-crafted grid burglar-proof steel structural grilles. Perfect protection for residential villas and offices, pairing uncompromising high security with sophisticated geometry.', 'windows', '/src/assets/images/hm_doors_windows_gates_1780923745826.png', ARRAY['16mm solid square steel rods', 'Cold-rolled steel external frame', 'Hidden internal tamper-resistant masonry bolts'], '1500mm x 1500mm modular, geometric lattice pattern, smooth grind welds, high gloss protective lacquer overlay.', 'UGX 550,000 - UGX 950,000 per Window', '5 to 8 Days');

-- C. Project Requests Seeding
INSERT INTO quote_requests (id, client_name, email, phone, category, dimensions, specifications, urgency, status, estimated_cost, notes, created_at) VALUES
('quote-1', 'Patricia Namubiru', 'patricia@gmail.com', '+256755443322', 'windows', '1.5m x 1.2m (4 units)', 'Double glazing window frames with high-end steel grids for extra home security. Anti-rust gray finish required.', 'medium', 'sent-quota', 'UGX 3,600,000 total', 'Draft quote sent with options for circular grids vs straight security grids.', '2026-06-03 10:00:00+00'),
('quote-2', 'Ambrose Ayebare', 'owner@example.com', '+256703025834', 'gates', '4.2m width x 2.2m height', 'Sliding compound gate with beautiful modern geometrical bars. Remote motor opener tracking mechanism desired.', 'high', 'received', NULL, NULL, '2026-06-07 14:30:00+00');

-- D. Client Projects Seeding
INSERT INTO client_projects (id, contract_number, client_id, client_name, client_phone, title, category, description, status, progress, start_date, est_completion_date, total_value, amount_paid, admin_notes) VALUES
('proj-1', 'HK-2026-0034', 'usr-client-1', 'Ambrose Ayebare', '+256703025834', 'Kampala Heights Structural Roof Truss', 'structural-steel', 'Fabrication and erection of heavy-span hollow structural steel roofing trusses for the new commercial penthouse complex in Kampala.', 'fabrication', 65, '2026-05-12', '2026-07-28', 'UGX 45,000,000', 'UGX 30,000,000', 'Client requested extra anti-corrosion coating due to height exposure. Prime paint upgrade successful.'),
('proj-2', 'HK-2026-0042', 'usr-client-1', 'Ambrose Ayebare', '+256703025834', 'Bespoke Double Sliding Patio Glass Window Set', 'sliding-doors', 'Supplying modern powder coated glass sliding doors and aluminum frames for the master lounge facing the valley.', 'designing', 30, '2026-06-02', '2026-06-25', 'UGX 7,800,000', 'UGX 4,000,000', 'Ensure lock set is upgraded as per safety specification.'),
('proj-3', 'HK-2026-0010', 'usr-client-2', 'Nsubuga Ronald', '+256772200200', 'Massive Arch Canopy Shed Tent for Events', 'tents', 'Heavy canopy event shed designed for high-end wedding receptions, featuring fully hot-rolled steel frame arcs and custom premium PVC membrane sheets.', 'delivery', 90, '2026-04-10', '2026-06-15', 'UGX 22,000,000', 'UGX 22,000,000', NULL);

-- E. Milestones Seeding
INSERT INTO project_milestones (id, project_id, title, status, completed_at, description) VALUES
('m-1', 'proj-1', 'On-site Survey & Measurements', 'completed', '2026-05-15', 'Double check client dimensions and prepare engineered structural drawing sheets.'),
('m-2', 'proj-1', 'Raw Steel Procurement', 'completed', '2026-05-22', 'Acquiring Q345 metal sections, angles, plates and anchor packages.'),
('m-3', 'proj-1', 'Workshop Cutting & Welding', 'in-progress', NULL, 'Jig alignment and robotic welding of industrial hollow truss sections. Anti-rust primer is being sprayed.'),
('m-4', 'proj-1', 'Delivery & Crane Rigging', 'pending', NULL, 'Ship assemblies to Kampala building site and lift to column heads.'),
('m-5', 'proj-1', 'Final Structural Fastening & Handover', 'pending', NULL, 'Torque bolt inspections and hand-off certificate signature.'),

('m-201', 'proj-2', 'CAD Architectural Blueprint Approval', 'completed', '2026-06-05', 'Client APPROVED the double glide leaf schema.'),
('m-202', 'proj-2', 'Glass Selection & Milling', 'in-progress', NULL, 'Cutting the 10mm safety reinforced glass unit.'),
('m-203', 'proj-2', 'Frame Assembly & Track Seeding', 'pending', NULL, 'Welding modern heavy rectangular core profiles around glass sheets.'),
('m-204', 'proj-2', 'Site Fitout & Installation', 'pending', NULL, 'Placing frame guides into structural rough openings, testing seamless glides.'),

('m-301', 'proj-3', 'Framework Designing', 'completed', '2026-04-13', 'Creating secure curved trusses specs.'),
('m-302', 'proj-3', 'Bespoke PVC Fabric Customization', 'completed', '2026-04-28', 'Welding high density 850g fabric panels together.'),
('m-303', 'proj-3', 'Structural Assembly Test', 'completed', '2026-05-18', 'Erecting standard parts inside our central yard to guarantee accuracy.'),
('m-304', 'proj-3', 'Delivery to Ronald Grounds', 'in-progress', NULL, 'Shipping main structures via heavy trailers.');

-- F. Project Media Seeding
INSERT INTO project_media (id, project_id, url, name, uploaded_by, uploaded_at, size, type) VALUES
('med-1', 'proj-1', '/src/assets/images/hm_tents_steel_construction_1780923763181.png', 'Approved Structural Roof Trusses CAD.png', 'admin', '2026-05-14', '1.2 MB', 'blueprint'),
('med-2', 'proj-1', '/src/assets/images/hm_hero_banner_1780923728355.png', 'Truss Welding Progress Workshop.png', 'admin', '2026-06-01', '850 KB', 'image'),
('med-201', 'proj-2', '/src/assets/images/hm_doors_windows_gates_1780923745826.png', 'Target Fitting Space Site Photo.png', 'client', '2026-06-03', '980 KB', 'image'),
('med-301', 'proj-3', '/src/assets/images/hm_tents_steel_construction_1780923763181.png', 'Shed Tent Yard Test.png', 'admin', '2026-05-18', '1.4 MB', 'image');
