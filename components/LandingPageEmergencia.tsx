import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPageEmergencia({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <div className="text-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Tá Pago</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">.pt</span>
              </div>
            </div>
            
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Entrar
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-800 text-sm">Potenciado por Inteligência Artificial</span>
            </div>
            
            <h1 className="text-6xl text-gray-900 mb-6">
              Cobranças<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
                Inteligentes
              </span>
              <br />
              para Portugal
            </h1>
            
            <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
              Emita faturas e automatize a recuperação de valores com um assistente de IA que dialoga com os seus clientes.
            </p>
            
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <span className="flex items-center gap-2">
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Automação Total</h3>
              <p className="text-gray-600">
                IA conversa com clientes automaticamente via WhatsApp
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Seguro e Confiável</h3>
              <p className="text-gray-600">
                Dados protegidos e conformidade com RGPD
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Mais Receita</h3>
              <p className="text-gray-600">
                Recupere valores em atraso de forma eficiente
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
