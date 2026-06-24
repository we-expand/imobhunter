/**
 * 📊 DASHBOARD SOCIAL OVERVIEW
 * Card de visão geral das redes sociais no Dashboard
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge-export';
import {
  Linkedin, Facebook, Instagram, Twitter, Music,
  TrendingUp, Users, Eye, Heart, ExternalLink, ArrowRight
} from 'lucide-react';

interface SocialStats {
  platform: string;
  icon: any;
  color: string;
  connected: boolean;
  leads: number;
  engagement: number;
  trend: number;
}

export function DashboardSocialOverview() {
  const socialStats: SocialStats[] = [
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700',
      connected: true,
      leads: 234,
      engagement: 8.5,
      trend: 12,
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 via-purple-500 to-orange-500',
      connected: true,
      leads: 189,
      engagement: 12.3,
      trend: 8,
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-indigo-600',
      connected: false,
      leads: 0,
      engagement: 0,
      trend: 0,
    },
    {
      platform: 'Twitter/X',
      icon: Twitter,
      color: 'from-sky-500 to-blue-600',
      connected: false,
      leads: 0,
      engagement: 0,
      trend: 0,
    },
    {
      platform: 'TikTok',
      icon: Music,
      color: 'from-black via-purple-600 to-pink-600',
      connected: false,
      leads: 0,
      engagement: 0,
      trend: 0,
    },
  ];

  const connectedPlatforms = socialStats.filter(s => s.connected);
  const totalLeads = socialStats.reduce((sum, s) => sum + s.leads, 0);
  const avgEngagement = connectedPlatforms.length > 0
    ? connectedPlatforms.reduce((sum, s) => sum + s.engagement, 0) / connectedPlatforms.length
    : 0;

  return (
    <Card className="border border-white/5 bg-zinc-900/40 backdrop-blur-sm shadow-xl h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center border border-white/10">
              <Users className="w-4 h-4 text-white" />
            </div>
            Social Network
          </CardTitle>
          <Button size="sm" variant="ghost" className="gap-1 text-zinc-400 hover:text-white hover:bg-white/5">
            View Analytics
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-indigo-400" />
              <p className="text-xs text-zinc-400">Total Leads</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalLeads}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-zinc-400">Engagement</p>
            </div>
            <p className="text-2xl font-bold text-white">{avgEngagement.toFixed(1)}%</p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-zinc-400">Connected</p>
            </div>
            <p className="text-2xl font-bold text-white">{connectedPlatforms.length}/5</p>
          </div>
        </div>

        {/* Platform List */}
        <div className="space-y-2">
          {socialStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.platform}
                className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all
                  ${stat.connected 
                    ? 'bg-white/5 border-white/5 hover:border-indigo-500/30 hover:bg-white/10' 
                    : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-md border border-white/10`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{stat.platform}</p>
                    {stat.connected ? (
                      <p className="text-xs text-zinc-400">{stat.leads} leads found</p>
                    ) : (
                      <p className="text-xs text-zinc-600">Disconnected</p>
                    )}
                  </div>
                </div>

                {stat.connected ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-400">{stat.engagement}%</p>
                      <p className="text-xs text-zinc-500">engagement</p>
                    </div>
                    {stat.trend > 0 && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{stat.trend}%
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20">
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Action */}
        {connectedPlatforms.length < 5 && (
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0">
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect More ({5 - connectedPlatforms.length} available)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
