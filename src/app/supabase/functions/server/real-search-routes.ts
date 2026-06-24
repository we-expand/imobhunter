// ═══════════════════════════════════════════════════════════════════════
// 🔍 IMOBHUNTER - REAL SEARCH ROUTES
// Rotas de busca real usando Apollo + PDL (People Data Labs) + RocketReach
// ═══════════════════════════════════════════════════════════════════════

import { Hono } from "npm:hono";
import { searchLinkedInPeople, searchLinkedInCompanies, getLinkedInProfile, enrichProfileWithRocketReach } from "./pdl-linkedin-api.ts";
import { searchApolloPeople, searchApolloCompanies } from "./apollo-api.ts";

const router = new Hono();

// ═══════════════════════════════════════════════════════════════════════
// 🎯 APOLLO.IO SEARCH
// ═══════════════════════════════════════════════════════════════════════

router.post("/apollo", async (c) => {
  try {
    const body = await c.req.json();
    const { query, filters } = body;

    console.log('🔍 Apollo Search:', { query, filters });

    // Usar função do apollo-api.ts
    const leads = await searchApolloPeople({
      query,
      locations: filters?.locations,
      titles: filters?.titles,
      companySizes: filters?.companySizes,
      limit: filters?.limit || 25
    });

    console.log(`✅ Apollo: ${leads.length} leads encontrados`);

    return c.json({
      success: true,
      source: 'apollo',
      leads,
      total: leads.length,
      metadata: {
        page: 1,
        perPage: filters?.limit || 25
      }
    });

  } catch (error) {
    console.error('💥 Apollo Search Error:', error);
    return c.json({
      success: false,
      error: error.message,
      source: 'apollo'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 💼 LINKEDIN SEARCH (via People Data Labs)
// ═══════════════════════════════════════════════════════════════════════

router.post("/linkedin", async (c) => {
  try {
    const body = await c.req.json();
    const { query, filters } = body;

    console.log('🔍 LinkedIn Search (PDL):', { query, filters });

    // Usar função do pdl-linkedin-api.ts
    const leads = await searchLinkedInPeople({
      name: filters?.name || query,
      jobTitle: filters?.title,
      company: filters?.company,
      location: filters?.locations?.[0],
      country: filters?.country,
      industry: filters?.industry
    });

    console.log(`✅ LinkedIn (PDL): ${leads.length} leads encontrados`);

    return c.json({
      success: true,
      source: 'linkedin_pdl',
      leads,
      total: leads.length
    });

  } catch (error) {
    console.error('💥 LinkedIn Search Error:', error);
    return c.json({
      success: false,
      error: error.message,
      source: 'linkedin_pdl'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🎯 UNIFIED SEARCH (Apollo + LinkedIn PDL + Ranking)
// ═══════════════════════════════════════════════════════════════════════

router.post("/unified", async (c) => {
  try {
    const body = await c.req.json();
    const { query, filters } = body;

    console.log('🚀 Unified Search Started:', { query, filters });

    // Buscar simultaneamente em Apollo e LinkedIn (PDL)
    const [apolloLeads, linkedinLeads] = await Promise.allSettled([
      searchApolloPeople({
        query,
        locations: filters?.locations,
        titles: filters?.titles,
        companySizes: filters?.companySizes,
        limit: filters?.limit || 25
      }),
      searchLinkedInPeople({
        name: filters?.name || query,
        jobTitle: filters?.title,
        company: filters?.company,
        location: filters?.locations?.[0],
        country: filters?.country,
        industry: filters?.industry
      })
    ]);

    // Coletar leads de todas as fontes
    const allLeads: any[] = [];
    const sources: any = {
      apollo: { success: false, count: 0 },
      linkedin: { success: false, count: 0 }
    };

    if (apolloLeads.status === 'fulfilled') {
      allLeads.push(...apolloLeads.value);
      sources.apollo = { success: true, count: apolloLeads.value.length };
    } else {
      console.warn('⚠️ Apollo failed:', apolloLeads.reason);
    }

    if (linkedinLeads.status === 'fulfilled') {
      allLeads.push(...linkedinLeads.value);
      sources.linkedin = { success: true, count: linkedinLeads.value.length };
    } else {
      console.warn('⚠️ LinkedIn (PDL) failed:', linkedinLeads.reason);
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🏆 SCORING & RANKING ALGORITHM
    // ═══════════════════════════════════════════════════════════════════

    const scoredLeads = allLeads.map(lead => {
      let score = 0;

      // Email disponível (+30 pontos)
      if (lead.email) score += 30;

      // Telefone disponível (+20 pontos)
      if (lead.phone) score += 20;

      // LinkedIn URL (+15 pontos)
      if (lead.linkedinUrl) score += 15;

      // Foto de perfil (+10 pontos)
      if (lead.photoUrl) score += 10;

      // Título profissional (+10 pontos)
      if (lead.title) score += 10;

      // Empresa (+10 pontos)
      if (lead.company) score += 10;

      // Localização (+5 pontos)
      if (lead.location) score += 5;

      // Bonus: Fonte Apollo (geralmente mais completo) (+10 pontos)
      if (lead.source === 'apollo') score += 10;

      // Bonus: Match de palavras-chave no título
      if (query && lead.title) {
        const queryWords = query.toLowerCase().split(' ');
        const titleLower = lead.title.toLowerCase();
        const matches = queryWords.filter(word => titleLower.includes(word)).length;
        score += matches * 5;
      }

      return { ...lead, score };
    });

    // Ordenar por score (maior para menor)
    const rankedLeads = scoredLeads.sort((a, b) => b.score - a.score);

    // Remover duplicatas (mesmo email ou LinkedIn)
    const uniqueLeads = rankedLeads.filter((lead, index, self) => {
      return index === self.findIndex(l => 
        (lead.email && l.email === lead.email) || 
        (lead.linkedinUrl && l.linkedinUrl === lead.linkedinUrl)
      );
    });

    // 🚀 ENRIQUECIMENTO COM ROCKETREACH (apenas top 5 leads)
    console.log('🚀 Enriquecendo top 5 leads com RocketReach...');
    const top5 = uniqueLeads.slice(0, 5);
    const enrichedTop5 = await Promise.all(
      top5.map(lead => enrichProfileWithRocketReach(lead))
    );
    
    // Substituir top 5 por versões enriquecidas
    const finalLeads = [...enrichedTop5, ...uniqueLeads.slice(5)];

    console.log(`✅ Unified Search Complete: ${finalLeads.length} unique leads`);

    return c.json({
      success: true,
      leads: finalLeads,
      total: finalLeads.length,
      sources,
      metadata: {
        query,
        filters,
        timestamp: new Date().toISOString(),
        apolloTotal: sources.apollo.count,
        linkedinTotal: sources.linkedin.count,
        duplicatesRemoved: rankedLeads.length - uniqueLeads.length,
        enrichedCount: 5
      }
    });

  } catch (error) {
    console.error('💥 Unified Search Error:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

export default router;