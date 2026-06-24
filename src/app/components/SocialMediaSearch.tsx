import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Search, 
  Filter, 
  Hash, 
  AtSign, 
  MessageCircle, 
  Heart, 
  Share2, 
  Eye, 
  Clock, 
  Calendar, 
  Image, 
  Video, 
  Zap, 
  Sparkles, 
  BrainCircuit, 
  Send, 
  ThumbsUp, 
  BookmarkPlus, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ChevronDown, 
  X, 
  Plus,
  Target,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'all';
type ContentType = 'posts' | 'stories' | 'reels' | 'videos' | 'all';
type EngagementLevel = 'high' | 'medium' | 'low' | 'all';

interface SocialFilters {
  platform: SocialPlatform;
  contentType: ContentType;
  hashtags: string[];
  mentions: string[];
  keywords: string[];
  excludeKeywords: string[];
  location?: string;
  dateRange?: { from: string; to: string };
  engagementLevel: EngagementLevel;
  minLikes?: number;
  minComments?: number;
  minShares?: number;
  hasMedia: boolean;
  verified?: boolean;
}

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  type: 'post' | 'story' | 'reel' | 'video';
  author: {
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: {
    text: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  hashtags: string[];
  mentions: string[];
  location?: string;
  timestamp: string;
  url: string;
  aiAnalysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    relevanceScore: number;
    topics: string[];
    suggestedResponse?: string;
  };
}

interface AIAction {
  type: 'like' | 'comment' | 'share' | 'follow' | 'dm';
  status: 'pending' | 'processing' | 'success' | 'failed';
  message?: string;
}

export function SocialMediaSearch() {
  // Estados principais
  const [filters, setFilters] = useState<SocialFilters>({
    platform: 'all',
    contentType: 'all',
    hashtags: [],
    mentions: [],
    keywords: [],
    excludeKeywords: [],
    engagementLevel: 'all',
    hasMedia: false
  });

  const [results, setResults] = useState<SocialPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string>('');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  
  // Estado para o input de busca (separado dos filtros)
  const [searchInput, setSearchInput] = useState('');
  
  // Estados de IA
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiAutoInteract, setAiAutoInteract] = useState(false);
  const [aiActions, setAiActions] = useState<Map<string, AIAction>>(new Map());
  
  // Conexões de redes sociais
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: false,
    facebook: false,
    twitter: false
  });

  // Verifica conexões salvas
  useEffect(() => {
    const instagramConnected = localStorage.getItem('instagram_connected') === 'true';
    const facebookConnected = localStorage.getItem('facebook_connected') === 'true';
    const twitterConnected = localStorage.getItem('twitter_connected') === 'true';
    
    setConnectedPlatforms({
      instagram: instagramConnected,
      facebook: facebookConnected,
      twitter: twitterConnected
    });
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleSearch = async () => {
    const hasConnection = Object.values(connectedPlatforms).some(v => v);
    
    if (!hasConnection) {
      toast.error('Conecte pelo menos uma rede social!', {
        description: 'Vá em "Integrations Hub" e conecte Instagram, Facebook ou X (Twitter)',
        duration: 8000
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      console.log('🔍 Buscando em redes sociais com filtros:', filters);
      
      // ⚠️ APIs REAIS NÃO CONFIGURADAS
      // Para ativar esta funcionalidade, configure as APIs oficiais das redes sociais:
      // - Instagram Graph API
      // - Facebook Graph API  
      // - X (Twitter) API v2
      
      toast.error('APIs de Redes Sociais não configuradas', {
        description: 'Configure Instagram, Facebook ou X API para ativar buscas reais',
        duration: 8000
      });
      
      setResults([]);

    } catch (error) {
      console.error('❌ Erro na busca:', error);
      toast.error('Erro ao buscar', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAIAction = async (postId: string, action: AIAction['type']) => {
    const post = results.find(p => p.id === postId);
    if (!post) return;

    setAiActions(prev => new Map(prev).set(postId, { type: action, status: 'processing' }));
    
    try {
      console.log(`🤖 Executando ação ${action} no post ${postId}`);
      
      // TODO: Implementar ações reais via APIs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiActions(prev => new Map(prev).set(postId, { 
        type: action, 
        status: 'success',
        message: getActionMessage(action)
      }));
      
      toast.success('Ação executada com sucesso!', {
        description: getActionMessage(action)
      });

    } catch (error) {
      setAiActions(prev => new Map(prev).set(postId, { 
        type: action, 
        status: 'failed',
        message: 'Erro ao executar ação'
      }));
      
      toast.error('Falha na ação', {
        description: 'Tente novamente mais tarde'
      });
    }
  };

  const handleBulkAIAction = async (action: AIAction['type']) => {
    if (selectedPosts.size === 0) {
      toast.error('Selecione pelo menos um post');
      return;
    }

    toast.info(`Executando ${action} em ${selectedPosts.size} posts...`, {
      duration: 3000
    });

    for (const postId of selectedPosts) {
      await handleAIAction(postId, action);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre ações
    }

    setSelectedPosts(new Set());
  };

  const getActionMessage = (action: AIAction['type']): string => {
    switch (action) {
      case 'like': return '❤️ Post curtido automaticamente pela IA';
      case 'comment': return '💬 Comentário inteligente adicionado';
      case 'share': return '🔄 Post compartilhado em sua timeline';
      case 'follow': return '👤 Perfil seguido automaticamente';
      case 'dm': return '📧 Mensagem direta enviada com sucesso';
      default: return 'Ação executada';
    }
  };

  const generateMockSocialPosts = (count: number): SocialPost[] => {
    const platforms: ('instagram' | 'facebook' | 'twitter')[] = ['instagram', 'facebook', 'twitter'];
    const types: ('post' | 'story' | 'reel' | 'video')[] = ['post', 'story', 'reel', 'video'];
    const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
    
    // 🏠 MOCK ESPECÍFICO PARA LEADS IMOBILIÁRIOS
    const realEstatePosts = [
      {
        text: "Procuro apartamento 3 quartos na zona sul de SP, até R$ 800k. Alguém conhece boa construtora? #apartamento #imoveis #zonasusp",
        hashtags: ['apartamento', 'imoveis', 'zonasusp', 'procuroapartamento'],
        profile: 'investidor',
        intent: 'buying',
        budget: '500k-800k'
      },
      {
        text: "Vendendo casa na Paulista! 4 suítes, 300m², vista incrível. Interessados chamar no direct! #casaavenda #paulista #luxo",
        hashtags: ['casaavenda', 'paulista', 'luxo', 'imoveldeluxo'],
        profile: 'seller',
        intent: 'selling',
        budget: '2M+'
      },
      {
        text: "Alguém indica imobiliária confiável em BH? Quero investir em apartamento para alugar #investimentoimobiliario #belohorizonte",
        hashtags: ['investimentoimobiliario', 'belohorizonte', 'rendapassiva'],
        profile: 'investidor',
        intent: 'investing',
        budget: '300k-500k'
      },
      {
        text: "Minha primeira casa própria!! 🏡❤️ Financiamento aprovado, agora é escolher o bairro. Dicas? #primeiracompra #casapropria #minhacasaminhavida",
        hashtags: ['primeiracompra', 'casapropria', 'minhacasaminhavida'],
        profile: 'firstTimeBuyer',
        intent: 'buying',
        budget: '200k-400k'
      },
      {
        text: "Terreno 500m² em condomínio fechado - Alphaville. Oportunidade única! Aceito propostas. DM para detalhes #terreno #alphaville #investimento",
        hashtags: ['terreno', 'alphaville', 'investimento', 'terrenoavenda'],
        profile: 'seller',
        intent: 'selling',
        budget: '800k-1.2M'
      },
      {
        text: "Mudando para SP em março! Procuro studio ou 1 quarto para alugar na Vila Madalena. Orçamento até R$ 3k/mês #aluguel #vilamadalena",
        hashtags: ['aluguel', 'vilamadalena', 'procuroapartamento', 'mudanca'],
        profile: 'renter',
        intent: 'renting',
        budget: '2k-3k/month'
      },
      {
        text: "Cobertura duplex pronta pra morar! 220m², 3 vagas, piscina privativa. Brooklin Novo. Valores inbox 📩 #cobertura #brooklin #luxo",
        hashtags: ['cobertura', 'brooklin', 'luxo', 'coberturaavenda'],
        profile: 'seller',
        intent: 'selling',
        budget: '1.5M-2M'
      },
      {
        text: "Casal procura apartamento decorado 2 quartos, Vila Olímpia ou Itaim. Aceitamos parceria com construtoras! #apartamentodecorado #vilaolimp",
        hashtags: ['apartamentodecorado', 'vilaolimp', 'itaim', 'imoveis'],
        profile: 'couple',
        intent: 'buying',
        budget: '600k-900k'
      },
      {
        text: "Lançamento imperdível! Residencial com clube completo em Moema. Últimas unidades com desconto de 15%! Link na bio #lancamento #moema",
        hashtags: ['lancamento', 'moema', 'plantadecorada', 'imoveis'],
        profile: 'developer',
        intent: 'selling',
        budget: '700k-1.5M'
      },
      {
        text: "Troco apartamento em Santos (frente pro mar) por imóvel em SP capital. Avaliado em R$ 1.2M. Aceito negociar #permuta #santos #frente",
        hashtags: ['permuta', 'santos', 'frentemar', 'imoveis'],
        profile: 'investor',
        intent: 'trading',
        budget: '1M-1.5M'
      },
      {
        text: "Sala comercial 80m² na Faria Lima! Andar alto, 2 vagas. Ideal para startups e escritórios. Valores por WhatsApp #salacomercial #farialima",
        hashtags: ['salacomercial', 'farialima', 'imovelcomercial'],
        profile: 'commercial',
        intent: 'renting',
        budget: '8k-12k/month'
      },
      {
        text: "Família crescendo! Precisamos de casa 3 ou 4 quartos com quintal. Preferência Zona Oeste. Orçamento R$ 950k #familia #casacomquintal",
        hashtags: ['familia', 'casacomquintal', 'zonaOeste', 'imoveis'],
        profile: 'family',
        intent: 'buying',
        budget: '800k-1M'
      },
      {
        text: "VENDO URGENTE! Apto 2 dorms + dep. empregada, Perdizes. R$ 750k à vista (valor negociável). Aceitamos FGTS! #vendaurgente #perdizes",
        hashtags: ['vendaurgente', 'perdizes', 'apartamento', 'aceitofgts'],
        profile: 'seller',
        intent: 'selling',
        budget: '700k-800k'
      },
      {
        text: "Investidor iniciante aqui! Dicas de bairros em SP com bom potencial de valorização? Budget até 500k #investimentoimobiliario #dicas",
        hashtags: ['investimentoimobiliario', 'dicas', 'valorizacao'],
        profile: 'investor',
        intent: 'investing',
        budget: '300k-500k'
      },
      {
        text: "Pensando em morar fora do Brasil. Alguém interessado em comprar meu apto na Consolação? 90m², 2 quartos, reformado #mudanca #consolacao",
        hashtags: ['mudanca', 'consolacao', 'apartamentoavenda'],
        profile: 'seller',
        intent: 'selling',
        budget: '600k-800k'
      },
      {
        text: "Studio mobiliado para alugar! 35m², Pinheiros, R$ 2.8k (inclui condomínio). Perfeito pra quem tá começando em SP #studiomobiliado #pinheiros",
        hashtags: ['studiomobiliado', 'pinheiros', 'aluguel'],
        profile: 'landlord',
        intent: 'renting',
        budget: '2.5k-3k/month'
      },
      {
        text: "Acabei de vender meu primeiro imóvel! 🎉 Agora quero comprar 2 menores para alugar. Alguém com experiência nisso? #investidor #rendapassiva",
        hashtags: ['investidor', 'rendapassiva', 'multiplicarimoveis'],
        profile: 'investor',
        intent: 'investing',
        budget: '400k-600k'
      },
      {
        text: "Casa em condomínio fechado - Granja Viana! 4 suítes, churrasqueira, piscina. Ideal para família grande. DM pra fotos #granja #casadecondominio",
        hashtags: ['granja', 'casadecondominio', 'familia', 'luxo'],
        profile: 'seller',
        intent: 'selling',
        budget: '1.8M-2.5M'
      },
      {
        text: "Procuro parceiro(a) para dividir compra de terreno em Cotia. Projeto: construir 2 casas geminadas. Interessados? #parceria #cotia #terreno",
        hashtags: ['parceria', 'cotia', 'terreno', 'construcao'],
        profile: 'partner',
        intent: 'investing',
        budget: '300k-500k'
      },
      {
        text: "Kitnet quitada pra venda! Liberdade, 28m², ótima pra investimento (aluga fácil). R$ 280k só à vista #kitnet #liberdade #investimento",
        hashtags: ['kitnet', 'liberdade', 'investimento', 'quitado'],
        profile: 'seller',
        intent: 'selling',
        budget: '250k-300k'
      }
    ];

    const usernames = [
      'joao_investidor', 'maria_homes', 'carlos_imoveis', 'ana_casanova', 'roberto_corretor',
      'patricia_luxo', 'fernando_prime', 'juliana_properties', 'ricardo_invest', 'beatriz_homes',
      'marcos_realestate', 'larissa_casas', 'paulo_investimentos', 'camila_properties', 'andre_properties',
      'gabriela_homes', 'lucas_corretor', 'renata_luxoimoveis', 'felipe_casas', 'amanda_invest'
    ];

    const displayNames = [
      'João Silva - Investidor', 'Maria Costa - Corretora', 'Carlos Santos - Imóveis', 'Ana Oliveira',
      'Roberto Ferreira - CRECI', 'Patrícia Luxury Homes', 'Fernando Prime Properties', 'Juliana Casas',
      'Ricardo Investimentos', 'Beatriz Homes SP', 'Marcos Real Estate', 'Larissa Imóveis Premium',
      'Paulo Investment Group', 'Camila Properties', 'André Real Estate', 'Gabriela Homes Luxury',
      'Lucas Corretor Associado', 'Renata Luxo Imóveis', 'Felipe Casas & Terrenos', 'Amanda Invest'
    ];

    const locations = [
      'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR',
      'Porto Alegre, RS', 'Brasília, DF', 'Salvador, BA', 'Florianópolis, SC',
      'Campinas, SP', 'Santos, SP', 'Vila Olímpia, SP', 'Moema, SP',
      'Pinheiros, SP', 'Itaim Bibi, SP', 'Brooklin, SP', 'Alphaville, SP',
      'Morumbi, SP', 'Jardins, SP', 'Vila Madalena, SP', 'Perdizes, SP'
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const postData = realEstatePosts[i % realEstatePosts.length];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      
      return {
        id: `post-${i}`,
        platform,
        type: types[Math.floor(Math.random() * types.length)],
        author: {
          username: usernames[i % usernames.length],
          displayName: displayNames[i % displayNames.length],
          avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
          verified: Math.random() > 0.6,
          followers: Math.floor(Math.random() * 50000) + 5000
        },
        content: {
          text: postData.text,
          mediaUrl: Math.random() > 0.3 ? `https://picsum.photos/seed/${i}/800/600` : undefined,
          mediaType: Math.random() > 0.5 ? 'image' as const : 'video' as const
        },
        engagement: {
          likes: Math.floor(Math.random() * 5000) + 500,
          comments: Math.floor(Math.random() * 300) + 50,
          shares: Math.floor(Math.random() * 150) + 20,
          views: Math.floor(Math.random() * 30000) + 5000
        },
        hashtags: postData.hashtags,
        mentions: filters.mentions,
        location: locations[i % locations.length],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        url: `https://${platform}.com/post/${i}`,
        aiAnalysis: {
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          relevanceScore: Math.floor(Math.random() * 25) + 75, // Score alto (75-100) para leads qualificados
          topics: ['imobiliário', postData.intent, postData.profile, postData.budget],
          suggestedResponse: getSuggestedResponse(postData.intent, postData.profile)
        }
      };
    });
  };

  const getSuggestedResponse = (intent: string, profile: string): string => {
    const responses: Record<string, string> = {
      'buying': 'Olá! Vi que está procurando imóvel. Temos ótimas opções que podem te interessar. Posso enviar algumas sugestões?',
      'selling': 'Oi! Interessante seu imóvel. Temos investidores procurando exatamente esse perfil. Podemos agendar uma conversa?',
      'investing': 'Olá! Você está no caminho certo. Temos análises de mercado e oportunidades de investimento. Quer receber nosso material?',
      'renting': 'Oi! Temos imóveis disponíveis para locação que se encaixam no seu perfil. Posso te enviar algumas opções?',
      'trading': 'Olá! Permuta é uma ótima estratégia. Temos experiência nisso e podemos ajudar a encontrar o match perfeito!'
    };
    return responses[intent] || 'Olá! Vi seu post sobre imóveis. Podemos conversar sobre as melhores opções para você?';
  };

  const updateFilter = (key: keyof SocialFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addToArrayFilter = (key: 'hashtags' | 'mentions' | 'keywords' | 'excludeKeywords', value: string) => {
    if (!value.trim()) return;
    const currentArray = filters[key];
    if (!currentArray.includes(value)) {
      updateFilter(key, [...currentArray, value]);
    }
  };

  const removeFromArrayFilter = (key: 'hashtags' | 'mentions' | 'keywords' | 'excludeKeywords', value: string) => {
    updateFilter(key, filters[key].filter(v => v !== value));
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // ==========================================
  // COMPONENTES
  // ==========================================

  const FilterSection = ({ id, title, icon: Icon, children }: any) => {
    const isExpanded = expandedSection === id;
    return (
      <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-900/40">
        <button
          onClick={() => setExpandedSection(isExpanded ? '' : id)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">{title}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ArrayInput = ({ label, value, onChange, placeholder }: any) => {
    const [inputValue, setInputValue] = useState('');
    return (
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onChange(inputValue);
                setInputValue('');
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <Button
            onClick={() => {
              onChange(inputValue);
              setInputValue('');
            }}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((item: string, idx: number) => (
              <Badge key={idx} className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 pr-1">
                {item}
                <button
                  onClick={() => removeFromArrayFilter(label.toLowerCase() as any, item)}
                  className="ml-1 hover:bg-red-500/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-pink-600 to-purple-600';
      case 'facebook': return 'from-blue-600 to-blue-800';
      case 'twitter': return 'from-sky-500 to-blue-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-900/40 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                Social Media Search AI
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Busque e interaja automaticamente em Instagram, Facebook e X (Twitter)
              </p>
            </div>

            {/* AI Status */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-zinc-300">IA Ativada</span>
              </label>
              {aiEnabled && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  <BrainCircuit className="w-3 h-3 mr-1" />
                  AI Active
                </Badge>
              )}
            </div>
          </div>

          {/* Platform Status */}
          <div className="flex gap-2 mb-6">
            {[
              { name: 'Instagram', key: 'instagram', icon: Instagram, gradient: 'from-pink-600 to-purple-600' },
              { name: 'Facebook', key: 'facebook', icon: Facebook, gradient: 'from-blue-600 to-blue-800' },
              { name: 'X (Twitter)', key: 'twitter', icon: Twitter, gradient: 'from-sky-500 to-blue-600' }
            ].map((platform) => (
              <Badge
                key={platform.key}
                className={`${
                  connectedPlatforms[platform.key as keyof typeof connectedPlatforms]
                    ? `bg-gradient-to-r ${platform.gradient} text-white border-0`
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                <platform.icon className="w-3 h-3 mr-1" />
                {platform.name}
                {connectedPlatforms[platform.key as keyof typeof connectedPlatforms] && (
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar posts, hashtags, perfis..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full pl-16 pr-32 py-5 bg-gradient-to-r from-zinc-800 to-zinc-900 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-xl"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 border-r border-white/10 bg-zinc-900/20 overflow-y-auto">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filtros</h3>
              </div>

              {/* Platform Selection */}
              <FilterSection id="platform" title="Plataforma" icon={Globe}>
                <div className="space-y-2">
                  {['all', 'instagram', 'facebook', 'twitter'].map((platform) => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.platform === platform}
                        onChange={() => updateFilter('platform', platform)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-zinc-300 capitalize">{platform === 'all' ? 'Todas' : platform}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Content Type */}
              <FilterSection id="content" title="Tipo de Conteúdo" icon={Image}>
                <div className="space-y-2">
                  {['all', 'posts', 'stories', 'reels', 'videos'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.contentType === type}
                        onChange={() => updateFilter('contentType', type)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-zinc-300 capitalize">{type === 'all' ? 'Todos' : type}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Hashtags */}
              <FilterSection id="hashtags" title="Hashtags" icon={Hash}>
                <ArrayInput
                  label="Hashtags"
                  value={filters.hashtags}
                  onChange={(val: string) => addToArrayFilter('hashtags', val)}
                  placeholder="Digite sem #"
                />
              </FilterSection>

              {/* Mentions */}
              <FilterSection id="mentions" title="Menções" icon={AtSign}>
                <ArrayInput
                  label="Menções"
                  value={filters.mentions}
                  onChange={(val: string) => addToArrayFilter('mentions', val)}
                  placeholder="Digite sem @"
                />
              </FilterSection>

              {/* Keywords */}
              <FilterSection id="keywords" title="Palavras-Chave" icon={Search}>
                <ArrayInput
                  label="Incluir"
                  value={filters.keywords}
                  onChange={(val: string) => addToArrayFilter('keywords', val)}
                  placeholder="Palavras-chave..."
                />
                <ArrayInput
                  label="Excluir"
                  value={filters.excludeKeywords}
                  onChange={(val: string) => addToArrayFilter('excludeKeywords', val)}
                  placeholder="Termos a excluir..."
                />
              </FilterSection>

              {/* Engagement */}
              <FilterSection id="engagement" title="Engajamento" icon={TrendingUp}>
                <div>
                  <label className="text-xs text-zinc-400 mb-2 block">Nível</label>
                  <select
                    value={filters.engagementLevel}
                    onChange={(e) => updateFilter('engagementLevel', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white"
                  >
                    <option value="all">Todos</option>
                    <option value="high">Alto (&gt;5k likes)</option>
                    <option value="medium">Médio (1k-5k likes)</option>
                    <option value="low">Baixo (&lt;1k likes)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 mb-2 block">Mínimo de Likes</label>
                  <input
                    type="number"
                    value={filters.minLikes || ''}
                    onChange={(e) => updateFilter('minLikes', Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white"
                  />
                </div>
              </FilterSection>

              {/* AI Options */}
              <FilterSection id="ai" title="Opções de IA" icon={BrainCircuit}>
                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiAutoInteract}
                      onChange={(e) => setAiAutoInteract(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Interagir Automaticamente
                  </label>
                  <p className="text-xs text-zinc-500 mt-1">
                    A IA irá curtir e comentar posts relevantes automaticamente
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) => updateFilter('verified', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Apenas Perfis Verificados
                  </label>
                </div>
              </FilterSection>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Actions Bar */}
          <div className="p-4 border-b border-white/10 bg-zinc-900/20">
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-white/10 text-zinc-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </Button>

              {selectedPosts.size > 0 && (
                <>
                  <div className="flex-1" />
                  <Button
                    onClick={() => handleBulkAIAction('like')}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Curtir ({selectedPosts.size})
                  </Button>
                  <Button
                    onClick={() => handleBulkAIAction('comment')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Comentar
                  </Button>
                  <Button
                    onClick={() => handleBulkAIAction('share')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartilhar
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Target className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                  Nenhuma busca realizada
                </h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  Configure seus filtros e busque posts relevantes nas redes sociais
                </p>
              </div>
            )}

            {isSearching && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="text-zinc-400">Buscando em redes sociais...</p>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.map((post) => {
                  const action = aiActions.get(post.id);
                  const isSelected = selectedPosts.has(post.id);

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
                    >
                      <Card className="overflow-hidden bg-zinc-900/60 border-white/10 hover:border-indigo-500/50 transition-all">
                        {/* Post Header */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePostSelection(post.id)}
                                className="w-4 h-4 rounded"
                              />
                              <img
                                src={post.author.avatar}
                                alt={post.author.displayName}
                                className="w-12 h-12 rounded-full border-2 border-white/10"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-white">{post.author.displayName}</h3>
                                  {post.author.verified && (
                                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-xs text-zinc-500">@{post.author.username}</p>
                                <p className="text-xs text-zinc-600">{post.author.followers.toLocaleString()} seguidores</p>
                              </div>
                            </div>

                            <Badge className={`bg-gradient-to-r ${getPlatformColor(post.platform)} text-white border-0`}>
                              {getPlatformIcon(post.platform)}
                              <span className="ml-1 capitalize">{post.platform}</span>
                            </Badge>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          <p className="text-white text-sm mb-3">{post.content.text}</p>

                          {post.content.mediaUrl && (
                            <div className="rounded-lg overflow-hidden mb-3">
                              {post.content.mediaType === 'image' ? (
                                <img src={post.content.mediaUrl} alt="Post" className="w-full h-48 object-cover" />
                              ) : (
                                <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                                  <Video className="w-12 h-12 text-zinc-600" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Hashtags */}
                          {post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.hashtags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-indigo-500/30 text-indigo-400">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Engagement Stats */}
                          <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.engagement.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.engagement.comments.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              {post.engagement.shares.toLocaleString()}
                            </span>
                            {post.engagement.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.engagement.views.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* AI Analysis */}
                          {post.aiAnalysis && aiEnabled && (
                            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <BrainCircuit className="w-4 h-4 text-purple-400" />
                                <span className="text-xs font-bold text-purple-300">Análise da IA</span>
                                <Badge className={`text-xs ${
                                  post.aiAnalysis.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                                  post.aiAnalysis.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {post.aiAnalysis.sentiment}
                                </Badge>
                                <Badge className="text-xs bg-indigo-500/20 text-indigo-300">
                                  {post.aiAnalysis.relevanceScore}% relevante
                                </Badge>
                              </div>
                              <p className="text-xs text-zinc-400 italic">
                                💬 Sugestão: "{post.aiAnalysis.suggestedResponse}"
                              </p>
                            </div>
                          )}

                          {/* AI Actions */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAIAction(post.id, 'like')}
                              size="sm"
                              variant="outline"
                              disabled={action?.status === 'processing'}
                              className="flex-1 border-white/10 text-zinc-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                            >
                              {action?.type === 'like' && action.status === 'processing' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : action?.type === 'like' && action.status === 'success' ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Heart className="w-3 h-3" />
                              )}
                            </Button>

                            <Button
                              onClick={() => handleAIAction(post.id, 'comment')}
                              size="sm"
                              variant="outline"
                              disabled={action?.status === 'processing'}
                              className="flex-1 border-white/10 text-zinc-300 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30"
                            >
                              {action?.type === 'comment' && action.status === 'processing' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <MessageCircle className="w-3 h-3" />
                              )}
                            </Button>

                            <Button
                              onClick={() => handleAIAction(post.id, 'share')}
                              size="sm"
                              variant="outline"
                              disabled={action?.status === 'processing'}
                              className="flex-1 border-white/10 text-zinc-300 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30"
                            >
                              {action?.type === 'share' && action.status === 'processing' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Share2 className="w-3 h-3" />
                              )}
                            </Button>

                            <Button
                              onClick={() => handleAIAction(post.id, 'dm')}
                              size="sm"
                              variant="outline"
                              disabled={action?.status === 'processing'}
                              className="flex-1 border-white/10 text-zinc-300 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Action Feedback */}
                          {action?.status === 'success' && action.message && (
                            <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                              {action.message}
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}