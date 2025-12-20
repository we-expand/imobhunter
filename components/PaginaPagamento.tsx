import { CreditCard, Building2, Smartphone, QrCode, CheckCircle } from 'lucide-react';

export function PaginaPagamento() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-800 mb-2">Página de Pagamento</h1>
        <p className="text-gray-600">Exemplo de página de pagamento para os seus clientes</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2">Fatura Nº FAT-001</h2>
                <p>Empresa ABC, Lda</p>
              </div>
              <div className="text-right">
                <p className="mb-2">Total a Pagar</p>
                <h1>1.250,00 €</h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-gray-800 mb-4">Detalhes da Fatura</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Data de Emissão:</span>
                    <span className="text-gray-800">28/11/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data de Vencimento:</span>
                    <span className="text-gray-800">28/12/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NIF Cliente:</span>
                    <span className="text-gray-800">123456789</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-800 mb-4">Fornecedor</h3>
                <div className="space-y-1 text-gray-600">
                  <p className="text-gray-800">Minha Empresa, Lda</p>
                  <p>NIF: 500000000</p>
                  <p>geral@minhaempresa.pt</p>
                  <p>+351 210 000 000</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-gray-800 mb-4">Itens da Fatura</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-gray-600 px-4 py-3">Descrição</th>
                      <th className="text-left text-gray-600 px-4 py-3">Qtd</th>
                      <th className="text-left text-gray-600 px-4 py-3">Preço Unit.</th>
                      <th className="text-left text-gray-600 px-4 py-3">IVA</th>
                      <th className="text-right text-gray-600 px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 text-gray-800">Serviço de Consultoria</td>
                      <td className="px-4 py-3 text-gray-600">10</td>
                      <td className="px-4 py-3 text-gray-600">100,00 €</td>
                      <td className="px-4 py-3 text-gray-600">23%</td>
                      <td className="px-4 py-3 text-right text-gray-800">1.000,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>1.000,00 €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (23%):</span>
                  <span>230,00 €</span>
                </div>
                <div className="flex justify-between text-gray-800 border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>1.250,00 €</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-gray-800 mb-4">Escolha o Método de Pagamento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button className="border-2 border-blue-600 bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Transferência Bancária</span>
                  </div>
                  <p className="text-gray-600 text-left">IBAN: PT50 0000 0000 0000 0000 0000 0</p>
                </button>

                <button className="border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">MB WAY</span>
                  </div>
                  <p className="text-gray-600 text-left">Pagamento instantâneo via telemóvel</p>
                </button>

                <button className="border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Multibanco</span>
                  </div>
                  <p className="text-gray-600 text-left">Pague em qualquer terminal</p>
                </button>

                <button className="border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800">Cartão de Crédito</span>
                  </div>
                  <p className="text-gray-600 text-left">Visa, Mastercard, American Express</p>
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-800 mb-1">Pagamento Seguro</p>
                  <p className="text-green-700">Todos os seus dados estão protegidos e encriptados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              Tem alguma questão? Entre em contato: geral@minhaempresa.pt | +351 210 000 000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
