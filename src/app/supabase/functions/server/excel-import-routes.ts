import { Hono } from 'npm:hono';
import * as kvStore from './kv_store.tsx';

const app = new Hono();

// 🔥 ROTA: Importar leads de Excel/CSV
app.post('/import-excel', async (c) => {
  try {
    const body = await c.req.json();
    const { filename, data, fileType } = body;

    console.log('📥 Importando arquivo:', filename);

    // Decodifica Base64
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Converte para texto (para CSV) ou processa Excel
    const text = new TextDecoder().decode(bytes);
    
    // Parse CSV simples (linha por linha)
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return c.json({
        success: false,
        error: 'Arquivo vazio ou sem dados'
      }, 400);
    }

    // Primeira linha = cabeçalhos
    const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase());
    console.log('📋 Cabeçalhos detectados:', headers);

    // Mapeia colunas para campos padrão
    const fieldMap: any = {};
    headers.forEach((header, idx) => {
      if (header.includes('nome') || header.includes('name')) fieldMap.nome = idx;
      if (header.includes('email') || header.includes('e-mail')) fieldMap.email = idx;
      if (header.includes('telefone') || header.includes('phone') || header.includes('tel')) fieldMap.telefone = idx;
      if (header.includes('empresa') || header.includes('company')) fieldMap.empresa = idx;
      if (header.includes('cargo') || header.includes('title') || header.includes('position')) fieldMap.cargo = idx;
      if (header.includes('cidade') || header.includes('city')) fieldMap.cidade = idx;
      if (header.includes('pais') || header.includes('país') || header.includes('country')) fieldMap.pais = idx;
      if (header.includes('linkedin')) fieldMap.linkedin = idx;
      if (header.includes('nota') || header.includes('note') || header.includes('comment')) fieldMap.notas = idx;
    });

    console.log('🗺️ Mapeamento de campos:', fieldMap);

    // Busca leads existentes para detectar duplicatas
    const existingLeads = await kvStore.getByPrefix('lead_');
    const existingEmails = new Set(
      existingLeads
        .map((l: any) => l.email?.toLowerCase())
        .filter(Boolean)
    );

    let imported = 0;
    let duplicates = 0;
    let errors = 0;
    const newLeads: any[] = [];

    // Processa cada linha (pula a primeira - cabeçalho)
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(/[,;\t]/).map(v => v.trim());
        
        // Extrai dados baseado no mapeamento
        const nome = fieldMap.nome !== undefined ? values[fieldMap.nome] : '';
        const email = fieldMap.email !== undefined ? values[fieldMap.email] : '';
        const telefone = fieldMap.telefone !== undefined ? values[fieldMap.telefone] : '';
        const empresa = fieldMap.empresa !== undefined ? values[fieldMap.empresa] : '';
        const cargo = fieldMap.cargo !== undefined ? values[fieldMap.cargo] : '';
        const cidade = fieldMap.cidade !== undefined ? values[fieldMap.cidade] : '';
        const pais = fieldMap.pais !== undefined ? values[fieldMap.pais] : '';
        const linkedin = fieldMap.linkedin !== undefined ? values[fieldMap.linkedin] : '';
        const notas = fieldMap.notas !== undefined ? values[fieldMap.notas] : '';

        // Valida campos obrigatórios
        if (!nome || !email) {
          console.warn(`⚠️ Linha ${i + 1}: Nome ou email faltando`);
          errors++;
          continue;
        }

        // Verifica duplicata
        if (existingEmails.has(email.toLowerCase())) {
          console.log(`🔄 Linha ${i + 1}: Email duplicado - ${email}`);
          duplicates++;
          continue;
        }

        // Cria lead
        const leadId = `lead_import_${Date.now()}_${i}`;
        const lead = {
          id: leadId,
          name: nome,
          email,
          phone: telefone,
          company: empresa,
          title: cargo,
          location: cidade ? `${cidade}, ${pais}` : pais,
          country: pais,
          linkedin: linkedin,
          notes: notas,
          source: 'excel_import',
          status: 'frio',
          score: 50, // Score neutro inicial
          cluster: 'geral',
          importedAt: new Date().toISOString(),
        };

        newLeads.push(lead);
        existingEmails.add(email.toLowerCase()); // Previne duplicatas dentro do mesmo arquivo
        imported++;

      } catch (error) {
        console.error(`❌ Erro na linha ${i + 1}:`, error);
        errors++;
      }
    }

    // Salva leads no KV Store
    if (newLeads.length > 0) {
      const updates: any = {};
      newLeads.forEach(lead => {
        updates[lead.id] = JSON.stringify(lead);
      });

      await kvStore.mset(updates);
      console.log(`✅ ${imported} leads salvos no banco de dados`);
    }

    return c.json({
      success: true,
      imported,
      duplicates,
      errors,
      total: lines.length - 1,
      message: `${imported} leads importados com sucesso!`
    });

  } catch (error: any) {
    console.error('❌ Erro na importação:', error);
    return c.json({
      success: false,
      error: error.message || 'Erro ao processar arquivo'
    }, 500);
  }
});

export default app;
