export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: 'sliding-doors' | 'windows' | 'gates' | 'tents' | 'structural-steel';
  imageUrl: string;
  materials: string[];
  specs: string;
  estPriceRange: string;
  estDuration: string;
}

export interface ProjectMedia {
  id: string;
  url: string; // Base64 or local URL
  name: string;
  uploadedBy: 'client' | 'admin';
  uploadedAt: string;
  size?: string;
  type: 'image' | 'blueprint' | 'document';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: string;
  description: string;
}

export interface ClientProject {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  title: string;
  category: 'sliding-doors' | 'windows' | 'gates' | 'tents' | 'structural-steel';
  description: string;
  status: 'planning' | 'designing' | 'fabrication' | 'inspection' | 'delivery' | 'installed';
  progress: number; // 0 to 100
  startDate: string;
  estCompletionDate: string;
  totalValue: string;
  amountPaid: string;
  milestones: ProjectMilestone[];
  media: ProjectMedia[];
  adminNotes?: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  category: 'sliding-doors' | 'windows' | 'gates' | 'tents' | 'structural-steel';
  dimensions: string; // E.g., "3m x 2.4m"
  specifications: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'received' | 'pricing' | 'sent-quota' | 'confirmed';
  estimatedCost?: string;
  notes?: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string; // Stored in plain text for local simulation
  name: string;
  phone: string;
  companyName?: string;
  role: 'client' | 'admin';
}
