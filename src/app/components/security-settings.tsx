import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { QRValidationModal } from './qr-validation-modal';
import { APIKeysDiagnostics } from './api-keys-diagnostics';
import { authService } from '../lib/auth-service';
import { storage } from '../lib/storage-service';
import { 
  Shield, CheckCircle, XCircle, Smartphone, Lock, Bell, Eye, Trash2, 
  AlertTriangle, Sparkles, Key, Clock, Mail, Zap, Activity, Database
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function SecuritySettings() {
  const [showQRModal, setShowQRModal] = useState(false);
  const user = authService.getCurrentUser();
  const session = authService.validateSession();

  const handleEnable2FA = () => {
    setShowQRModal(true);
  };

  const handleDisable2FA = () => {
    if (confirm('⚠️ Tem certeza que deseja desativar a autenticação de 2 fatores? Sua conta ficará menos segura.')) {
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user?.id);
      
      if (userIndex !== -1) {
        users[userIndex].twoFactorEnabled = false;
        users[userIndex].twoFactorSecret = undefined;
        localStorage.setItem('app-users', JSON.stringify(users));
        
        toast.success('2FA desativado');
        window.location.reload();
      }
    }
  };

  const handleQRValidated = () => {
    setShowQRModal(false);
    toast.success('2FA ativado com sucesso!');
    window.location.reload();
  };

  const handleClearUserData = async () => {
    if (!confirm('⚠️ ATENÇÃO! Você irá deletar APENAS seus dados de autenticação (usuário e 2FA). Os dados de leads e atividades serão mantidos.\n\nDeseja continuar?')) {
      return;
    }

    try {
      await storage.clearUserAuthData();
      toast.success('✅ Dados de autenticação deletados!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast.error('Erro ao deletar dados');
      console.error(error);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('🚨 Você irá deletar TODOS os dados da plataforma.\n\nEsta ação é IRREVERSÍVEL!\n\nDeseja continuar?')) {
      return;
    }

    const confirmText = prompt('Digite "DELETAR TUDO" para confirmar:');
    if (confirmText !== 'DELETAR TUDO') {
      toast.error('Confirmação incorreta. Operação cancelada.');
      return;
    }

    try {
      await storage.clearAllData();
      toast.success('✅ Todos os dados deletados!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast.error('Erro ao deletar dados');
      console.error(error);
    }
  };

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {/* Card Compacto de Segurança */}
        <Card className="border border-gray-200 bg-gray-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              Segurança & Privacidade
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Configurações básicas de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Status 2FA */}
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">Autenticação 2FA</span>
              </div>
              {user?.twoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0 h-5">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ativo
                </Badge>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleEnable2FA}
                  className="h-6 text-[10px] px-2"
                >
                  Ativar
                </Button>
              )}
            </div>

            {/* Sessão Ativa */}
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">Sessão</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0 h-5">
                {session.isValid ? 'Ativa' : 'Inválida'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Modal de QR Code */}
        {showQRModal && user && (
          <QRValidationModal
            isOpen={showQRModal}
            user={user}
            onValidated={handleQRValidated}
            onClose={() => setShowQRModal(false)}
          />
        )}
      </motion.div>
    </>
  );
}