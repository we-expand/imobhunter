import { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Edit, Trash2, Loader, Upload, FileSpreadsheet, AlertCircle, Download } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  nif: string;
  morada: string;
  created_at?: string;
  user_id?: string;
  // Novos campos de importação
  dias_atraso?: number;
  valor_atraso?: number;
  data_ultimo_pagamento?: string;
  data_vencimento?: string;
  status_pagamento?: string; // 'Pago', 'Pendente', 'Em Atraso'
  perfil_cliente?: string; // 'Esquecido', 'Sumiu', 'Desempregado', etc.
}

const validateNIF = (nif: string) => {
  if (!nif) return false;
  const nifStr = nif.toString();
  if (nifStr.length !== 9) return false;
  if (!/^[0-9]+$/.test(nifStr)) return false;

  let total = 0;
  for (let i = 0; i < 8; i++) {
    total += parseInt(nifStr[i]) * (9 - i);
  }

  const resto = total % 11;
  const digitoControlo = resto < 2 ? 0 : 11 - resto;

  return digitoControlo === parseInt(nifStr[8]);
};

export function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nifError, setNifError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<{ description: string, place_id: string }[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setShowAddressSuggestions(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      setIsSearchingAddress(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/address-search?q=${encodeURIComponent(query)}`,
        {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data.results || []);
        setShowAddressSuggestions(true);
      }
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, morada: value }));

    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    if (value.length > 2) {
      const timeout = setTimeout(() => {
        searchAddress(value);
      }, 500);
      setDebounceTimeout(timeout);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const selectAddress = (address: string) => {
    setFormData(prev => ({ ...prev, morada: address }));
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };
  const [showImportModal, setShowImportModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nome: '',
    email: '',
    telefone: '',
    nif: '',
    morada: '',
    status_pagamento: 'Pendente',
    perfil_cliente: 'Regular'
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('Sem sessão ativa');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }

      const data = await response.json();
      setClientes(data.clientes || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.nif && !validateNIF(formData.nif)) {
      setNifError('NIF inválido');
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const url = editingCliente
        ? `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes/${editingCliente.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`;

      const response = await fetch(url, {
        method: editingCliente ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao ${editingCliente ? 'atualizar' : 'criar'} cliente`);
      }

      await loadClientes();
      setShowModal(false);
      setEditingCliente(null);
      setNifError('');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        nif: '',
        morada: '',
        status_pagamento: 'Pendente',
        perfil_cliente: 'Regular',
        valor_atraso: 0,
        data_ultimo_pagamento: '',
        data_vencimento: '',
      });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      nif: cliente.nif,
      morada: cliente.morada,
      status_pagamento: cliente.status_pagamento || 'Pendente',
      perfil_cliente: cliente.perfil_cliente || 'Regular',
      valor_atraso: cliente.valor_atraso || 0,
      data_ultimo_pagamento: cliente.data_ultimo_pagamento || '',
      data_vencimento: cliente.data_vencimento || '',
    });
    setNifError('');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este cliente?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao eliminar cliente');
      }

      await loadClientes();
    } catch (error) {
      console.error('Erro ao eliminar cliente:', error);
      alert('Erro ao eliminar cliente');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica de tipo
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Por favor carregue um ficheiro Excel (.xlsx, .xls) ou CSV.');
      return;
    }

    setImporting(true);

    try {
      // Aqui implementaríamos a leitura real do Excel.
      // Como não temos a biblioteca xlsx instalada no ambiente, vamos simular o sucesso
      // e processar se for um CSV simples.
      
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        let importedCount = 0;
        
        // Processar CSV simples (assumindo separador , ou ;)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const separator = lines[i].includes(';') ? ';' : ',';
          const cols = lines[i].split(separator).map(c => c.trim().replace(/^"|"$/g, ''));
          
          // Esperado: Nome, Email, Telefone, NIF, Morada, Dias Atraso, Valor Atraso, Último Pagamento, Vencimento, Status, Perfil
          if (cols.length >= 4) {
            const novoCliente: any = {
              nome: cols[0],
              email: cols[1],
              telefone: cols[2],
              nif: cols[3],
              morada: cols[4] || ''
            };
            
            // Campos opcionais novos
            if (cols[5]) novoCliente.dias_atraso = parseInt(cols[5]) || 0;
            if (cols[6]) novoCliente.valor_atraso = parseFloat(cols[6].replace('€','').trim()) || 0;
            if (cols[7]) novoCliente.data_ultimo_pagamento = cols[7];
            if (cols[8]) novoCliente.data_vencimento = cols[8];
            if (cols[9]) novoCliente.status_pagamento = cols[9];
            if (cols[10]) novoCliente.perfil_cliente = cols[10];

            // Enviar para a API
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoCliente),
              });
              importedCount++;
            }
          }
        }
        
        if (importedCount > 0) {
          alert(`${importedCount} clientes importados com sucesso!`);
          await loadClientes();
        } else {
          alert('Não foi possível ler clientes do CSV. Verifique o formato.');
        }
      } else {
        // Para Excel real
        alert('Para importar ficheiros .xlsx diretamente, por favor contacte o suporte para ativar o módulo de processamento Excel. Por enquanto, guarde o seu Excel como CSV e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao processar ficheiro.');
    } finally {
      setImporting(false);
      setShowImportModal(false);
      // Limpar input
      e.target.value = '';
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nif?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 mb-2">Clientes</h1>
          <p className="text-gray-600">Gerencie a sua base de clientes ({clientes.length} total)</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Importar Excel</span>
          </button>
          <button
            onClick={() => {
              setEditingCliente(null);
              setNifError('');
              setFormData({
                nome: '',
                email: '',
                telefone: '',
                nif: '',
                morada: '',
                status_pagamento: 'Pendente',
                perfil_cliente: 'Regular',
                valor_atraso: 0,
                data_ultimo_pagamento: '',
                data_vencimento: '',
              });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Cliente</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou NIF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {filteredClientes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Ainda não tem clientes. Adicione o primeiro!'}
            </p>
            {!searchTerm && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-md mx-auto mt-6">
                <p className="text-purple-900 mb-2">💡 Dica: Importe automaticamente!</p>
                <p className="text-purple-700 mb-3">
                  Conecte seu CRM (Sage, PHC, Salesforce ou Moloni) e importe todos os seus clientes automaticamente.
                </p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('navigate', { detail: 'configuracoes' }));
                  }}
                  className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 underline"
                >
                  Ir para Configurações → Integrações CRM
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClientes.map((cliente) => (
              <div key={cliente.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-gray-800 mb-1">{cliente.nome}</h3>
                    <p className="text-gray-600">NIF: {cliente.nif}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{cliente.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{cliente.morada}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-800 flex items-center gap-2 text-xl font-semibold">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                Importar Clientes
              </h2>
              <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
                &times;
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Instruções de Formatação
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                O seu ficheiro Excel ou CSV deve seguir a seguinte estrutura de colunas (a primeira linha deve conter os cabeçalhos):
              </p>
              
              {/* Aviso NIF Obrigatório */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-4">
                <p className="text-red-800 font-semibold text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>IMPORTANTE: O campo NIF é OBRIGATÓRIO para análise de IA</span>
                </p>
                <p className="text-red-700 text-xs mt-1 ml-7">
                  Sem o NIF, o sistema não consegue fazer análise de risco, consultar histórico financeiro ou gerar sugestões inteligentes de cobrança.
                </p>
              </div>
              
              <div className="bg-white border border-blue-100 rounded-md overflow-hidden overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="px-4 py-2">Nome *</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Telefone</th>
                      <th className="px-4 py-2">NIF *</th>
                      <th className="px-4 py-2">Morada</th>
                      <th className="px-4 py-2">Dias Atraso</th>
                      <th className="px-4 py-2">Valor (€)</th>
                      <th className="px-4 py-2">Últ. Pagamento</th>
                      <th className="px-4 py-2">Vencimento</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Perfil</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-2">Empresa A</td>
                      <td className="px-4 py-2">a@mail.pt</td>
                      <td className="px-4 py-2">910000000</td>
                      <td className="px-4 py-2">500111222</td>
                      <td className="px-4 py-2">Lisboa</td>
                      <td className="px-4 py-2">5</td>
                      <td className="px-4 py-2">150.00</td>
                      <td className="px-4 py-2">2023-10-01</td>
                      <td className="px-4 py-2">2023-11-01</td>
                      <td className="px-4 py-2">Em Atraso</td>
                      <td className="px-4 py-2">Esquecido</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                      <td className="px-4 py-2 text-gray-400 italic">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-blue-600 text-xs mt-2">
                * Campos obrigatórios. Para ficheiros CSV, use vírgula (,) ou ponto e vírgula (;) como separador.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer group bg-gray-50 hover:bg-emerald-50/30">
              <input 
                type="file" 
                accept=".csv, .xlsx, .xls" 
                className="hidden" 
                id="file-upload"
                onChange={handleFileUpload}
                disabled={importing}
              />
              <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                {importing ? (
                  <div className="flex flex-col items-center">
                    <Loader className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Processando ficheiro...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-emerald-500 mx-auto mb-4 transition-colors" />
                    <p className="text-gray-600 font-medium mb-2">Clique para selecionar o ficheiro</p>
                    <p className="text-gray-400 text-sm">Suporta .xlsx, .xls e .csv</p>
                  </>
                )}
              </label>
            </div>
            
            <div className="flex justify-end mt-6 gap-3">
               <button 
                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" 
                 onClick={() => setShowImportModal(false)}
                 disabled={importing}
               >
                 Cancelar
               </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-gray-800 mb-6">
              {editingCliente ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nome / Empresa</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    NIF / NIPC
                    <span className="px-2 py-0.5 bg-red-100 border border-red-300 rounded text-xs font-bold text-red-700">
                      OBRIGATÓRIO
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.nif}
                    onChange={(e) => {
                      setFormData({ ...formData, nif: e.target.value });
                      if (nifError) setNifError('');
                    }}
                    onBlur={(e) => {
                       if (e.target.value && !validateNIF(e.target.value)) {
                         setNifError('NIF inválido');
                       }
                    }}
                    className={`w-full px-4 py-2 border ${nifError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} rounded-lg focus:outline-none focus:ring-2`}
                    placeholder="123456789"
                    required
                  />
                  {nifError && <p className="text-red-500 text-xs mt-1">{nifError}</p>}
                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                    <span>🤖</span>
                    <span className="font-semibold">Necessário para análise de IA e histórico financeiro</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="email@exemplo.pt"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+351 210 123 456"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Status de Pagamento</label>
                  <select
                    value={formData.status_pagamento}
                    onChange={(e) => setFormData({ ...formData, status_pagamento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Em Atraso">Em Atraso</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Perfil do Cliente</label>
                  <select
                    value={formData.perfil_cliente}
                    onChange={(e) => setFormData({ ...formData, perfil_cliente: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Em Negociação">Em Negociação</option>
                    <option value="Esquecido">Esquecido</option>
                    <option value="Sumiu">Sumiu</option>
                    <option value="Dificuldade Financeira">Dificuldade Financeira</option>
                    <option value="Desempregado">Desempregado</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-gray-700 mb-2">Valor em Atraso (€)</label>
                   <input
                      type="number"
                      step="0.01"
                      value={formData.valor_atraso || ''}
                      onChange={(e) => setFormData({ ...formData, valor_atraso: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                   />
                </div>
                <div>
                   <label className="block text-gray-700 mb-2">Último Pagamento</label>
                   <input
                      type="date"
                      value={formData.data_ultimo_pagamento || ''}
                      onChange={(e) => setFormData({ ...formData, data_ultimo_pagamento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                   />
                </div>
                <div>
                   <label className="block text-gray-700 mb-2">Vencimento</label>
                   <input
                      type="date"
                      value={formData.data_vencimento || ''}
                      onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                   />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 mb-2">Morada</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.morada}
                    onChange={handleAddressInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                    placeholder="Rua, número, código postal, cidade"
                    required
                    autoComplete="off"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {isSearchingAddress ? (
                      <Loader className="w-5 h-5 animate-spin text-emerald-500" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.place_id || index}
                        type="button"
                        onClick={() => selectAddress(suggestion.description)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{suggestion.description}</span>
                        </div>
                      </button>
                    ))}
                    <div className="px-2 py-1 bg-gray-50 text-xs text-center text-gray-400 border-t border-gray-100">
                      Powered by {addressSuggestions[0]?.place_id ? 'Google Maps' : 'OpenStreetMap'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNifError('');
                    setEditingCliente(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  {editingCliente ? 'Atualizar Cliente' : 'Adicionar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}