import { Button } from './ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Lead } from '../types';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ExportLeadsButtonProps {
  leads: Lead[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function ExportLeadsButton({ leads, variant = 'outline', size = 'default' }: ExportLeadsButtonProps) {
  
  const exportToCSV = () => {
    if (leads.length === 0) {
      toast.error('Sem leads para exportar');
      return;
    }

    // Cabeçalhos do CSV
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Empresa',
      'Cargo',
      'Cluster',
      'Status',
      'Score',
      'Último Contato',
      'Canal',
      'Notas'
    ];

    // Converte leads para linhas CSV
    const rows = leads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      lead.company || '',
      lead.jobTitle || '',
      lead.cluster || '',
      lead.status || '',
      lead.score || 0,
      lead.lastContact || '',
      lead.channel || '',
      (lead.notes || '').replace(/"/g, '""') // Escapa aspas duplas
    ]);

    // Monta CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Cria arquivo para download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`✅ ${leads.length} leads exportados!`, {
      description: `Arquivo: leads_${date}.csv`
    });
  };

  const exportToJSON = () => {
    if (leads.length === 0) {
      toast.error('Sem leads para exportar');
      return;
    }

    // Cria JSON formatado
    const jsonContent = JSON.stringify(leads, null, 2);

    // Cria arquivo para download
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${date}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`✅ ${leads.length} leads exportados!`, {
      description: `Arquivo: leads_${date}.json`
    });
  };

  const exportToExcel = () => {
    // Por enquanto, usa CSV (Excel lê CSV perfeitamente)
    exportToCSV();
    toast.info('💡 Dica: Abra o arquivo CSV no Excel', {
      description: 'O Excel reconhecerá automaticamente as colunas'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Leads
          {leads.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              {leads.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Formato de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
          <div className="flex-1">
            <p className="font-medium">CSV</p>
            <p className="text-xs text-gray-500">Para Excel, Google Sheets</p>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium">JSON</p>
            <p className="text-xs text-gray-500">Para integração técnica</p>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-orange-600" />
          <div className="flex-1">
            <p className="font-medium">Excel (CSV)</p>
            <p className="text-xs text-gray-500">Otimizado para Microsoft Excel</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <div className="px-2 py-2 text-xs text-gray-500">
          {leads.length === 0 ? (
            <span className="text-red-600">⚠️ Nenhum lead disponível</span>
          ) : (
            <>
              <p className="font-medium text-gray-700 mb-1">Inclui:</p>
              <ul className="space-y-0.5">
                <li>✓ Dados de contato completos</li>
                <li>✓ Status e score</li>
                <li>✓ Histórico de interações</li>
                <li>✓ Informações de empresa</li>
              </ul>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
