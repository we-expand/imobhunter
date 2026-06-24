import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { accessProtection } from '../lib/access-protection';
import { emailService } from '../lib/email-service';
import { toast } from 'sonner';
import { Link2, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickAccessTokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAccessTokenModal({ open, onOpenChange }: QuickAccessTokenModalProps) {
  const [email, setEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [validityHours, setValidityHours] = useState('72');
  const [maxAccesses, setMaxAccesses] = useState('50');
  const [generatedURL, setGeneratedURL] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!email.trim() || !clientName.trim()) {
      toast.error('Preencha email e nome do cliente');
      return;
    }

    setGenerating(true);

    // Simula delay de geração
    await new Promise(resolve => setTimeout(resolve, 500));

    const token = accessProtection.generateToken(
      email.trim(),
      clientName.trim(),
      parseInt(validityHours),
      parseInt(maxAccesses)
    );

    const url = accessProtection.generateProtectedURL(token.token);
    setGeneratedURL(url);

    // Copia automaticamente
    navigator.clipboard.writeText(url);

    // 📧 ENVIA EMAIL REAL para o cliente
    emailService.sendAccessTokenEmail(
      email.trim(),
      clientName.trim(),
      url,
      parseInt(validityHours),
      parseInt(maxAccesses)
    );

    toast.success('✅ Link criado e copiado!', {
      description: 'URL protegida copiada e email enviado ao cliente',
      duration: 5000,
    });

    setGenerating(false);
  };

  const handleCopyAgain = () => {
    navigator.clipboard.writeText(generatedURL);
    toast.success('URL copiada novamente!');
  };

  const handleClose = () => {
    setEmail('');
    setClientName('');
    setValidityHours('72');
    setMaxAccesses('50');
    setGeneratedURL('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Gerar Link de Acesso Protegido
          </DialogTitle>
          <DialogDescription>
            Crie um link exclusivo e temporário para enviar ao cliente
          </DialogDescription>
        </DialogHeader>

        {!generatedURL ? (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="modal-email">Email do Cliente *</Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="cliente@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-name">Nome do Cliente *</Label>
              <Input
                id="modal-name"
                placeholder="Carlos Silva - Empresa XYZ"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validade</Label>
                <Select value={validityHours} onValueChange={setValidityHours}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24h (1 dia)</SelectItem>
                    <SelectItem value="48">48h (2 dias)</SelectItem>
                    <SelectItem value="72">72h (3 dias)</SelectItem>
                    <SelectItem value="168">7 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Máx. Acessos</Label>
                <Select value={maxAccesses} onValueChange={setMaxAccesses}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 acessos</SelectItem>
                    <SelectItem value="25">25 acessos</SelectItem>
                    <SelectItem value="50">50 acessos</SelectItem>
                    <SelectItem value="100">100 acessos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2 text-xs text-blue-900">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Proteções incluídas:</p>
                  <ul className="space-y-0.5 opacity-90">
                    <li>• URL mascarada após primeiro acesso</li>
                    <li>• Token único e impossível de adivinhar</li>
                    <li>• Watermark invisível com dados do cliente</li>
                    <li>• Logs completos de atividade</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={generating || !email.trim() || !clientName.trim()}
              className="w-full h-11"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Gerar Link Protegido
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Link criado com sucesso!</p>
                  <p className="text-sm text-green-700 mt-1">
                    URL copiada automaticamente para área de transferência
                  </p>
                </div>
              </div>

              <div className="bg-white border border-green-300 rounded-lg p-3 space-y-2">
                <Label className="text-xs text-gray-600">URL Protegida:</Label>
                <code className="text-xs break-all block text-gray-800">
                  {generatedURL}
                </code>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-900 space-y-1">
                <p className="font-medium">✅ Configurações:</p>
                <p>• Cliente: {clientName}</p>
                <p>• Email: {email}</p>
                <p>• Validade: {parseInt(validityHours) >= 24 ? `${parseInt(validityHours) / 24} dias` : `${validityHours}h`}</p>
                <p>• Limite: {maxAccesses} acessos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCopyAgain}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Novamente
              </Button>

              <Button 
                onClick={handleClose}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}