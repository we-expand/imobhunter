/**
 * 🚀 Apollo.io Direct Client
 * Calls Apollo API directly from frontend using environment variables
 */

interface ApolloSearchParams {
  person_titles?: string[];
  q_organization_keyword_tags?: string[];
  page?: number;
  per_page?: number;
}

interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  organization?: {
    name: string;
  };
}

export async function searchApolloContacts(params: ApolloSearchParams) {
  try {
    console.log('🔍 [Apollo Direct] Iniciando busca com params:', params);
    
    // Import supabase info
    const { projectId } = await import('./supabase/info');
    
    // Call server route that handles API key correctly
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/api/apollo/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Apollo Direct] Erro na resposta:', response.status, errorText);
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ [Apollo Direct] Busca concluída:', data);
    
    return {
      success: true,
      contacts: data.contacts || [],
      totalResults: data.pagination?.total_entries || 0,
    };
  } catch (error) {
    console.error('❌ [Apollo Direct] Erro:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      contacts: [],
      totalResults: 0,
    };
  }
}
