/**
 * 🔥 AUTO-CONFIGURAÇÃO DO APOLLO.IO
 * Configura automaticamente a API key do Apollo.io
 */

import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

export function AutoConfigureApollo() {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const autoConfigured = localStorage.getItem('apollo-auto-configured');
    
    // 🔥 DESABILITADO TEMPORARIAMENTE PARA DEBUG
    // Você pode configurar manualmente via Configurações → Segurança
    if (false && !autoConfigured) {
      configureApollo();
    }
  }, []);

  const configureApollo = async () => {
    const apolloKey = 'DxFa4BMdoNliED5XiOlOkw'; // 🔑 Key fornecida pelo usuário

    console.log('🚀 Auto-configurando Apollo.io API Key...');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/search/config/api-keys`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            apolloKey: apolloKey
          }),
        }
      );

      // Verificar se a resposta é OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Tentar ler como texto primeiro para debug
      const responseText = await response.text();
      console.log('📥 Resposta do servidor (raw):', responseText);

      // Tentar fazer parse do JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse da resposta:', responseText);
        throw new Error('Resposta do servidor não é JSON válido');
      }

      if (data.success) {
        console.log('✅ Apollo.io API Key CONFIGURADA COM SUCESSO!');
        console.log('⏳ Aguarde 10-15 segundos para aplicar...');
        
        localStorage.setItem('apollo-auto-configured', 'true');
        setConfigured(true);
        
        toast.success('✅ Apollo.io configurado!', {
          description: 'Aguarde 15 segundos antes de fazer buscas',
          duration: 15000,
        });
      } else {
        console.error('❌ Erro ao configurar API key:', data.error);
        
        toast.error('❌ Erro ao configurar Apollo.io', {
          description: data.error || 'Erro desconhecido',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao configurar Apollo.io:', error);
      
      toast.error('❌ Erro ao configurar Apollo.io', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  // Componente invisível - apenas executa a lógica
  return null;
}