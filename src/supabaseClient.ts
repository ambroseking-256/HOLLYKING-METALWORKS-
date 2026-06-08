import { createClient } from '@supabase/supabase-js';
import { QuoteRequest, UserAccount, ClientProject, ProjectMedia } from './types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust Supabase API Integration Helpers
 */

// 1. Submit a Quote Request
export async function dbSubmitQuote(quote: QuoteRequest): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .insert([
        {
          id: quote.id,
          client_name: quote.clientName,
          email: quote.email,
          phone: quote.phone,
          category: quote.category,
          dimensions: quote.dimensions,
          specifications: quote.specifications,
          urgency: quote.urgency,
          status: quote.status,
          estimated_cost: quote.estimatedCost,
          notes: quote.notes,
          created_at: quote.createdAt,
        }
      ]);
    if (error) {
      console.warn('Supabase DB Insert Error for quote_requests:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert quote into Supabase:', err);
    return false;
  }
}

// 2. Fetch all Quote Requests
export async function dbFetchQuotes(): Promise<QuoteRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Supabase Fetch Error for quote_requests:', error.message);
      return null;
    }
    
    return data.map((item: any) => ({
      id: item.id,
      clientName: item.client_name,
      email: item.email,
      phone: item.phone,
      category: item.category,
      dimensions: item.dimensions,
      specifications: item.specifications,
      urgency: item.urgency,
      status: item.status,
      estimatedCost: item.estimated_cost,
      notes: item.notes,
      createdAt: item.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Failed to fetch quotes from Supabase:', err);
    return null;
  }
}

// 3. Register a New User Account
export async function dbRegisterUser(user: UserAccount): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_accounts')
      .insert([
        {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          company_name: user.companyName,
          role: user.role,
        }
      ]);
    if (error) {
      console.warn('Supabase DB Insert Error for user_accounts:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert user into Supabase:', err);
    return false;
  }
}

// 4. Fetch User Accounts for credential checking
export async function dbFetchUsers(): Promise<UserAccount[] | null> {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*');
    
    if (error) {
      console.warn('Supabase Fetch Error for user_accounts:', error.message);
      return null;
    }
    
    return data.map((item: any) => ({
      id: item.id,
      email: item.email,
      password: item.password,
      name: item.name,
      phone: item.phone,
      companyName: item.company_name,
      role: item.role,
    }));
  } catch (err) {
    console.warn('Failed to fetch users from Supabase:', err);
    return null;
  }
}

// 5. Update a Quote's status and pricing
export async function dbUpdateQuoteStatus(quoteId: string, status: string, estimatedCost?: string): Promise<boolean> {
  try {
    const updates: any = { status };
    if (estimatedCost !== undefined) {
      updates.estimated_cost = estimatedCost;
    }
    const { error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', quoteId);
    
    if (error) {
      console.warn('Supabase Update Error for quote_requests:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update quote in Supabase:', err);
    return false;
  }
}

// 6. Fetch all Projects
export async function dbFetchProjects(): Promise<ClientProject[] | null> {
  try {
    const { data: projData, error: projError } = await supabase
      .from('client_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projError) {
      console.warn('Supabase Fetch Error for client_projects:', projError.message);
      return null;
    }

    const { data: milData, error: milError } = await supabase
      .from('project_milestones')
      .select('*');

    const { data: medData, error: medError } = await supabase
      .from('project_media')
      .select('*');

    const milestones = milData || [];
    const media = medData || [];

    return projData.map((proj: any) => {
      const projMilestones = milestones
        .filter((m: any) => m.project_id === proj.id)
        .map((m: any) => ({
          id: m.id,
          title: m.title,
          status: m.status,
          completedAt: m.completed_at || undefined,
          description: m.description,
        }));

      const projMedia = media
        .filter((med: any) => med.project_id === proj.id)
        .map((med: any) => ({
          id: med.id,
          url: med.url,
          name: med.name,
          uploadedBy: med.uploaded_by,
          uploadedAt: med.uploaded_at || new Date().toISOString().split('T')[0],
          size: med.size || undefined,
          type: med.type,
        }));

      return {
        id: proj.id,
        contractNumber: proj.contract_number,
        clientId: proj.client_id,
        clientName: proj.client_name,
        clientPhone: proj.client_phone,
        title: proj.title,
        category: proj.category,
        description: proj.description,
        status: proj.status,
        progress: proj.progress || 0,
        startDate: proj.start_date,
        estCompletionDate: proj.est_completion_date,
        totalValue: proj.total_value,
        amountPaid: proj.amount_paid,
        milestones: projMilestones,
        media: projMedia,
        adminNotes: proj.admin_notes || undefined,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch projects from Supabase:', err);
    return null;
  }
}

// 7. Push / Update Client Project
export async function dbUpsertProject(proj: ClientProject): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('client_projects')
      .upsert({
        id: proj.id,
        contract_number: proj.contractNumber,
        client_id: proj.clientId,
        client_name: proj.clientName,
        client_phone: proj.clientPhone,
        title: proj.title,
        category: proj.category,
        description: proj.description,
        status: proj.status,
        progress: proj.progress,
        start_date: proj.startDate,
        est_completion_date: proj.estCompletionDate,
        total_value: proj.totalValue,
        amount_paid: proj.amountPaid,
        admin_notes: proj.adminNotes,
      });

    if (error) {
      console.warn('Supabase Upsert Error for client_projects:', error.message);
      return false;
    }

    // Upsert milestones
    if (proj.milestones && proj.milestones.length > 0) {
      const milestoneRows = proj.milestones.map(m => ({
        id: m.id,
        project_id: proj.id,
        title: m.title,
        status: m.status,
        completed_at: m.completedAt || null,
        description: m.description,
      }));
      await supabase.from('project_milestones').upsert(milestoneRows);
    }

    // Upsert media
    if (proj.media && proj.media.length > 0) {
      const mediaRows = proj.media.map(med => ({
        id: med.id,
        project_id: proj.id,
        url: med.url,
        name: med.name,
        uploaded_by: med.uploadedBy,
        uploaded_at: med.uploadedAt,
        size: med.size || null,
        type: med.type,
      }));
      await supabase.from('project_media').upsert(mediaRows);
    }

    return true;
  } catch (err) {
    console.warn('Failed to upsert project into Supabase:', err);
    return false;
  }
}

// 8. Push project single media attachment
export async function dbInsertProjectMedia(projectId: string, med: ProjectMedia): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project_media')
      .insert([
        {
          id: med.id,
          project_id: projectId,
          url: med.url,
          name: med.name,
          uploaded_by: med.uploadedBy,
          uploaded_at: med.uploadedAt,
          size: med.size || null,
          type: med.type,
        }
      ]);
    if (error) {
      console.warn('Supabase Insert Error for project_media:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception during project media insertion:', err);
    return false;
  }
}

// 9. Delete single media attachment
export async function dbDeleteProjectMedia(mediaId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project_media')
      .delete()
      .eq('id', mediaId);
    if (error) {
      console.warn('Supabase Delete Error for project_media:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception during project media deletion:', err);
    return false;
  }
}

// 10. Update project single milestone status
export async function dbUpdateMilestone(milestoneId: string, status: string, completedAt?: string): Promise<boolean> {
  try {
    const updates: any = { status };
    if (completedAt !== undefined) {
      updates.completed_at = completedAt || null;
    }
    const { error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId);
    if (error) {
      console.warn('Supabase Update Error for project_milestones:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception during milestone update:', err);
    return false;
  }
}
