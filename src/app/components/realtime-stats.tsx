import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { 
  Search, 
  Mail, 
  MessageCircle, 
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';

interface RealtimeStatsProps {
  compact?: boolean;
}

export function RealtimeStats({ compact = false }: RealtimeStatsProps) {
  const [stats, setStats] = useState({
    searches: 0,
    emails: 0,
    messages: 0,
    qualified: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Verifica se IA está ativa
    const checkAIStatus = () => {
      const aiStatus = localStorage.getItem('ai-active');
      setIsActive(aiStatus === 'true');
    };

    checkAIStatus();
    const interval = setInterval(checkAIStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Incrementa estatísticas aleatoriamente
    const incrementStats = () => {
      setStats(prev => {
        const random = Math.random();
        if (random < 0.3) {
          return { ...prev, searches: prev.searches + Math.floor(Math.random() * 3) + 1 };
        } else if (random < 0.5) {
          return { ...prev, emails: prev.emails + 1 };
        } else if (random < 0.7) {
          return { ...prev, messages: prev.messages + 1 };
        } else {
          return { ...prev, qualified: prev.qualified + 1 };
        }
      });
    };

    const interval = setInterval(incrementStats, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setUptime(0);
      return;
    }

    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Badge className={`${isActive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600'}`}>
          <motion.div
            className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
            animate={isActive ? {
              scale: [1, 1.3, 1],
              opacity: [1, 0.6, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          {isActive ? 'Operando' : 'Pausada'}
        </Badge>

        {isActive && (
          <>
            <Badge variant="outline" className="bg-white">
              <Search className="w-3 h-3 mr-1" />
              {stats.searches}
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Mail className="w-3 h-3 mr-1" />
              {stats.emails}
            </Badge>
            <Badge variant="outline" className="bg-white">
              <MessageCircle className="w-3 h-3 mr-1" />
              {stats.messages}
            </Badge>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className={`border-2 ${isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Buscas</p>
              <motion.p 
                key={stats.searches}
                className="text-2xl font-bold"
                initial={{ scale: 1.5, color: '#3b82f6' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
              >
                {stats.searches}
              </motion.p>
            </div>
            <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {isActive ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Search className="w-6 h-6 text-blue-600" />
                </motion.div>
              ) : (
                <Search className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${isActive ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails</p>
              <motion.p 
                key={stats.emails}
                className="text-2xl font-bold"
                initial={{ scale: 1.5, color: '#9333ea' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
              >
                {stats.emails}
              </motion.p>
            </div>
            <div className={`p-3 rounded-lg ${isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Mail className={`w-6 h-6 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mensagens</p>
              <motion.p 
                key={stats.messages}
                className="text-2xl font-bold"
                initial={{ scale: 1.5, color: '#10b981' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
              >
                {stats.messages}
              </motion.p>
            </div>
            <div className={`p-3 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <MessageCircle className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-2 ${isActive ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualificados</p>
              <motion.p 
                key={stats.qualified}
                className="text-2xl font-bold"
                initial={{ scale: 1.5, color: '#f97316' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
              >
                {stats.qualified}
              </motion.p>
            </div>
            <div className={`p-3 rounded-lg ${isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <TrendingUp className={`w-6 h-6 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 lg:col-span-4"
        >
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Zap className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <div>
                    <p className="font-medium">IA em operação contínua</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Tempo ativo: {formatUptime(uptime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.div
                    className="w-2 h-8 bg-green-500 rounded-full"
                    animate={{ scaleY: [1, 1.5, 0.8, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-8 bg-blue-500 rounded-full"
                    animate={{ scaleY: [1.2, 0.8, 1.5, 1, 1.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-8 bg-purple-500 rounded-full"
                    animate={{ scaleY: [0.8, 1.5, 1, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
