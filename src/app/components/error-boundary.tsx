import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <Card className="max-w-2xl w-full border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-6 h-6" />
                Erro ao Carregar Componente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-600">
                Ocorreu um erro ao tentar renderizar esta página.
              </p>
              
              {this.state.error && (
                <div className="bg-white p-4 rounded border border-red-200">
                  <p className="text-sm font-semibold mb-2">Detalhes do erro:</p>
                  <pre className="text-xs text-gray-700 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recarregar Página
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Tentar Novamente
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                <p className="text-sm font-semibold mb-2">💡 Dica:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Abra o Console (F12) para ver mais detalhes</li>
                  <li>Verifique se todos os componentes estão importados corretamente</li>
                  <li>Verifique se o backend está rodando (se necessário)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
