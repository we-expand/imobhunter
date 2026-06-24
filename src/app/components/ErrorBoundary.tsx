import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
            <div className="bg-red-50 p-6 border-b border-red-100 flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                Ops! Algo deu errado.
              </h2>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Ocorreu um erro ao carregar o Dashboard. Isso pode ter acontecido devido a dados corrompidos ou falha de renderização.
              </p>

              <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-700 mb-6 overflow-auto max-h-32">
                {this.state.error?.message || "Erro desconhecido"}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Limpar Dados e Recarregar
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Apenas Recarregar Página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
