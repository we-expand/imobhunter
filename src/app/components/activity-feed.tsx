import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Activity } from '../types';
import { Linkedin, Mail, MessageCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: 'success' | 'pending' | 'failed') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Feed de Atividade em Tempo Real</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Ao Vivo
        </Badge>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                {getChannelIcon(activity.channel)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">{activity.action}</p>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{activity.leadName}</span> - {activity.cluster}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
