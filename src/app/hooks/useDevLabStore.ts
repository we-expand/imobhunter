import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DevLabState, DevLabSuggestion, DevLabCategory } from '../types/devlab';

// --- KNOWLEDGE BASE EXPANDIDA (20 itens únicos por categoria) ---

const DB_TRADING = [
  { name: 'Split Fiscal', desc: 'Retenção de impostos na fonte automática' },
  { name: 'Auto-Invoice', desc: 'Emissão de NF-e automática via API' },
  { name: 'Multi-Currency', desc: 'Suporte nativo a EUR e BRL' },
  { name: 'Comissão Dinâmica', desc: 'Cálculo de tiers de venda progressivos' },
  { name: 'Dashboard ROI', desc: 'Cálculo de retorno financeiro em tempo real' },
  { name: 'Integração Bancária', desc: 'Conciliação via Open Finance' },
  { name: 'Conciliação Automática', desc: 'Match automático de extratos e vendas' },
  { name: 'Relatório DRE', desc: 'Demonstrativo de Resultado do Exercício ao vivo' },
  { name: 'Fluxo de Caixa', desc: 'Previsão de recebíveis futuros' },
  { name: 'Gestão de Recorrência', desc: 'Automação de aluguéis e mensalidades' },
  { name: 'Alertas Inadimplência', desc: 'Régua de cobrança automática (SMS/Email)' },
  { name: 'Gateway Redundante', desc: 'Failover para Pagar.me se Stripe falhar' },
  { name: 'Tokenização Recebíveis', desc: 'Antecipação de aluguéis via tokens' },
  { name: 'PIX Automático', desc: 'Baixa instantânea via Webhook do Banco Central' },
  { name: 'Boleto Híbrido', desc: 'Boleto com QR Code PIX integrado' },
  { name: 'Wallet do Corretor', desc: 'Saldo digital para antecipação de comissão' },
  { name: 'Split Proprietário', desc: 'Divisão automática de aluguel Líquido/Bruto' },
  { name: 'Calc. Rentabilidade', desc: 'Ferramenta de projeção de investimento' },
  { name: 'Simulador Crédito', desc: 'Integração com bancos para pré-aprovação' },
  { name: 'API Contábil', desc: 'Exportação direta para softwares contábeis' }
];

const DB_TECH = [
  { name: 'Next.js 14 Actions', desc: 'Server Actions para performance e SEO' },
  { name: 'Supabase Vector', desc: 'Busca Semântica (Embeddings) com AI' },
  { name: 'OpenAI Vision', desc: 'Análise automática de fotos dos imóveis' },
  { name: 'Stripe Connect', desc: 'Marketplace financeiro completo' },
  { name: 'WebSockets', desc: 'Alertas e Chat em Tempo Real' },
  { name: 'React Native', desc: 'App Mobile iOS/Android com mesmo código' },
  { name: 'GraphQL', desc: 'Consultas de dados otimizadas e flexíveis' },
  { name: 'Edge Functions', desc: 'Lógica serverless distribuída globalmente' },
  { name: 'Redis Caching', desc: 'Cache de alta performance para buscas' },
  { name: 'CI/CD Pipelines', desc: 'Deploy automatizado e testes contínuos' },
  { name: 'Docker Containers', desc: 'Ambiente de desenvolvimento padronizado' },
  { name: 'Micro-frontends', desc: 'Arquitetura escalável para grandes times' },
  { name: 'WebAssembly', desc: 'Processamento de imagens no navegador' },
  { name: 'PWA Support', desc: 'Instalação do site como App no celular' },
  { name: 'tRPC', desc: 'Type-safety total entre front e back' },
  { name: 'Prisma ORM', desc: 'Gerenciamento de banco de dados moderno' },
  { name: 'Tailwind v4', desc: 'Engine CSS de próxima geração' },
  { name: 'Sentry Monitoring', desc: 'Rastreamento de erros em tempo real' },
  { name: 'PostHog Analytics', desc: 'Análise de comportamento do usuário' },
  { name: 'Playwright E2E', desc: 'Testes automatizados de ponta a ponta' }
];

const DB_UX = [
  { name: 'Guest Checkout', desc: 'Agendamento sem necessidade de login' },
  { name: 'Dark Mode', desc: 'Tema escuro nativo automático' },
  { name: 'Mobile First', desc: 'Otimização prioritária para celulares' },
  { name: 'Micro-interações', desc: 'Feedback visual sutil em ações' },
  { name: 'Onboarding Tour', desc: 'Guia interativo para novos usuários' },
  { name: 'Filtros Avançados', desc: 'Busca multifacetada instantânea' },
  { name: 'Skeleton Loading', desc: 'Percepção de velocidade no carregamento' },
  { name: 'Infinite Scroll', desc: 'Navegação contínua na lista de imóveis' },
  { name: 'Drag & Drop', desc: 'Upload de fotos intuitivo' },
  { name: 'Busca por Voz', desc: 'Comando de voz para encontrar imóveis' },
  { name: 'Mapa Interativo', desc: 'Desenhar área de busca no mapa' },
  { name: 'Favoritos', desc: 'Lista de desejos com comparação' },
  { name: 'Botão Compartilhar', desc: 'Integração nativa com WhatsApp/Social' },
  { name: 'Feedback Widget', desc: 'Captura de opinião do usuário in-app' },
  { name: 'Página 404 Custom', desc: 'Recuperação de navegação em erros' },
  { name: 'Loading States', desc: 'Indicadores claros de processamento' },
  { name: 'Breadcrumbs', desc: 'Navegação hierárquica clara' },
  { name: 'Sticky Header', desc: 'Menu sempre visível ao rolar' },
  { name: 'Acessibilidade', desc: 'Navegação completa via teclado' },
  { name: 'Atalhos Teclado', desc: 'Comandos rápidos para Power Users' }
];

const DB_FEATURE = [
  { name: 'Gamification', desc: 'Ranking e medalhas para corretores' },
  { name: 'CRM Integrado', desc: 'Pipeline de vendas visual (Kanban)' },
  { name: 'Chatbot AI', desc: 'Triagem automática de leads 24/7' },
  { name: 'Integração WhatsApp', desc: 'Botão Flutuante de contato direto' },
  { name: 'Agendamento Online', desc: 'Sincronização com Google Calendar' },
  { name: 'Assinatura Digital', desc: 'Contratos via DocuSign/ClickSign' },
  { name: 'Tour Virtual 360', desc: 'Visualização imersiva do imóvel' },
  { name: 'Calc. Permuta', desc: 'Ferramenta de negociação de troca' },
  { name: 'Comparador', desc: 'Tabela lado a lado de imóveis' },
  { name: 'Notificações Push', desc: 'Alertas de novos imóveis no perfil' },
  { name: 'Lead Scoring', desc: 'AI classifica leads quentes/frios' },
  { name: 'Integração Portais', desc: 'Publicação automática (Zap/VivaReal)' },
  { name: 'Gerador Descrição', desc: 'AI escreve o texto do anúncio' },
  { name: 'Editor de Fotos', desc: 'Marca d\'água e brilho no upload' },
  { name: 'Gestão de Chaves', desc: 'Controle físico de acesso aos imóveis' },
  { name: 'Histórico Visitas', desc: 'Log completo de quem visitou o quê' },
  { name: 'Feedback Dono', desc: 'Relatório automático para proprietário' },
  { name: 'Proposta Digital', desc: 'Envio e negociação online de valores' },
  { name: 'Vistoria Online', desc: 'App para checklist de entrada/saída' },
  { name: 'OCR Documentos', desc: 'Leitura automática de CNH/RG' }
];

const DB_COMPETITION = [
  { name: 'Zillow', strength: 'Zestimate (Estimativa de Preço)' },
  { name: 'QuintoAndar', strength: 'Garantia Locatícia sem Fiador' },
  { name: 'Idealista', strength: 'Mapas de Calor de Preços' },
  { name: 'Loft', strength: 'Reforma e Flip Imobiliário' },
  { name: 'Redfin', strength: 'Taxas de Corretagem Reduzidas' },
  { name: 'Airbnb', strength: 'Reviews e Superhost Status' },
  { name: 'VivaReal', strength: 'Busca por Pontos de Interesse' },
  { name: 'Zap Imóveis', strength: 'Destaques e Turbinados' },
  { name: 'RE/MAX', strength: 'Modelo de Franquia Global' },
  { name: 'Keller Williams', strength: 'Treinamento e Cultura' },
  { name: 'Compass', strength: 'Tecnologia para o Agente' },
  { name: 'Opendoor', strength: 'iBuyer (Compra Instantânea)' },
  { name: 'CoStar', strength: 'Dados de Mercado Comercial' },
  { name: 'Rightmove', strength: 'Liderança de Tráfego (UK)' },
  { name: 'Zumper', strength: 'Foco em Locação Rápida' },
  { name: 'Trulia', strength: 'Dados de Vizinhança/Crime' },
  { name: 'StreetEasy', strength: 'Dados Específicos de NYC' },
  { name: 'Realtor.com', strength: 'Dados Oficiais da Associação' },
  { name: 'Century 21', strength: 'Força da Marca Global' },
  { name: 'Sotheby\'s', strength: 'Mercado de Luxo Exclusivo' }
];

const DB_INNOVATION = [
  { name: 'Tokenização RWA', desc: 'Imóveis fracionados na Blockchain' },
  { name: 'Apple Vision Pro', desc: 'Experiência imersiva VR/AR' },
  { name: 'AI Voice Agent', desc: 'Atendimento telefônico 100% autônomo' },
  { name: 'Smart Contracts', desc: 'Escritura imobiliária automatizada' },
  { name: 'IoT Predial', desc: 'Integração com Smart Buildings' },
  { name: 'Crypto Payments', desc: 'Aceitar Bitcoin/USDT como pagamento' },
  { name: 'Metaverso', desc: 'Showroom virtual de lançamentos' },
  { name: 'Drone Tours', desc: 'Vídeos aéreos automáticos' },
  { name: 'Impressão 3D', desc: 'Construção modular rápida' },
  { name: 'Predictive Analytics', desc: 'Prever bairros que vão valorizar' },
  { name: 'Sentiment Analysis', desc: 'Analisar emoções em chamadas' },
  { name: 'ChatGPT Plugin', desc: 'Busca conversacional natural' },
  { name: 'AR Staging', desc: 'Móveis virtuais na câmera do celular' },
  { name: 'Acesso Biométrico', desc: 'Fechadura digital integrada ao App' },
  { name: 'Energy Rating', desc: 'AI calcula eficiência energética' },
  { name: 'Gentrification AI', desc: 'Previsão de mudança demográfica' },
  { name: 'Auto Staging', desc: 'Decoração automática de fotos vazias' },
  { name: 'Local News Feed', desc: 'Notícias hiper-locais no app' },
  { name: 'Community DAO', desc: 'Gestão de condomínio descentralizada' },
  { name: 'NFT Deed', desc: 'Escritura digital única (Non-fungible)' }
];

// --- FUNÇÃO GERADORA ---

const createItem = (category: DevLabCategory, index: number): DevLabSuggestion => {
  let pool: any[] = [];

  switch (category) {
    case 'TRADING': pool = DB_TRADING; break;
    case 'TECH': pool = DB_TECH; break;
    case 'UX': pool = DB_UX; break;
    case 'FEATURE': pool = DB_FEATURE; break;
    case 'COMPETITION': pool = DB_COMPETITION; break;
    case 'INNOVATION': pool = DB_INNOVATION; break;
    default: pool = DB_TECH;
  }

  // Usa módulo para garantir que sempre tenha item, mas agora temos 20 itens únicos!
  const item = pool[index % pool.length];

  let title = '';
  let description = '';

  if (category === 'COMPETITION') {
    title = `Benchmark: ${item.name}`;
    description = `Analisar estratégia de "${item.strength}" do concorrente.`;
  } else {
    title = `Implementar ${item.name}`;
    description = item.desc;
  }

  return {
    id: `${category.toLowerCase()}-${index}-${Date.now()}-${Math.random()}`,
    title,
    description,
    category,
    tags: [category.toLowerCase(), 'strategy', '2025'],
    impact: index % 3 === 0 ? 'HIGH' : (index % 2 === 0 ? 'MEDIUM' : 'LOW'),
    effort: index % 4 === 0 ? 'HIGH' : 'MEDIUM',
    status: 'active',
    fullAnalysis: `ANÁLISE ESTRATÉGICA (${category} - ${item.name}):\n\nEsta sugestão foca em "${item.name}" para melhorar a competitividade.\n\nCONTEXTO:\n${item.desc || item.strength}.\n\nIMPACTO ESPERADO:\nAumento de retenção e modernização da stack tecnológica.`,
    createdAt: new Date().toISOString()
  };
};

// --- STORE ---

const generateAllCategories = () => {
  const suggestions: DevLabSuggestion[] = [];
  const categories: DevLabCategory[] = ['TRADING', 'TECH', 'UX', 'FEATURE', 'COMPETITION', 'INNOVATION'];
  
  categories.forEach(cat => {
    // Gera 50 itens por categoria (vai repetir os 20 únicos 2.5x, garantindo volume)
    for (let i = 0; i < 50; i++) {
      suggestions.push(createItem(cat, i));
    }
  });
  
  return suggestions;
};

export const useDevLabStore = create<DevLabState>()(
  persist(
    (set, get) => ({
      suggestions: generateAllCategories(), // Gera 300 itens na inicialização

      addSuggestion: (suggestion) => 
        set((state) => ({ suggestions: [suggestion, ...state.suggestions] })),

      removeSuggestion: (id) => {
        set((state) => {
          const item = state.suggestions.find(s => s.id === id);
          if (!item) return state;
          
          const filtered = state.suggestions.filter(s => s.id !== id);
          // Repõe com item aleatório da mesma categoria
          const replacement = createItem(item.category, Math.floor(Math.random() * 1000));
          
          return { suggestions: [replacement, ...filtered] };
        });
      },

      completeSuggestion: (id) => {
        set((state) => {
          const item = state.suggestions.find(s => s.id === id);
          if (!item) return state;

          const filtered = state.suggestions.filter(s => s.id !== id);
          const replacement = createItem(item.category, Math.floor(Math.random() * 1000));
          
          return { suggestions: [replacement, ...filtered] };
        });
      },

      reset: () => set({ suggestions: generateAllCategories() })
    }),
    {
      name: 'dev-lab-storage-v8.0-final', // v8.0 para garantir reset
      version: 8.0,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Força regeneração se estiver vazio ou com poucos itens
        if (!state || state.suggestions.length < 100) {
          console.log("Reidratação detectou base vazia. Resetando...");
          state?.reset();
        }
      }
    }
  )
);
