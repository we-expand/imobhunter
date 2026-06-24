/**
 * 🔍 SERVER VERSION CHECKER
 * Mostra a versão do servidor em tempo real
 */

import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function ServerVersionChecker() {
  const [version, setVersion] = useState<string>('Verificando...');
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkVersion = async () => {
    setStatus('checking');
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ping`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const serverVersion = data.version || data.message || 'Desconhecida';
        setVersion(serverVersion);
        setStatus('success');
        setLastCheck(new Date());
        console.log('✅ Versão do servidor:', serverVersion);
      } else {
        setVersion('Erro ao verificar');
        setStatus('error');
        console.error('❌ Erro ao verificar versão:', response.status);
      }
    } catch (error) {
      setVersion('Erro de conexão');
      setStatus('error');
      console.error('❌ Erro ao conectar:', error);
    }
  };

  useEffect(() => {
    checkVersion();
    // Verificar a cada 10 segundos
    const interval = setInterval(checkVersion, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-3 h-3 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'error':
        return <XCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'success':
        return version.includes('1.2.0') 
          ? 'bg-green-100 text-green-800 border-green-300'
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 max-w-xs">
      <div 
        className={`p-3 rounded-lg shadow-lg border-2 ${getStatusColor()} transition-all`}
        onClick={checkVersion}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-start gap-2">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold mb-1">Versão do Servidor:</div>
            <div className="text-xs break-words font-mono">{version}</div>
            <div className="text-xs opacity-60 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastCheck.toLocaleTimeString('pt-PT')}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-center mt-1 text-gray-500">
        Clique para atualizar
      </div>
    </div>
  );
}
