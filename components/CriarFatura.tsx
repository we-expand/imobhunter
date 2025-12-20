import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { Page } from '../App';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface CriarFaturaProps {
  onNavigate: (page: Page) => void;
}

interface LineItem {
  id: string;
  descricao: string;
  quantidade: number;
  precoUnitario: string;
  iva: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  nif: string;
}

export function CriarFatura({ onNavigate }: CriarFaturaProps) {
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', descricao: '', quantidade: 1, precoUnitario: '', iva: '23' },
  ]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [numeroFatura, setNumeroFatura] = useState('');
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [dataVencimento, setDataVencimento] = useState('');

  useEffect(() => {
    loadClientes();
    generateNumeroFatura();
    
    // Define vencimento padrão para 30 dias à frente
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 30);
    setDataVencimento(vencimento.toISOString().split('T')[0]);
  }, []);

  const loadClientes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClientes(data.clientes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const generateNumeroFatura = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const faturas = data.faturas || [];
        const nextNumber = faturas.length + 1;
        setNumeroFatura(`FAT-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`);
      }
    } catch (error) {
      console.error('Erro ao gerar número da fatura:', error);
      setNumeroFatura('FAT-2024-001');
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), descricao: '', quantidade: 1, precoUnitario: '', iva: '23' },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const preco = parseFloat(item.precoUnitario.replace(',', '.')) || 0;
      return sum + (item.quantidade * preco);
    }, 0);
  };

  const calculateIVA = () => {
    return items.reduce((sum, item) => {
      const preco = parseFloat(item.precoUnitario.replace(',', '.')) || 0;
      const iva = parseFloat(item.iva) || 0;
      return sum + (item.quantidade * preco * iva / 100);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCliente) {
      alert('Por favor, selecione um cliente');
      return;
    }

    if (items.some(item => !item.descricao || !item.precoUnitario)) {
      alert('Por favor, preencha todos os itens da fatura');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const subtotal = calculateSubtotal();
      const iva = calculateIVA();
      const total = calculateTotal();

      console.log('=== CRIAÇÃO DE FATURA - DEBUG ===');
      console.log('Items:', items);
      console.log('Subtotal calculado:', subtotal);
      console.log('IVA calculado:', iva);
      console.log('Total calculado:', total);

      const faturaData = {
        numero: numeroFatura,
        cliente_id: selectedCliente.id,
        cliente_nome: selectedCliente.nome,
        data: dataEmissao,
        vencimento: dataVencimento,
        subtotal: subtotal,
        iva: iva,
        valor: total,
        status: 'pending',
        items: items.map(item => ({
          descricao: item.descricao,
          quantidade: item.quantidade,
          precoUnitario: parseFloat(item.precoUnitario.replace(',', '.')),
          iva: parseFloat(item.iva),
        })),
      };

      console.log('Dados da fatura a enviar:', JSON.stringify(faturaData, null, 2));

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(faturaData),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao criar fatura');
      }

      const result = await response.json();
      console.log('Resposta do servidor:', result);

      alert('Fatura criada com sucesso!');
      onNavigate('faturas');
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      alert('Erro ao criar fatura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 mb-2">Criar Nova Fatura</h1>
          <p className="text-gray-600">Preencha os dados para emitir uma fatura</p>
        </div>
        
        <button
          onClick={() => onNavigate('faturas')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-gray-800 mb-4">Dados da Fatura</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nº Fatura</label>
                  <input
                    type="text"
                    value={numeroFatura}
                    onChange={(e) => setNumeroFatura(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Data de Emissão</label>
                  <input
                    type="date"
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Data de Vencimento</label>
                  <input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-gray-800 mb-4">Cliente</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Selecionar Cliente</label>
                  <select
                    value={selectedCliente?.id || ''}
                    onChange={(e) => {
                      const cliente = clientes.find(c => c.id === e.target.value);
                      setSelectedCliente(cliente || null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Escolha um cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCliente && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Cliente selecionado:</p>
                    <p className="text-gray-800">{selectedCliente.nome}</p>
                    <p className="text-gray-600">NIF: {selectedCliente.nif}</p>
                    <p className="text-gray-600">{selectedCliente.email}</p>
                  </div>
                )}

                {clientes.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">Não tem clientes cadastrados.</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('clientes')}
                      className="text-yellow-600 hover:underline mt-2"
                    >
                      Adicionar cliente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Itens da Fatura</h2>
              <button
                type="button"
                onClick={addItem}
                className="text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-5">
                    {index === 0 && <label className="block text-gray-700 mb-2">Descrição</label>}
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                      placeholder="Descrição do serviço/produto"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    {index === 0 && <label className="block text-gray-700 mb-2">Quantidade</label>}
                    <input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) => updateItem(item.id, 'quantidade', parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    {index === 0 && <label className="block text-gray-700 mb-2">Preço Unit. (€)</label>}
                    <input
                      type="text"
                      value={item.precoUnitario}
                      onChange={(e) => updateItem(item.id, 'precoUnitario', e.target.value)}
                      placeholder="0,00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    {index === 0 && <label className="block text-gray-700 mb-2">IVA (%)</label>}
                    <select
                      value={item.iva}
                      onChange={(e) => updateItem(item.id, 'iva', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="0">0%</option>
                      <option value="6">6%</option>
                      <option value="13">13%</option>
                      <option value="23">23%</option>
                    </select>
                  </div>
                  
                  <div className="col-span-1 flex items-end">
                    {index === 0 && <div className="h-9 mb-2"></div>}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>IVA:</span>
                <span>{calculateIVA().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-800 border-t border-gray-200 pt-3">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => onNavigate('faturas')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'A criar...' : 'Emitir Fatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}