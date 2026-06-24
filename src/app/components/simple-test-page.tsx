// ═══════════════════════════════════════════════════════════════════════
// 🧪 SIMPLE TEST PAGE - Para debug de página em branco
// ═══════════════════════════════════════════════════════════════════════

import React from 'react';

interface SimpleTestPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export function SimpleTestPage({ onGetStarted, onLogin }: SimpleTestPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ImobHunter MVP
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Sistema de Lead Generation & Nurturing Autônomo para Imobiliário
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Busca automática de leads qualificados</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Automação multicanal (Email, SMS, WhatsApp)</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">IA para qualificação e nutrição de leads</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onGetStarted}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Começar Grátis
            </button>

            {onLogin && (
              <button
                onClick={onLogin}
                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Já tenho conta
              </button>
            )}
          </div>

          {/* Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistema operacional • Modo MVP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
