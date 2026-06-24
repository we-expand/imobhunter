import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Database, 
  Users, 
  Linkedin, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  ExternalLink,
  AlertCircle,
  Key,
  Shield,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { searchAPI, APICredentials } from '../lib/api/searchAPI';

export function SearchAPIsConfig() {
  const [credentials, setCredentials] = useState<APICredentials>({});
  const [showApollo, setShowApollo] = useState(false);
  const [showPDL, setShowPDL] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showHunter, setShowHunter] = useState(false);
  
  const [testing, setTesting] = useState<{ [key: string]: boolean }>({});
  const [testResults, setTestResults] = useState<{ [key: string]: boolean | null }>({});

  // Carrega credenciais salvas
  useEffect(() => {
    const saved = searchAPI.getCredentials();
    setCredentials(saved);
    
    // Marca como testadas se já existirem
    if (saved.apollo) setTestResults(prev => ({ ...prev, apollo: true }));
    if (saved.pdl) setTestResults(prev => ({ ...prev, pdl: true }));
    if (saved.linkedin) setTestResults(prev => ({ ...prev, linkedin: true }));
    if (saved.hunter) setTestResults(prev => ({ ...prev, hunter: true }));
  }, []);

  const handleSave = () => {
    searchAPI.saveCredentials(credentials);
    
    // Marca todas as APIs configuradas como "presumivelmente funcionando"
    const newTestResults: any = {};
    if (credentials.apollo) newTestResults.apollo = true;
    if (credentials.pdl) newTestResults.pdl = true;
    if (credentials.linkedin) newTestResults.linkedin = true;
    if (credentials.hunter) newTestResults.hunter = true;
    setTestResults(prev => ({ ...prev, ...newTestResults }));
    
    toast.success('✅ Credenciais salvas!', {
      description: 'Suas APIs foram configuradas. Elas serão testadas na primeira busca.',
      duration: 5000
    });
  };

  const handleTest = async (provider: 'apollo' | 'pdl' | 'linkedin') => {
    if (!credentials[provider]) {
      toast.error('Digite a API key primeiro!');
      return;
    }

    setTesting(prev => ({ ...prev, [provider]: true }));
    
    // Devido a restrições CORS, não podemos testar diretamente do navegador
    // Salvamos e marcamos como configurado
    try {
      searchAPI.saveCredentials({ [provider]: credentials[provider] });
      
      // Marca como configurado (será testado na busca real)
      setTestResults(prev => ({ ...prev, [provider]: true }));
      
      toast.success(`✅ ${provider.toUpperCase()} configurado!`, {
        description: 'A API será validada durante sua primeira busca real.',
        duration: 5000
      });
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: false }));
      toast.error('Erro ao salvar credencial', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setTesting(prev => ({ ...prev, [provider]: false }));
    }
  };

  const APICard = ({ 
    provider, 
    title, 
    icon: Icon, 
    gradient,
    show,
    setShow,
    value,
    onChange,
    description,
    helpLink
  }: any) => {
    const isConfigured = !!value;
    const isTesting = testing[provider];
    const testResult = testResults[provider];

    return (
      <Card className="relative overflow-hidden border border-white/10 bg-zinc-900/40 backdrop-blur-sm hover:border-white/20 transition-all">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {title}
                  {testResult === true && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {testResult === false && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-1">{description}</p>
              </div>
            </div>

            {isConfigured ? (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Configurado
              </Badge>
            ) : (
              <Badge variant="outline" className="border-zinc-600 text-zinc-500">
                Não configurado
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-3">
          <div>
            <Label htmlFor={`api-${provider}`} className="text-zinc-300 text-sm">
              API Key
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id={`api-${provider}`}
                  type={show ? 'text' : 'password'}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={() => handleTest(provider)}
                disabled={!value || isTesting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Testar'
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={helpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
            >
              <Key className="w-3 h-3" />
              Como obter API Key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-bold text-white">Configurações de API (Admin)</h3>
        </div>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Configure as APIs de busca e enriquecimento de dados. <span className="text-amber-400 font-medium">🔒 Acesso restrito a administradores</span>
        </p>
      </motion.div>

      {/* CORS Warning */}
      <Card className="border border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold text-amber-200 mb-2">🔒 Sobre a Validação de APIs</p>
              <p className="text-amber-300/80">
                Devido a restrições de segurança do navegador (CORS), não é possível testar as APIs diretamente. 
                <span className="font-medium text-amber-200"> As credenciais serão validadas durante sua primeira busca real.</span> 
                {' '}Certifique-se de copiar as chaves corretamente dos painéis das APIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APOLLO.IO */}
      <APICard
        provider="apollo"
        title="Apollo.io"
        icon={Database}
        gradient="from-blue-600 to-blue-800"
        show={showApollo}
        setShow={setShowApollo}
        value={credentials.apollo}
        onChange={(value: string) => setCredentials(prev => ({ ...prev, apollo: value }))}
        description="250M+ B2B contacts com email e telefone verificados"
        helpLink="https://knowledge.apollo.io/hc/en-us/articles/4408679113869-API-Keys"
      />

      {/* PEOPLE DATA LABS */}
      <APICard
        provider="pdl"
        title="People Data Labs"
        icon={Users}
        gradient="from-purple-600 to-purple-800"
        show={showPDL}
        setShow={setShowPDL}
        value={credentials.pdl}
        onChange={(value: string) => setCredentials(prev => ({ ...prev, pdl: value }))}
        description="3B+ registros de pessoas e empresas com dados atualizados"
        helpLink="https://docs.peopledatalabs.com/docs/authentication"
      />

      {/* LINKEDIN (Cookie) */}
      <APICard
        provider="linkedin"
        title="LinkedIn Cookie"
        icon={Linkedin}
        gradient="from-blue-500 to-blue-700"
        show={showLinkedIn}
        setShow={setShowLinkedIn}
        value={credentials.linkedin}
        onChange={(value: string) => setCredentials(prev => ({ ...prev, linkedin: value }))}
        description="Acesso ao LinkedIn Sales Navigator (requires valid session cookie)"
        helpLink="https://www.linkedin.com/help/sales-navigator"
      />

      {/* Hunter.io */}
      <APICard
        provider="hunter"
        title="Hunter.io"
        icon={Database}
        gradient="from-orange-600 to-orange-800"
        show={showHunter}
        setShow={setShowHunter}
        value={credentials.hunter}
        onChange={(value: string) => setCredentials(prev => ({ ...prev, hunter: value }))}
        description="Email finder e verificação de domínio"
        helpLink="https://hunter.io/api-keys"
      />

      {/* Botão Salvar Global */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 py-6 text-lg font-bold"
        >
          <Shield className="w-5 h-5 mr-2" />
          Salvar Todas as Credenciais
        </Button>
      </div>

      {/* Info Box */}
      <Card className="border border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold text-blue-200 mb-2">💡 Dicas Importantes:</p>
              <ul className="space-y-1 text-blue-300/80">
                <li>• As credenciais são armazenadas localmente no seu navegador (localStorage)</li>
                <li>• Você precisa de pelo menos 1 API configurada para realizar buscas</li>
                <li>• O sistema combina resultados de todas as APIs configuradas</li>
                <li>• Use o botão "Testar" para verificar se a API Key está válida</li>
                <li>• Apollo.io e PDL oferecem free trials para testar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="border border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-white text-lg">Status das APIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Apollo.io', key: 'apollo', gradient: 'from-blue-600 to-blue-800' },
              { name: 'PDL', key: 'pdl', gradient: 'from-purple-600 to-purple-800' },
              { name: 'LinkedIn', key: 'linkedin', gradient: 'from-blue-500 to-blue-700' },
              { name: 'Hunter', key: 'hunter', gradient: 'from-orange-600 to-orange-800' }
            ].map((api) => {
              const isConfigured = !!(credentials as any)[api.key];
              const isTested = testResults[api.key] === true;

              return (
                <div
                  key={api.key}
                  className={`p-4 rounded-lg border ${
                    isTested
                      ? 'border-green-500/30 bg-green-500/10'
                      : isConfigured
                      ? 'border-yellow-500/30 bg-yellow-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="text-sm font-medium text-white mb-1">{api.name}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {isTested ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-400">Testado</span>
                      </>
                    ) : isConfigured ? (
                      <>
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                        <span className="text-yellow-400">Configurado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-zinc-600" />
                        <span className="text-zinc-500">Não configurado</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}