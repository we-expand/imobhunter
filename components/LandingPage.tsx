import { CheckCircle, Clock, Euro, Users, FileText, Repeat, CreditCard, TrendingUp, Shield, Zap, Globe, ArrowRight, Star, Sparkles, MessageCircle, BarChart3, Brain, Mic, Volume2, Play, PhoneCall, Headphones, Bug } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TaPagoLogo } from './TaPagoLogo';
import { VideoDemo } from './VideoDemo';
import { useState } from 'react';
import sageLogo from 'figma:asset/8a57a7b55d205d0d635290bff7d65ffe0329f6b4.png';
import cegidLogo from 'figma:asset/866b8184b56b23c8f6956b42a3b45cc4e373b14c.png';
import salesforceLogo from 'figma:asset/bae3640b638082eef62ed8a1bee69bac83627a2a.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <TaPagoLogo size="md" variant="full" />
            
            <div className="flex items-center gap-3">
              {/* Botão de Teste WhatsApp */}
              <button
                onClick={() => {
                  // Adicionar parâmetro de teste na URL
                  window.location.href = window.location.origin + '?test=whatsapp';
                }}
                className="flex items-center gap-2 border-2 border-amber-500 text-amber-700 bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-100 hover:border-amber-600 transition-all duration-300 hover:scale-105"
              >
                <Bug className="w-4 h-4" />
                <span className="hidden sm:inline">Testar WhatsApp</span>
                <span className="sm:hidden">Teste</span>
              </button>

              <button
                onClick={onGetStarted}
                className="relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Entrar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        {/* Animated Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 mb-6 shadow-sm hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-emerald-600" fill="currentColor" />
                <span className="text-emerald-800 font-medium text-sm">Potenciado por Inteligência Artificial</span>
              </div>
              
              <h1 className="text-gray-900 mb-6 leading-tight">
                Cobranças<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                  Inteligentes
                </span>
                <br />
                para Portugal
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Emita faturas e automatize a recuperação de valores com um assistente de IA que dialoga com os seus clientes.
                Receba mais rápido, sem esforço manual.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onGetStarted}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Começar Gratuitamente
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                
                <button 
                  onClick={() => setIsDemoOpen(true)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                >
                  Ver a IA em ação
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Motor de IA incluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Sem cartão necessário</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="relative">
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 backdrop-blur-xl hover:shadow-3xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-500">Fatura</p>
                        <p className="text-gray-900">FAT-2024-001</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full">
                      <span className="text-emerald-700">Paga</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Cliente</span>
                      <span className="text-gray-900">Tech Solutions SA</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Data</span>
                      <span className="text-gray-900">03/12/2024</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Vencimento</span>
                      <span className="text-gray-900">03/01/2025</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>1.500,00 €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>IVA (23%)</span>
                      <span>345,00 €</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 p-4 rounded-xl">
                      <span className="text-gray-900">Total</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">1.845,00 €</span>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute -right-6 top-1/4 bg-white border border-gray-200 rounded-xl p-4 shadow-xl backdrop-blur-xl transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-600">+28%</p>
                      <p className="text-gray-600">Receita</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-1/4 bg-white border border-gray-200 rounded-xl p-4 shadow-xl backdrop-blur-xl transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-cyan-600">85%</p>
                      <p className="text-gray-600">Mais Rápido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Empresas Ativas', gradient: 'from-emerald-600 to-cyan-600' },
              { value: '50K+', label: 'Faturas Emitidas', gradient: 'from-cyan-600 to-blue-600' },
              { value: '2M€+', label: 'Processados', gradient: 'from-blue-600 to-purple-600' },
              { value: '4.9/5', label: 'Avaliação', gradient: 'from-purple-600 to-pink-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform">
                <p className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2`}>{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ações de IA - DESTAQUE */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header da Seção */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="text-white font-medium">Inteligência Artificial Avançada</span>
            </div>
            
            <h2 className="text-white mb-6 text-center">
              As 4 Ações Poderosas<br />
              da Nossa IA
            </h2>
            
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Um assistente completo que automatiza todo o processo de cobrança,
              desde o envio de mensagens até chamadas telefónicas com voz natural.
            </p>
          </div>

          {/* Grid de Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Ação 1: WhatsApp */}
            <div className="group relative bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 rounded-2xl transition-all duration-300" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/50">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-white text-xl mb-3">💬 WhatsApp Inteligente</h3>
                <p className="text-white/70 mb-4">
                  Envia mensagens personalizadas automaticamente, responde dúvidas dos clientes e negocia prazos de pagamento em tempo real.
                </p>
                
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Taxa de resposta: 89%</span>
                </div>
              </div>
            </div>

            {/* Ação 2: Email */}
            <div className="group relative bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/50">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-white text-xl mb-3">📧 Email Profissional</h3>
                <p className="text-white/70 mb-4">
                  Redige e envia emails formais com tom adequado ao perfil do cliente, incluindo faturas em anexo e links de pagamento direto.
                </p>
                
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Taxa de abertura: 76%</span>
                </div>
              </div>
            </div>

            {/* Ação 3: SMS */}
            <div className="group relative bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/50">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-white text-xl mb-3">📱 SMS Direto</h3>
                <p className="text-white/70 mb-4">
                  Lembretes curtos e objetivos para clientes que preferem comunicação rápida. Perfeito para urgências e confirmações.
                </p>
                
                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Taxa de leitura: 98%</span>
                </div>
              </div>
            </div>

            {/* Ação 4: VOZ - DESTAQUE ESPECIAL */}
            <div className="group relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border-2 border-orange-500/50 rounded-2xl p-8 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-[1.02]">
              {/* Badge de Destaque */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                🔥 EXCLUSIVO
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/50 animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-white text-xl mb-3 flex items-center gap-2">
                  🎙️ Chamadas com Voz IA
                  <Volume2 className="w-5 h-5 text-orange-400 animate-bounce" />
                </h3>
                <p className="text-white/90 mb-4">
                  <strong>Nossa grande inovação:</strong> A IA faz chamadas telefónicas reais com voz natural portuguesa,
                  conversa com clientes, esclarece dúvidas e até agenda pagamentos - tudo automaticamente!
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Voz 100% natural em português de Portugal</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Compreende e responde em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Taxa de conversão: 67% (a mais alta!)</span>
                  </div>
                </div>

                {/* CTA da Voz */}
                <div className="mt-6 pt-6 border-t border-orange-500/30">
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 group">
                    <Headphones className="w-5 h-5" />
                    <span>Ouvir Exemplo de Chamada</span>
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vídeo Explicativo - Ver a IA em Ação */}
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-white text-3xl mb-3">Ver a IA em Ação</h3>
              <p className="text-white/70 text-lg">
                Veja como a nossa IA trabalha para recuperar seus valores em menos de 2 minutos
              </p>
            </div>

            {/* Container do Vídeo */}
            <div className="relative max-w-5xl mx-auto">
              <div 
                onClick={() => setIsDemoOpen(true)}
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 hover:border-white/40 transition-all group cursor-pointer"
              >
                {/* Vídeo Embed (YouTube, Vimeo ou qualquer plataforma) */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                  {/* Thumbnail Placeholder */}
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMHZpZGVvfGVufDF8fHx8MTc2NDkyNDU5NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Vídeo explicativo da IA em ação"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay com Botão Play */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/30 transition-all">
                    <div className="relative">
                      {/* Efeito de Pulso */}
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                      
                      {/* Botão Play */}
                      <div className="relative bg-white/90 hover:bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all">
                        <Play className="w-10 h-10 text-emerald-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Badges de Recursos no Vídeo */}
                  <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                    <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      WhatsApp IA
                    </div>
                    <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Email Automático
                    </div>
                    <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      <Mic className="w-4 h-4 text-orange-400" />
                      Chamadas com Voz
                    </div>
                  </div>

                  {/* Duração do Vídeo */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    ⏱️ 1:47
                  </div>
                </div>

                {/* Descrição abaixo do vídeo */}
                <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-emerald-400 text-2xl font-bold mb-1">+73%</div>
                      <div className="text-white/70 text-sm">Taxa de Recuperação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 text-2xl font-bold mb-1">-85%</div>
                      <div className="text-white/70 text-sm">Tempo Manual</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 text-2xl font-bold mb-1">24/7</div>
                      <div className="text-white/70 text-sm">Funcionamento</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA abaixo do vídeo */}
              <div className="mt-8 text-center">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 text-lg font-medium"
                >
                  <Sparkles className="w-6 h-6" fill="currentColor" />
                  <span>Experimentar Gratuitamente</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-white/60 text-sm mt-4">
                  Comece hoje • Sem cartão de crédito • Cancele quando quiser
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Demo Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem profissional */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1758876018661-41b3c4012df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJ1c2luZXNzJTIwd29tYW4lMjBzbWFydHBob25lfGVufDF8fHx8MTc2NDkyNDU5NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Empresária feliz usando smartphone"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                
                {/* Chat bubble overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 shadow-2xl border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">IA Cobra+</p>
                      <p className="text-gray-600 text-sm">
                        Olá! Estamos a enviar um lembrete amigável sobre a fatura FAT-2024-001. Posso ajudar com algo?
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-xs text-gray-500">A escrever...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-purple-200 rounded-full px-4 py-2 mb-4">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Inteligência Artificial</span>
              </div>

              <h2 className="text-gray-900 mb-6">
                A IA que conversa com<br />
                os seus clientes
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Nossa assistente com IA envia lembretes personalizados, responde dúvidas e negoceia prazos - 
                tudo de forma empática e profissional, aumentando em <strong>73% a taxa de recuperação</strong>.
              </p>

              <div className="space-y-4">
                {[
                  { icon: MessageCircle, title: 'WhatsApp & Email Automático', desc: 'Mensagens personalizadas enviadas no momento certo', color: 'from-green-500 to-emerald-500' },
                  { icon: Brain, title: 'Contexto Inteligente', desc: 'A IA adapta o tom baseado no histórico do cliente', color: 'from-purple-500 to-pink-500' },
                  { icon: BarChart3, title: 'Melhoria Contínua', desc: 'Aprende com cada interação para otimizar resultados', color: 'from-blue-500 to-cyan-500' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard em ação */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-2 mb-4">
                <BarChart3 className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-700 font-medium text-sm">Analytics em Tempo Real</span>
              </div>

              <h2 className="text-gray-900 mb-6">
                Controle total do<br />
                seu cash flow
              </h2>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Dashboard intuitivo com métricas essenciais, gráficos interativos e alertas inteligentes.
                Saiba exatamente quanto vai receber e quando.
              </p>

              <div className="space-y-4">
                {[
                  { value: '€15.450', label: 'Total a Receber', change: '+12%', positive: true },
                  { value: '23', label: 'Faturas Pendentes', change: '-8%', positive: true },
                  { value: '94%', label: 'Taxa de Cobrança', change: '+5%', positive: true }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-gray-900 text-2xl font-semibold">{stat.value}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${stat.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1728917330520-9456e3f49529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5MjQ1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Dashboard moderno com analytics"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />

                {/* Notification overlay */}
                <div className="absolute top-6 right-6 bg-white rounded-xl p-4 shadow-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Pagamento Recebido!</p>
                      <p className="text-emerald-600 text-sm">€1.845,00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div>
            <h2 className="text-white mb-6">Pronto para automatizar suas cobranças?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de empresas portuguesas que já recuperam seus valores com IA
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Começar Gratuitamente</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                Falar com Vendas
              </button>
            </div>

            <p className="text-white/70 text-sm mt-6">
              Sem cartão de crédito • Configuração em 5 minutos • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Cobra+. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Vídeo */}
      <VideoDemo 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
}