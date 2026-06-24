/**
 * 🌐 SOCIAL MEDIA SEARCH - BUSCA EM REDES SOCIAIS
 * Integração com as 5 principais plataformas do mundo
 * LinkedIn | Facebook | Instagram | Twitter/X | TikTok
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge-export';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search, Users, Heart, Share2, MessageCircle, Eye, TrendingUp,
  Linkedin, Facebook, Instagram, Twitter, Music, Play, Image,
  MapPin, Calendar, Clock, Link2, ExternalLink, Download,
  Star, Zap, Target, Globe, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface SocialProfile {
  id: string;
  platform: 'linkedin' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  location: string;
  website: string;
  engagement: number;
  lastActive: string;
  profileUrl: string;
  industry?: string;
  interests?: string[];
}

interface SocialPost {
  id: string;
  platform: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  media?: string[];
  hashtags?: string[];
}

const platformConfig = {
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-600',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 via-purple-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-600',
  },
  twitter: {
    name: 'Twitter/X',
    icon: Twitter,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-600',
  },
  tiktok: {
    name: 'TikTok',
    icon: Music,
    color: 'from-black via-purple-600 to-pink-600',
    bgColor: 'bg-gradient-to-br from-gray-50 to-pink-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-900',
  },
};

export function SocialMediaSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'instagram', 'twitter']);
  const [searchType, setSearchType] = useState<'profiles' | 'posts'>('profiles');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SocialProfile[]>([]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Digite algo para buscar');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Selecione pelo menos uma rede social');
      return;
    }

    setLoading(true);

    try {
      // Simulação de busca - em produção, chamaria APIs reais
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResults: SocialProfile[] = [
        {
          id: '1',
          platform: 'linkedin',
          username: 'maria.silva',
          displayName: 'Maria Silva',
          avatar: 'https://ui-avatars.io/api/?name=Maria+Silva&background=0D8ABC&color=fff',
          bio: 'Consultora Imobiliária | Especialista em Investimentos | Lisboa',
          followers: 12500,
          following: 850,
          posts: 342,
          verified: true,
          location: 'Lisboa, Portugal',
          website: 'www.mariasilva.pt',
          engagement: 8.5,
          lastActive: '2h atrás',
          profileUrl: 'https://linkedin.com/in/mariasilva',
          industry: 'Real Estate',
          interests: ['Investimentos', 'Luxury Properties', 'Property Management'],
        },
        {
          id: '2',
          platform: 'instagram',
          username: '@casas_luxo_pt',
          displayName: 'Casas de Luxo Portugal',
          avatar: 'https://ui-avatars.io/api/?name=Casas+Luxo&background=E1306C&color=fff',
          bio: '🏡 Imóveis de Luxo em Portugal\n✨ Propriedades Exclusivas\n📍 Lisboa | Porto | Algarve',
          followers: 45200,
          following: 1200,
          posts: 1834,
          verified: true,
          location: 'Portugal',
          website: 'casasluxo.pt',
          engagement: 12.3,
          lastActive: '30min atrás',
          profileUrl: 'https://instagram.com/casas_luxo_pt',
          interests: ['Luxury Real Estate', 'Interior Design', 'Architecture'],
        },
        {
          id: '3',
          platform: 'twitter',
          username: '@RealEstateNews',
          displayName: 'Real Estate News PT',
          avatar: 'https://ui-avatars.io/api/?name=RE+News&background=1DA1F2&color=fff',
          bio: 'Notícias sobre mercado imobiliário português 🏠 | Análises e tendências | Seguido por +50k profissionais',
          followers: 52300,
          following: 3400,
          posts: 8932,
          verified: true,
          location: 'Portugal',
          website: 'realestate-news.pt',
          engagement: 6.8,
          lastActive: '15min atrás',
          profileUrl: 'https://twitter.com/RealEstateNews',
          interests: ['Market Analysis', 'Investment', 'Property Trends'],
        },
        {
          id: '4',
          platform: 'facebook',
          username: 'imoveis.portugal',
          displayName: 'Imóveis Portugal - Grupo',
          avatar: 'https://ui-avatars.io/api/?name=Imoveis+PT&background=1877F2&color=fff',
          bio: 'Maior grupo de imóveis de Portugal com +100k membros. Compra, venda e arrendamento.',
          followers: 128000,
          following: 450,
          posts: 5621,
          verified: true,
          location: 'Portugal',
          website: 'imoveisportugal.com',
          engagement: 15.2,
          lastActive: '1h atrás',
          profileUrl: 'https://facebook.com/groups/imoveis.portugal',
          interests: ['Property Sales', 'Rentals', 'Investment Opportunities'],
        },
        {
          id: '5',
          platform: 'tiktok',
          username: '@casasincriveis',
          displayName: 'Casas Incríveis PT',
          avatar: 'https://ui-avatars.io/api/?name=Casas+Inc&background=000000&color=fff',
          bio: '🎥 Tours virtuais de casas incríveis\n🏠 Portugal & Espanha\n👇 Veja nossos vídeos',
          followers: 234000,
          following: 680,
          posts: 567,
          verified: true,
          location: 'Lisboa, Portugal',
          website: 'linktr.ee/casasincriveis',
          engagement: 18.7,
          lastActive: '45min atrás',
          profileUrl: 'https://tiktok.com/@casasincriveis',
          interests: ['Virtual Tours', 'Property Showcase', 'Real Estate Marketing'],
        },
      ];

      const filteredResults = mockResults.filter(r => 
        selectedPlatforms.includes(r.platform)
      );

      setResults(filteredResults);
      toast.success(`${filteredResults.length} perfis encontrados em ${selectedPlatforms.length} rede(s)`);
    } catch (error) {
      toast.error('Erro ao buscar. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Busca em Redes Sociais
              </h2>
              <p className="text-sm text-gray-600">
                Encontre leads nas 5 maiores plataformas do mundo
              </p>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="space-y-3">
            <Label className="font-semibold">Selecione as Redes Sociais:</Label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(platformConfig).map(([key, config]) => {
                const Icon = config.icon;
                const isSelected = selectedPlatforms.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => togglePlatform(key)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105
                      ${isSelected 
                        ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg` 
                        : `${config.bgColor} ${config.borderColor} ${config.textColor}`
                      }
                    `}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">{config.name}</p>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-3 mt-4">
            <Label htmlFor="social-search">O que você quer buscar?</Label>
            <div className="flex gap-2">
              <Input
                id="social-search"
                placeholder="Ex: consultores imobiliários Lisboa, #luxuryrealestate, @username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            {/* Search Type Toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={searchType === 'profiles' ? 'default' : 'outline'}
                onClick={() => setSearchType('profiles')}
                className={searchType === 'profiles' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                <Users className="w-4 h-4 mr-2" />
                Perfis
              </Button>
              <Button
                size="sm"
                variant={searchType === 'posts' ? 'default' : 'outline'}
                onClick={() => setSearchType('posts')}
                className={searchType === 'posts' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Posts
              </Button>
            </div>
          </div>

          {/* Stats */}
          {selectedPlatforms.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>
                Buscando em <strong>{selectedPlatforms.length}</strong> rede(s) social(is)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Resultados ({results.length})
                  </span>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {results.map((profile) => {
                      const config = platformConfig[profile.platform];
                      const Icon = config.icon;

                      return (
                        <motion.div
                          key={profile.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
                        >
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={profile.avatar}
                                alt={profile.displayName}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center shadow-lg`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{profile.displayName}</h3>
                                    {profile.verified && (
                                      <Badge className="bg-blue-500 text-white">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verificado
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{profile.username}</p>
                                </div>

                                <Badge className={`${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                                  <Star className="w-3 h-3 mr-1" />
                                  {profile.engagement}% eng.
                                </Badge>
                              </div>

                              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{profile.bio}</p>

                              {/* Stats */}
                              <div className="grid grid-cols-4 gap-3 mb-3">
                                <div className="text-center bg-gray-50 rounded-lg p-2">
                                  <p className="font-bold text-sm">{formatNumber(profile.followers)}</p>
                                  <p className="text-xs text-gray-600">Seguidores</p>
                                </div>
                                <div className="text-center bg-gray-50 rounded-lg p-2">
                                  <p className="font-bold text-sm">{formatNumber(profile.following)}</p>
                                  <p className="text-xs text-gray-600">Seguindo</p>
                                </div>
                                <div className="text-center bg-gray-50 rounded-lg p-2">
                                  <p className="font-bold text-sm">{formatNumber(profile.posts)}</p>
                                  <p className="text-xs text-gray-600">Posts</p>
                                </div>
                                <div className="text-center bg-green-50 rounded-lg p-2">
                                  <p className="font-bold text-sm text-green-700">{profile.lastActive}</p>
                                  <p className="text-xs text-gray-600">Ativo</p>
                                </div>
                              </div>

                              {/* Meta Info */}
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                {profile.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {profile.location}
                                  </div>
                                )}
                                {profile.website && (
                                  <div className="flex items-center gap-1">
                                    <Link2 className="w-3 h-3" />
                                    {profile.website}
                                  </div>
                                )}
                              </div>

                              {/* Interests/Tags */}
                              {profile.interests && profile.interests.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {profile.interests.map((interest, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => window.open(profile.profileUrl, '_blank')}
                                  className={`bg-gradient-to-r ${config.color}`}
                                >
                                  <ExternalLink className="w-3 h-3 mr-2" />
                                  Ver Perfil
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Target className="w-3 h-3 mr-2" />
                                  Adicionar a Campanha
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Star className="w-3 h-3 mr-2" />
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-600 mb-2">Nenhuma busca realizada</h3>
            <p className="text-sm text-gray-500">
              Selecione as redes sociais e digite sua busca acima
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
