import { Component, ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SearchErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🔴 Erro na busca de leads:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <Card className="max-w-2xl w-full border-2 border-red-200">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Erro na Busca de Leads
              </h2>
              
              <p className="text-gray-600 mb-6">
                Ocorreu um erro ao carregar o módulo de busca. Detalhes:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <code className="text-sm text-red-600 break-all">
                  {this.state.error?.message || 'Erro desconhecido'}
                </code>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-6">
                Se o problema persistir, entre em contato com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
