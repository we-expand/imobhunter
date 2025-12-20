import React, { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, CheckCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { PageType } from '../App';

interface WhatsAppPageProps {
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

const WHATSAPP_SERVER_URL = 'https://tapago-whatsapp-server.onrender.com';

export function WhatsAppPage({ onNavigate, onLogout }: WhatsAppPageProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${WHATSAPP_SERVER_URL}/status`);
      const data = await response.json();
      
      if (data.connected) {
        setIsConnected(true);
        setSessionInfo(data.session);
      }
    } catch (err) {
      console.error('Erro ao verificar conexão:', err);
    }
  };

  const initializeConnection = async () => {
    setIsLoading(true);
    setError('');
    setQrCode('');

    try {
      const response = await fetch(`${WHATSAPP_SERVER_URL}/start`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.qrCode) {
        setQrCode(data.qrCode);
        startPolling();
      } else if (data.connected) {
        setIsConnected(true);
        setSessionInfo(data.session);
      }
    } catch (err: any) {
      setError('Erro ao inicializar WhatsApp: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${WHATSAPP_SERVER_URL}/status`);
        const data = await response.json();

        if (data.connected) {
          setIsConnected(true);
          setSessionInfo(data.session);
          setQrCode('');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    }, 3000);

    setTimeout(() => clearInterval(interval), 120000);
  };

  const disconnect = async () => {
    try {
      await fetch(`${WHATSAPP_SERVER_URL}/logout`, {
        method: 'POST',
      });
      setIsConnected(false);
      setSessionInfo(null);
      setQrCode('');
    } catch (err: any) {
      setError('Erro ao desconectar: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={onLogout}
              className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-slate-800">Conexão WhatsApp</h2>
              <p className="text-slate-600">WPPConnect + Render 24/7</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isConnected ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-emerald-600 mb-2">WhatsApp Conectado!</h3>
              <p className="text-slate-600 mb-6">
                Servidor operacional e pronto para enviar mensagens
              </p>
              
              {sessionInfo && (
                <div className="bg-slate-50 rounded-xl p-6 mb-6 text-left">
                  <p className="text-slate-600 mb-2">
                    <strong>Sessão:</strong> {sessionInfo.sessionName || 'tapago-session'}
                  </p>
                  <p className="text-slate-600">
                    <strong>Estado:</strong> Ativo
                  </p>
                </div>
              )}

              <button
                onClick={disconnect}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Desconectar WhatsApp
              </button>
            </div>
          ) : qrCode ? (
            <div className="text-center">
              <div className="mb-6">
                <QrCode className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-slate-800 mb-2">Leia o QR Code</h3>
                <p className="text-slate-600">
                  Abra o WhatsApp no seu telemóvel e leia o código abaixo
                </p>
              </div>

              <div className="bg-white border-4 border-emerald-500 rounded-2xl p-8 inline-block mb-6">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="w-64 h-64"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Aguardando leitura do QR Code...</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <MessageSquare className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-800 mb-2">WhatsApp Desconectado</h3>
              <p className="text-slate-600 mb-6">
                Conecte o WhatsApp para começar a enviar mensagens automáticas
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 flex items-center gap-2 justify-center">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={initializeConnection}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A inicializar...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Conectar WhatsApp
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Server Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800">
            <strong>Servidor:</strong> tapago-whatsapp-server.onrender.com
          </p>
          <p className="text-blue-700 mt-1">
            WPPConnect executando 24/7 no Render com sessão persistente
          </p>
        </div>
      </div>
    </div>
  );
}
