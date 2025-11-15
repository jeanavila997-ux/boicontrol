import { useApp } from '@/contexts/AppContext';
import { LoteCard } from '@/components/LoteCard';
import { Package, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/export';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Lotes = () => {
  const { lotes, getFazendaById, getProdutorById } = useApp();
  const navigate = useNavigate();

  const handleExportCSV = () => {
    try {
      const dataToExport = lotes.map(lote => ({
        'ID': lote.id,
        'Data': new Date(lote.data).toLocaleDateString('pt-BR'),
        'Fazenda': getFazendaById(lote.fazendaId)?.nome || 'N/A',
        'Produtor': getProdutorById(lote.produtorId)?.nome || 'N/A',
        'Total Animais': lote.itens.reduce((acc, item) => acc + item.quantidade, 0),
        'Peso Total (kg)': lote.itens.reduce((acc, item) => acc + (item.pesoTotal || 0), 0).toFixed(0),
        'Valor Total': lote.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0).toFixed(2),
      }));
      
      exportToCSV('lotes', dataToExport);
      toast.success('Arquivo CSV gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = lotes.map(lote => ({
        'ID': lote.id,
        'Data': new Date(lote.data).toLocaleDateString('pt-BR'),
        'Fazenda': getFazendaById(lote.fazendaId)?.nome || 'N/A',
        'Produtor': getProdutorById(lote.produtorId)?.nome || 'N/A',
        'Total Animais': lote.itens.reduce((acc, item) => acc + item.quantidade, 0),
        'Peso Total (kg)': lote.itens.reduce((acc, item) => acc + (item.pesoTotal || 0), 0).toFixed(0),
        'Valor Total': lote.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0).toFixed(2),
      }));
      
      exportToExcel('lotes', 'Lotes', dataToExport);
      toast.success('Arquivo Excel gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    try {
      const dataToExport = lotes.map(lote => ({
        'ID': lote.id,
        'Data': new Date(lote.data).toLocaleDateString('pt-BR'),
        'Fazenda': getFazendaById(lote.fazendaId)?.nome || 'N/A',
        'Produtor': getProdutorById(lote.produtorId)?.nome || 'N/A',
        'Total Animais': lote.itens.reduce((acc, item) => acc + item.quantidade, 0),
        'Peso Total (kg)': lote.itens.reduce((acc, item) => acc + (item.pesoTotal || 0), 0).toFixed(0),
        'Valor Total': lote.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0).toFixed(2),
      }));
      
      exportToPDF('lotes', 'Relatório de Lotes', dataToExport);
      toast.success('Arquivo PDF gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lotes</h1>
          <p className="text-muted-foreground">Todos os lotes cadastrados</p>
        </div>
        
        {lotes.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {lotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote) => (
            <LoteCard key={lote.id} lote={lote} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Nenhum lote cadastrado ainda</p>
          <Button onClick={() => navigate('/nova-compra')}>
            Criar Primeiro Lote
          </Button>
        </div>
      )}
    </div>
  );
};

export default Lotes;
