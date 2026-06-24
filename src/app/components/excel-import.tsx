import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ExcelImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Valida se é Excel
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        toast.error('❌ Formato inválido', {
          description: 'Por favor, envie um arquivo Excel (.xlsx, .xls) ou CSV'
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      toast.success('📄 Arquivo selecionado', {
        description: selectedFile.name
      });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Selecione um arquivo primeiro');
      return;
    }

    setImporting(true);
    
    try {
      // Lê o arquivo como texto/binary
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = e.target?.result;
        
        if (!data) {
          toast.error('Erro ao ler arquivo');
          setImporting(false);
          return;
        }

        // Converte para Base64 para enviar ao backend
        const base64 = btoa(
          new Uint8Array(data as ArrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Envia para o backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-v2/leads/import-excel`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              filename: file.name,
              data: base64,
              fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setResult(result);
          toast.success('✅ Importação concluída!', {
            description: `${result.imported} leads importados com sucesso`
          });
        } else {
          toast.error('❌ Erro na importação', {
            description: result.error || 'Verifique o formato do arquivo'
          });
        }
        
        setImporting(false);
      };

      reader.readAsArrayBuffer(file);
      
    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast.error('❌ Erro na importação', {
        description: error.message
      });
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Cria um CSV template
    const template = `nome,email,telefone,empresa,cargo,cidade,pais,linkedin,notas
João Silva,joao@exemplo.com,+351912345678,Tech Corp,CEO,Lisboa,Portugal,https://linkedin.com/in/joaosilva,Lead qualificado
Maria Santos,maria@exemplo.com,+351923456789,Real Estate SA,Diretora,Porto,Portugal,https://linkedin.com/in/mariasantos,Interessada em investimento`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-importacao-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('📥 Template baixado', {
      description: 'Preencha o arquivo e importe seus leads'
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Importar Base de Leads</h3>
          <p className="text-sm text-gray-600">
            Faça upload de arquivos Excel (.xlsx, .xls) ou CSV com sua base de contatos
          </p>
        </div>
      </div>

      {/* Template Download */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Não sabe como formatar seu arquivo?
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Baixe nosso template com o formato correto e campos recomendados
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadTemplate}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label
          htmlFor="excel-upload"
          className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
        >
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            {file ? (
              <>
                <p className="font-medium text-gray-900 mb-1">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • Clique para alterar
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900 mb-1">
                  Clique para selecionar arquivo
                </p>
                <p className="text-sm text-gray-500">
                  Formatos aceitos: Excel (.xlsx, .xls) ou CSV
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleImport}
          disabled={!file || importing}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {importing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Importar Leads
            </>
          )}
        </Button>
        
        {file && !importing && (
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            Cancelar
          </Button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900 mb-2">
                Importação concluída com sucesso!
              </p>
              <div className="space-y-1 text-sm text-green-800">
                <p>✅ <strong>{result.imported}</strong> leads importados</p>
                {result.duplicates > 0 && (
                  <p>⚠️ <strong>{result.duplicates}</strong> duplicados ignorados</p>
                )}
                {result.errors > 0 && (
                  <p>❌ <strong>{result.errors}</strong> registros com erro</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 mb-2 font-medium">
          💡 Dicas para importação bem-sucedida:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Certifique-se de que a primeira linha contém os cabeçalhos</li>
          <li>• Campos recomendados: nome, email, telefone, empresa, cargo</li>
          <li>• Emails duplicados serão automaticamente ignorados</li>
          <li>• Máximo de 1.000 leads por importação</li>
        </ul>
      </div>
    </Card>
  );
}
