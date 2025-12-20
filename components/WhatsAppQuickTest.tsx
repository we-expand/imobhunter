import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

export function WhatsAppQuickTest() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendTestMessage = async () => {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      toast.error('Digite um número de telefone');
      return;
    }

    setIsSending(true);
    
    try {
      toast.info('🚀 Enviando mensagem de teste...');
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const response = await fetch(`${API_URL}/whatsapp-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ Mensagem enviada! Verifique o WhatsApp.');
        console.log('✅ Mensagem enviada com sucesso:', data);
        setPhoneNumber(''); // Limpar campo após sucesso
      } else {
        toast.error(`❌ Erro: ${data.error || 'Falha ao enviar'}`);
        console.error('❌ Erro ao enviar:', data);
      }
    } catch (error: any) {
      toast.error(`❌ Erro: ${error.message}`);
      console.error('❌ Erro ao enviar:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      sendTestMessage();
    }
  };

  return (
    <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
          <Send className="w-5 h-5" />
          Enviar Mensagem Teste - WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="+351 912 345 678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={sendTestMessage}
            disabled={isSending || !phoneNumber}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          💡 Dica: Use o formato internacional com código do país (+351 para Portugal)
        </p>
      </CardContent>
    </Card>
  );
}
