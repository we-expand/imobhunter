import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Mail, UserPlus, LogIn, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carregar notificações do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user-notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const notifs = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
      } catch (e) {
        console.error('Erro ao carregar notificações:', e);
      }
    }

    // Listener para novas notificações
    const handleNewNotification = (event: CustomEvent) => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        ...event.detail,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Manter últimas 50
      setUnreadCount(prev => prev + 1);
    };

    window.addEventListener('new-notification' as any, handleNewNotification);
    return () => {
      window.removeEventListener('new-notification' as any, handleNewNotification);
    };
  }, []);

  // Salvar notificações no localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('user-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('user-notifications');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActionIcon = (title: string) => {
    if (title.includes('Login') || title.includes('login')) return <LogIn className="w-4 h-4" />;
    if (title.includes('Cadastro') || title.includes('cadastro')) return <UserPlus className="w-4 h-4" />;
    if (title.includes('Email') || title.includes('email')) return <Mail className="w-4 h-4" />;
    if (title.includes('Configuração') || title.includes('configuração')) return <SettingsIcon className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Painel */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-semibold">Notificações</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                    {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Marcar todas como lidas
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Limpar tudo
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              {getActionIcon(notif.title)}
                              {notif.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(notif.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes} min`;
  if (hours < 24) return `Há ${hours}h`;
  if (days < 7) return `Há ${days}d`;
  
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper para adicionar notificações de qualquer lugar
export function addNotification(
  type: 'success' | 'info' | 'warning' | 'error',
  title: string,
  message: string
) {
  window.dispatchEvent(
    new CustomEvent('new-notification', {
      detail: { type, title, message }
    })
  );
}
