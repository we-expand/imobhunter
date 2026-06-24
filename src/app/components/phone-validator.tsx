import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Phone, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Shield,
  MessageCircle,
  Linkedin,
  Facebook,
  Instagram,
  Globe
} from 'lucide-react';
import { phoneEnrichment, EnrichmentResult, PhoneSuggestion } from '../lib/phone-enrichment-service';
import { toast } from 'sonner@2.0.3';

interface PhoneValidatorProps {
  leadName: string;
  leadEmail?: string;
  leadCompany?: string;
  leadLinkedIn?: string;
  existingPhone?: string;
  onPhoneSelected?: (phone: string) => void;
}

export function PhoneValidator({
  leadName,
  leadEmail,
  leadCompany,
  leadLinkedIn,
  existingPhone,
  onPhoneSelected
}: PhoneValidatorProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<EnrichmentResult | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    toast.info('🔍 Buscando telefones em 9 fontes...');

    try {
      const enrichmentResult = await phoneEnrichment.enrichPhone({
        name: leadName,
        email: leadEmail,
        company: leadCompany,
        linkedin: leadLinkedIn,
        phone: existingPhone,
      });

      setResult(enrichmentResult);

      if (enrichmentResult.suggestions.length > 0) {
        const topSuggestion = enrichmentResult.suggestions[0];
        toast.success(`🎯 ${enrichmentResult.suggestions.length} telefone(s) encontrado(s)!`, {
          description: `Score IA: ${topSuggestion.confidence}/100 - ${topSuggestion.status.toUpperCase()}`
        });
      } else {
        toast.warning('Nenhum telefone encontrado nas fontes disponíveis.');
      }
    } catch (error) {
      toast.error('Erro ao buscar telefones');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('LinkedIn')) return <Linkedin className="w-4 h-4" />;
    if (source.includes('WhatsApp')) return <MessageCircle className="w-4 h-4" />;
    if (source.includes('Facebook')) return <Facebook className="w-4 h-4" />;
    if (source.includes('Instagram')) return <Instagram className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'hot') {
      return (
        <Badge className="bg-green-500 text-white gap-1">
          <CheckCircle className="w-3 h-3" />
          QUENTE
        </Badge>
      );
    } else if (status === 'warm') {
      return (
        <Badge className="bg-yellow-500 text-white gap-1">
          <AlertTriangle className="w-3 h-3" />
          MORNO
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="gap-1">
          <XCircle className="w-3 h-3" />
          FRIO
        </Badge>
      );
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">🤖 Validador IA de Telefones</h3>
            <p className="text-sm text-gray-600">
              Busca em 9 fontes com análise de confiança
            </p>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Buscar Telefones
            </>
          )}
        </Button>
      </div>

      {/* Lead Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Nome:</span>
            <p className="font-medium">{leadName}</p>
          </div>
          {leadEmail && (
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{leadEmail}</p>
            </div>
          )}
          {leadCompany && (
            <div>
              <span className="text-gray-600">Empresa:</span>
              <p className="font-medium">{leadCompany}</p>
            </div>
          )}
          {existingPhone && (
            <div>
              <span className="text-gray-600">Telefone Atual:</span>
              <p className="font-medium">{existingPhone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && result.suggestions.length > 0 && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Fontes</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{result.totalSources}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Score IA</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{result.aiScore}/100</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Sugestões</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{result.suggestions.length}</p>
            </div>
          </div>

          {/* Phone Suggestions */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Telefones Encontrados (ordenados por confiança)
            </h4>

            {result.suggestions.map((suggestion, index) => (
              <PhoneSuggestionCard
                key={index}
                suggestion={suggestion}
                rank={index + 1}
                onSelect={() => {
                  if (onPhoneSelected) {
                    onPhoneSelected(suggestion.phone);
                  }
                  toast.success(`Telefone ${suggestion.phone} selecionado!`);
                }}
                getStatusBadge={getStatusBadge}
                getSourceIcon={getSourceIcon}
              />
            ))}
          </div>

          {/* Processing Time */}
          <p className="text-xs text-gray-500 text-center">
            ⚡ Processado em {result.processingTime}ms
          </p>
        </div>
      )}

      {/* Empty State */}
      {result && result.suggestions.length === 0 && (
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">
            Nenhum telefone encontrado
          </h4>
          <p className="text-sm text-gray-600">
            Tente adicionar mais informações do lead (email, empresa, LinkedIn)
          </p>
        </div>
      )}

      {/* Before Search */}
      {!result && !isSearching && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            IA Multi-Source Phone Finder
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            A IA busca e valida telefones em 9 fontes diferentes:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {[
              'Apollo.io',
              'LinkedIn',
              'Hunter.io',
              'Clearbit',
              'RocketReach',
              'WhatsApp',
              'Facebook',
              'Instagram',
              'Bases Públicas'
            ].map(source => (
              <Badge key={source} variant="outline" className="gap-1">
                {getSourceIcon(source)}
                {source}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ============ CARD DE SUGESTÃO ============
function PhoneSuggestionCard({
  suggestion,
  rank,
  onSelect,
  getStatusBadge,
  getSourceIcon
}: {
  suggestion: PhoneSuggestion;
  rank: number;
  onSelect: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  getSourceIcon: (source: string) => JSX.Element;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Rank */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            rank === 1 
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {rank}
          </div>

          {/* Phone */}
          <div>
            <p className="text-lg font-bold">{suggestion.phone}</p>
            <p className="text-sm text-gray-600">{suggestion.sources.length} fonte(s)</p>
          </div>
        </div>

        {/* Status Badge */}
        {getStatusBadge(suggestion.status)}
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Confiança da IA</span>
          <span className="font-bold">{suggestion.confidence}/100</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              suggestion.confidence >= 80
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : suggestion.confidence >= 60
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}
            style={{ width: `${suggestion.confidence}%` }}
          />
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-purple-900">{suggestion.aiReasoning}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-sm font-medium text-blue-900">{suggestion.recommendation}</p>
      </div>

      {/* Sources (Expandable) */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between"
        >
          <span className="text-sm">Ver {suggestion.sources.length} fonte(s)</span>
          <span className="text-xs">{expanded ? '▲' : '▼'}</span>
        </Button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {suggestion.sources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                <div className="flex items-center gap-2">
                  {getSourceIcon(source.source)}
                  <span className="font-medium">{source.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  {source.metadata?.verified && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Shield className="w-3 h-3" />
                      Verificado
                    </Badge>
                  )}
                  <span className="text-gray-600">{source.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={onSelect}
        className="w-full mt-3"
        variant={suggestion.status === 'hot' ? 'default' : 'outline'}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Usar Este Telefone
      </Button>
    </div>
  );
}
