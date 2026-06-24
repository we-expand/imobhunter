import React from 'react';

// Error boundary para capturar erros
class SearchEngineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('❌ [SearchEngine Error]:', error);
    console.error('❌ [Error Info]:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
                Erro ao Carregar Motor de Busca
              </h2>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Ocorreu um erro ao carregar o componente de busca avançada.
              </p>
              <details className="text-left bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                <summary className="cursor-pointer font-semibold mb-2">
                  Detalhes do Erro (clique para expandir)
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-gray-100 dark:bg-slate-900 p-3 rounded">
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </details>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load do componente pesado
const AdvancedSearchEngineLazy = React.lazy(() => 
  import('./modern-lead-search').then(module => ({
    default: module.ModernLeadSearch
  }))
);

export function AdvancedSearchEngineWrapper() {
  return (
    <SearchEngineErrorBoundary>
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Carregando Motor de Busca de Leads...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Preparando busca inteligente com Apollo, PDL, Hunter, Redes Sociais e mais
              </p>
            </div>
          </div>
        }
      >
        <AdvancedSearchEngineLazy />
      </React.Suspense>
    </SearchEngineErrorBoundary>
  );
}