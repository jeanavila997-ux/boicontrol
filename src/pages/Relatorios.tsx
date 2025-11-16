import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, FileSpreadsheet, Package, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel, exportMultipleSheetsToExcel } from '@/utils/export';

const Relatorios = () => {
  const { lotes, produtores, fazendas, getFazendaById, getProdutorById } = useApp();

  const handleExportAllCSV = () => {
    try {
      // Exportar Lotes
      const lotesData = lotes.map(lote => ({
        'ID': lote.id,
        'Nome Lote': lote.nomeLote || '-',
        'Data': new Date(lote.data).toLocaleDateString('pt-BR'),
        'Fazenda': getFazendaById(lote.fazendaId)?.nome || 'N/A',
        'Produtor': getProdutorById(lote.produtorId)?.nome || 'N/A',
        'Total Animais': lote.itens.length,
        'Peso Total (kg)': lote.itens.reduce((acc, item) => acc + item.peso, 0).toFixed(0),
        'Valor Total': lote.itens.reduce((acc, item) => acc + item.valorTotal, 0).toFixed(2),
      }));
      exportToCSV('lotes', lotesData);

      // Exportar Itens de Lote
      const itensData: any[] = [];
      lotes.forEach(lote => {
        lote.itens.forEach(item => {
          itensData.push({
            'Lote ID': lote.id,
            'ID Animal': item.idAnimal,
            'Sexo': item.sexo === 'macho' ? 'M' : 'F',
            'Data Lote': new Date(lote.data).toLocaleDateString('pt-BR'),
            'Categoria': item.categoria,
            'Raça': item.raca || '-',
            'Peso (kg)': item.peso.toFixed(0),
            'Valor Total': item.valorTotal.toFixed(2),
            'Observações': item.observacoes || '-',
          });
        });
      });
      exportToCSV('itens-lote', itensData);

      // Exportar Produtores
      const produtoresData = produtores.map(produtor => ({
        'ID': produtor.id,
        'Nome': produtor.nome,
        'Observações': produtor.observacoes || '-',
      }));
      exportToCSV('produtores', produtoresData);

      // Exportar Fazendas
      const fazendasData = fazendas.map(fazenda => ({
        'ID': fazenda.id,
        'Nome': fazenda.nome,
        'Observações': fazenda.observacoes || '-',
      }));
      exportToCSV('fazendas', fazendasData);

      toast.success('Todos os arquivos CSV foram gerados com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar os arquivos. Tente novamente.');
      console.error(error);
    }
  };

  const handleExportAllExcel = () => {
    try {
      // Preparar dados de Lotes
      const lotesData = lotes.map(lote => ({
        'ID': lote.id,
        'Nome Lote': lote.nomeLote || '-',
        'Data': new Date(lote.data).toLocaleDateString('pt-BR'),
        'Fazenda': getFazendaById(lote.fazendaId)?.nome || 'N/A',
        'Produtor': getProdutorById(lote.produtorId)?.nome || 'N/A',
        'Total Animais': lote.itens.length,
        'Peso Total (kg)': lote.itens.reduce((acc, item) => acc + item.peso, 0).toFixed(0),
        'Valor Total': lote.itens.reduce((acc, item) => acc + item.valorTotal, 0).toFixed(2),
      }));

      const itensData: any[] = [];
      lotes.forEach(lote => {
        lote.itens.forEach(item => {
          itensData.push({
            'Lote ID': lote.id,
            'ID Animal': item.idAnimal,
            'Sexo': item.sexo === 'macho' ? 'M' : 'F',
            'Data Lote': new Date(lote.data).toLocaleDateString('pt-BR'),
            'Categoria': item.categoria,
            'Raça': item.raca || '-',
            'Peso (kg)': item.peso.toFixed(0),
            'Valor Total': item.valorTotal.toFixed(2),
            'Observações': item.observacoes || '-',
          });
        });
      });

      // Preparar dados de Produtores
      const produtoresData = produtores.map(produtor => ({
        'ID': produtor.id,
        'Nome': produtor.nome,
        'Observações': produtor.observacoes || '-',
      }));

      // Preparar dados de Fazendas
      const fazendasData = fazendas.map(fazenda => ({
        'ID': fazenda.id,
        'Nome': fazenda.nome,
        'Observações': fazenda.observacoes || '-',
      }));

      // Exportar tudo em um único arquivo Excel com múltiplas sheets
      const sheets = [
        { name: 'Lotes', data: lotesData },
        { name: 'Itens de Lote', data: itensData },
        { name: 'Produtores', data: produtoresData },
        { name: 'Fazendas', data: fazendasData },
      ];

      exportMultipleSheetsToExcel('relatorio-completo', sheets);
      toast.success('Arquivo Excel com todas as informações foi gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  const totalAnimais = lotes.reduce((acc, lote) => 
    acc + lote.itens.reduce((sum, item) => sum + item.quantidade, 0), 0
  );

  const pesoTotal = lotes.reduce((acc, lote) => 
    acc + lote.itens.reduce((sum, item) => sum + (item.pesoTotal || 0), 0), 0
  );

  const valorTotal = lotes.reduce((acc, lote) => 
    acc + lote.itens.reduce((sum, item) => sum + (item.valorTotal || 0), 0), 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios</h1>
        <p className="text-muted-foreground">Exporte todos os dados do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimais}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pesoTotal.toFixed(0)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {valorTotal.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados Cadastrados</CardTitle>
            <CardDescription>Quantidade de registros no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Lotes</span>
              </div>
              <span className="font-bold">{lotes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Produtores</span>
              </div>
              <span className="font-bold">{produtores.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Fazendas</span>
              </div>
              <span className="font-bold">{fazendas.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exportar Tudo</CardTitle>
            <CardDescription>Baixe todos os dados em diferentes formatos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleExportAllCSV} className="w-full" variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar Tudo em CSV (Arquivos Separados)
            </Button>
            <Button onClick={handleExportAllExcel} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Exportar Tudo em Excel (Arquivo Único)
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              * A exportação em CSV gera um arquivo separado para cada entidade (Lotes, Itens, Produtores, Fazendas)
            </p>
            <p className="text-xs text-muted-foreground">
              * A exportação em Excel gera um único arquivo com múltiplas abas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Todas as exportações funcionam <strong>offline</strong></p>
            <p>✓ Os dados são obtidos diretamente do armazenamento local do navegador</p>
            <p>✓ Nenhuma conexão com internet é necessária</p>
            <p>✓ Os arquivos são gerados e baixados automaticamente no seu dispositivo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
