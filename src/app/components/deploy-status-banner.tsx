/**
 * 🚀 DEPLOY STATUS BANNER
 * Banner que mostra o status do deploy automático do Supabase
 */

import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Rocket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function DeployStatusBanner() {
  const [visible, setVisible] = useState(true);
  const [deployStatus, setDeployStatus] = useState<'waiting' | 'deploying' | 'success' | 'unknown'>('waiting');
  const [serverVersion, setServerVersion] = useState<string>('Verificando...');
  const [countdown, setCountdown] = useState(60);

  const checkDeployStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ping`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const version = data.version || '';
        setServerVersion(version);

        if (version.includes('1.2.0')) {
          setDeployStatus('success');
          // Auto-hide após 5 segundos quando sucesso
          setTimeout(() => setVisible(false), 5000);
        } else {
          setDeployStatus('waiting');
        }
      } else {
        setDeployStatus('unknown');
      }
    } catch (error) {
      setDeployStatus('unknown');
    }
  };

  useEffect(() => {
    checkDeployStatus();

    // Verificar a cada 5 segundos
    const checkInterval = setInterval(checkDeployStatus, 5000);

    // Countdown de 60 segundos
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setDeployStatus('deploying');
          return 60; // Reinicia
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  if (!visible) return null;

  const getStatusConfig = () => {
    switch (deployStatus) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
          title: '✅ Deploy Concluído!',
          message: 'Servidor atualizado para v1.2.0. Apollo está pronto!',
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-300',
        };
      case 'deploying':
        return {
          icon: <Rocket className="w-6 h-6 text-blue-600 animate-bounce" />,
          title: '🚀 Deploy em Andamento...',
          message: 'Supabase está fazendo deploy automático. Aguarde...',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-300',
        };
      case 'waiting':
        return {
          icon: <Clock className="w-6 h-6 text-orange-600" />,
          title: '⏳ Aguardando Auto-Deploy',
          message: `Supabase detectará as mudanças em ${countdown}s`,
          bgColor: 'from-orange-50 to-yellow-50',
          borderColor: 'border-orange-300',
        };
      default:
        return {
          icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
          title: '🔍 Verificando Status...',
          message: 'Checando versão do servidor...',
          bgColor: 'from-gray-50 to-slate-50',
          borderColor: 'border-gray-300',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`fixed top-6 left-1/2 -translate-x-1/2 max-w-2xl z-50 shadow-2xl border-2 ${config.borderColor} bg-gradient-to-br ${config.bgColor} animate-slide-down`}>
      <div className="p-4 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          {config.icon}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{config.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{config.message}</p>
            
            <div className="text-xs bg-white/50 rounded p-2 font-mono">
              <div>Versão Atual: <span className="font-bold">{serverVersion}</span></div>
              {deployStatus === 'waiting' && (
                <div className="mt-1 text-orange-700">
                  💡 O Supabase faz deploy automático quando detecta mudanças no código
                </div>
              )}
              {deployStatus === 'success' && (
                <div className="mt-1 text-green-700">
                  🎯 Clique no botão roxo "🔬 Testar Apollo" para verificar!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
