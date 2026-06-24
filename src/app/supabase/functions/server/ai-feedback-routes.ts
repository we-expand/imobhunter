import { Hono } from 'npm:hono';
import * as kvStore from './kv_store.tsx';

const app = new Hono();

interface LeadFeedback {
  leadId: string;
  leadName: string;
  outcome: 'venda_fechada' | 'em_negociacao' | 'perdido' | 'sem_interesse';
  valorVenda?: number;
  tempoAteConversao?: number;
  notasInternas?: string;
  timestamp: string;
  scoreLead?: number; // Score que a IA deu originalmente
}

// 🔥 ROTA: Enviar feedback de um lead
app.post('/submit', async (c) => {
  try {
    const feedback: LeadFeedback = await c.req.json();

    console.log('📊 Registrando feedback:', feedback);

    // Salva feedback no KV Store
    const feedbackId = `feedback_${Date.now()}_${feedback.leadId}`;
    await kvStore.set(feedbackId, JSON.stringify(feedback));

    // 🧠 ATUALIZA MODELO DE APRENDIZADO DA IA
    await updateAILearningModel(feedback);

    console.log('✅ Feedback registrado com sucesso!');

    return c.json({
      success: true,
      message: 'Feedback registrado e IA atualizada'
    });

  } catch (error: any) {
    console.error('❌ Erro ao registrar feedback:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 ROTA: Buscar métricas de performance da IA
app.get('/metrics', async (c) => {
  try {
    // Busca todos os feedbacks
    const feedbacks = await kvStore.getByPrefix('feedback_');
    
    if (feedbacks.length === 0) {
      return c.json({
        success: true,
        metrics: {
          totalLeadsEntregues: 0,
          vendasFechadas: 0,
          emNegociacao: 0,
          perdidos: 0,
          semInteresse: 0,
          taxaConversao: 0,
          taxaAcerto: 0,
          valorTotalVendas: 0,
          tempoMedioConversao: 0,
          scoreMedioEntregue: 0,
          scoreQualidade: 0,
        }
      });
    }

    const parsedFeedbacks: LeadFeedback[] = feedbacks.map((f: any) => {
      try {
        return typeof f === 'string' ? JSON.parse(f) : f;
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Calcula métricas
    const totalLeadsEntregues = parsedFeedbacks.length;
    const vendasFechadas = parsedFeedbacks.filter(f => f.outcome === 'venda_fechada').length;
    const emNegociacao = parsedFeedbacks.filter(f => f.outcome === 'em_negociacao').length;
    const perdidos = parsedFeedbacks.filter(f => f.outcome === 'perdido').length;
    const semInteresse = parsedFeedbacks.filter(f => f.outcome === 'sem_interesse').length;

    const taxaConversao = totalLeadsEntregues > 0 
      ? (vendasFechadas / totalLeadsEntregues) * 100 
      : 0;

    const taxaAcerto = totalLeadsEntregues > 0
      ? ((vendasFechadas + emNegociacao) / totalLeadsEntregues) * 100
      : 0;

    const valorTotalVendas = parsedFeedbacks
      .filter(f => f.outcome === 'venda_fechada' && f.valorVenda)
      .reduce((sum, f) => sum + (f.valorVenda || 0), 0);

    const conversoes = parsedFeedbacks.filter(f => 
      f.outcome === 'venda_fechada' && f.tempoAteConversao
    );
    
    const tempoMedioConversao = conversoes.length > 0
      ? Math.round(
          conversoes.reduce((sum, f) => sum + (f.tempoAteConversao || 0), 0) / conversoes.length
        )
      : 0;

    const leadsComScore = parsedFeedbacks.filter(f => f.scoreLead !== undefined);
    const scoreMedioEntregue = leadsComScore.length > 0
      ? Math.round(
          leadsComScore.reduce((sum, f) => sum + (f.scoreLead || 0), 0) / leadsComScore.length
        )
      : 75;

    // 🎯 SCORE DE QUALIDADE DA IA (0-100)
    // Baseado em múltiplos fatores:
    // - Taxa de conversão (peso 40%)
    // - Taxa de acerto (peso 30%)
    // - Alinhamento score vs resultado (peso 30%)
    
    const scoreConversao = Math.min(100, (taxaConversao / 20) * 100); // 20% = 100 pontos
    const scoreAcerto = taxaAcerto; // Já está em %
    
    // Calcula precisão do score (quantos leads com score alto realmente converteram)
    const leadsAltoScore = parsedFeedbacks.filter(f => (f.scoreLead || 0) >= 70);
    const conversoesDosAltoScore = leadsAltoScore.filter(f => 
      f.outcome === 'venda_fechada' || f.outcome === 'em_negociacao'
    ).length;
    
    const scorePrecisao = leadsAltoScore.length > 0
      ? (conversoesDosAltoScore / leadsAltoScore.length) * 100
      : 50; // Neutro se não houver dados

    const scoreQualidade = Math.round(
      (scoreConversao * 0.4) + (scoreAcerto * 0.3) + (scorePrecisao * 0.3)
    );

    console.log('📊 Métricas calculadas:', {
      totalLeadsEntregues,
      vendasFechadas,
      taxaConversao: taxaConversao.toFixed(2),
      scoreQualidade
    });

    return c.json({
      success: true,
      metrics: {
        totalLeadsEntregues,
        vendasFechadas,
        emNegociacao,
        perdidos,
        semInteresse,
        taxaConversao: Number(taxaConversao.toFixed(2)),
        taxaAcerto: Number(taxaAcerto.toFixed(2)),
        valorTotalVendas,
        tempoMedioConversao,
        scoreMedioEntregue,
        scoreQualidade,
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao calcular métricas:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 ROTA: Buscar feedbacks recentes
app.get('/recent', async (c) => {
  try {
    const feedbacks = await kvStore.getByPrefix('feedback_');
    
    const parsedFeedbacks: LeadFeedback[] = feedbacks
      .map((f: any) => {
        try {
          return typeof f === 'string' ? JSON.parse(f) : f;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: LeadFeedback, b: LeadFeedback) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return c.json({
      success: true,
      feedbacks: parsedFeedbacks.slice(0, 20) // Últimos 20
    });

  } catch (error: any) {
    console.error('❌ Erro ao buscar feedbacks:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🧠 Função auxiliar: Atualiza modelo de aprendizado da IA
async function updateAILearningModel(feedback: LeadFeedback) {
  try {
    // Busca modelo atual
    let model = await kvStore.get('ai_learning_model');
    let modelData: any = {};
    
    if (model) {
      try {
        modelData = typeof model === 'string' ? JSON.parse(model) : model;
      } catch {
        modelData = {};
      }
    }

    // Inicializa estrutura se não existir
    if (!modelData.patterns) {
      modelData.patterns = {
        venda_fechada: [],
        em_negociacao: [],
        perdido: [],
        sem_interesse: [],
      };
    }

    if (!modelData.insights) {
      modelData.insights = {
        bestScoreRange: { min: 70, max: 100 },
        averageConversionTime: 0,
        strongSignals: [],
        weakSignals: [],
      };
    }

    // Adiciona novo padrão
    if (feedback.outcome && modelData.patterns[feedback.outcome]) {
      modelData.patterns[feedback.outcome].push({
        leadId: feedback.leadId,
        score: feedback.scoreLead,
        timestamp: feedback.timestamp,
        valorVenda: feedback.valorVenda,
        tempoConversao: feedback.tempoAteConversao,
      });

      // Mantém apenas últimos 100 de cada tipo
      if (modelData.patterns[feedback.outcome].length > 100) {
        modelData.patterns[feedback.outcome] = modelData.patterns[feedback.outcome].slice(-100);
      }
    }

    // 🎯 ATUALIZA INSIGHTS AUTOMATICAMENTE
    
    // 1. Melhor range de score para conversão
    const vendas = modelData.patterns.venda_fechada || [];
    if (vendas.length > 0) {
      const scores = vendas.map((v: any) => v.score).filter(Boolean);
      if (scores.length > 0) {
        modelData.insights.bestScoreRange = {
          min: Math.min(...scores),
          max: Math.max(...scores),
          average: scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        };
      }
    }

    // 2. Tempo médio de conversão
    const vendasComTempo = vendas.filter((v: any) => v.tempoConversao);
    if (vendasComTempo.length > 0) {
      modelData.insights.averageConversionTime = Math.round(
        vendasComTempo.reduce((sum: number, v: any) => sum + v.tempoConversao, 0) / vendasComTempo.length
      );
    }

    // 3. Sinais fortes (o que funciona)
    if (feedback.outcome === 'venda_fechada' && feedback.scoreLead && feedback.scoreLead >= 80) {
      modelData.insights.strongSignals.push({
        type: 'high_score_conversion',
        timestamp: feedback.timestamp,
        score: feedback.scoreLead,
      });
      
      // Mantém apenas últimos 50
      if (modelData.insights.strongSignals.length > 50) {
        modelData.insights.strongSignals = modelData.insights.strongSignals.slice(-50);
      }
    }

    // 4. Sinais fracos (o que não funciona)
    if ((feedback.outcome === 'perdido' || feedback.outcome === 'sem_interesse') && 
        feedback.scoreLead && feedback.scoreLead >= 70) {
      modelData.insights.weakSignals.push({
        type: 'high_score_no_conversion',
        timestamp: feedback.timestamp,
        score: feedback.scoreLead,
        outcome: feedback.outcome,
      });
      
      // Mantém apenas últimos 50
      if (modelData.insights.weakSignals.length > 50) {
        modelData.insights.weakSignals = modelData.insights.weakSignals.slice(-50);
      }
    }

    // Salva modelo atualizado
    await kvStore.set('ai_learning_model', JSON.stringify(modelData));

    console.log('🧠 Modelo de IA atualizado com novo feedback');
    console.log('📊 Insights atuais:', {
      bestScoreRange: modelData.insights.bestScoreRange,
      avgConversionTime: modelData.insights.averageConversionTime,
      strongSignalsCount: modelData.insights.strongSignals.length,
      weakSignalsCount: modelData.insights.weakSignals.length,
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar modelo de IA:', error);
    // Não falha a requisição principal se o modelo não atualizar
  }
}

export default app;
