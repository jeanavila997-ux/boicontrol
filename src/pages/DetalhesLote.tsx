import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, User, FileText, Scale, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { exportCustomPDF } from '@/utils/export';

const categoryLabels = {
  bezerro: 'Bezerro (M)',
  bezerra: 'Bezerra (F)',
  vaca: 'Vaca',
  novilha: 'Novilha',
  garrote: 'Garrote',
  boi: 'Boi',
};

const DetalhesLote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLoteById, getFazendaById, getProdutorById, configuracoes } = useApp();

  const lote = id ? getLoteById(id) : undefined;

  if (!lote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Lote não encontrado</p>
      </div>
    );
  }

  const fazenda = getFazendaById(lote.fazendaId);
  const produtor = getProdutorById(lote.produtorId);

  const quantidadeTotal = lote.itens.reduce((acc, item) => acc + item.quantidade, 0);
  const pesoTotal = lote.itens.reduce((acc, item) => acc + (item.pesoTotal || 0), 0);
  const valorTotal = lote.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
  const pesoMedioPorAnimal = quantidadeTotal > 0 ? pesoTotal / quantidadeTotal : 0;
  const arrobas = pesoTotal / configuracoes.kgPorArroba;

  const handleGerarRelatorio = async () => {
    try {
      toast.loading('Gerando relatório PDF...');

      const infoSection = [
        { Campo: 'Data', Valor: new Date(lote.data).toLocaleDateString('pt-BR') },
        { Campo: 'Fazenda', Valor: fazenda?.nome || 'N/A' },
        { Campo: 'Produtor', Valor: produtor?.nome || 'N/A' },
        { Campo: 'Total de Animais', Valor: quantidadeTotal },
        { Campo: 'Peso Total (kg)', Valor: pesoTotal.toFixed(0) },
        { Campo: 'Arrobas', Valor: arrobas.toFixed(2) },
        { Campo: 'Valor Total (R$)', Valor: valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) },
      ];

      const itensSection = lote.itens.map((item) => ({
        Categoria: categoryLabels[item.categoria] || item.categoria,
        'Raça': item.raca || '-',
        Quantidade: item.quantidade,
        'Peso Individual (kg)': item.pesoIndividual || '-',
        'Peso Total (kg)': item.pesoTotal ? item.pesoTotal.toFixed(0) : '-',
        'Valor/Animal (R$)': item.valorPorAnimal ? item.valorPorAnimal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-',
        'Valor Total (R$)': item.valorTotal ? item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-',
        Observações: item.observacoes || '-',
      }));

      exportCustomPDF(
        `relatorio-lote-${lote.id}`,
        'Relatório de Compra de Gado',
        [
          { subtitle: 'Informações do Lote', data: infoSection, headers: ['Campo', 'Valor'] },
          { subtitle: 'Itens do Lote', data: itensSection },
        ]
      );

      toast.dismiss();
      toast.success('Relatório PDF baixado com sucesso!');
    } catch (error) {
      toast.dismiss();
      toast.error('Não foi possível gerar o PDF. Tente novamente.');
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => navigate('/lotes')}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Lotes
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{new Date(lote.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fazenda</p>
                  <p className="font-medium">{fazenda?.nome}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Produtor</p>
                  <p className="font-medium">{produtor?.nome}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Animais</p>
              <p className="text-2xl font-bold text-foreground">{quantidadeTotal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso Total</p>
              <p className="text-2xl font-bold text-foreground">{pesoTotal.toFixed(0)} kg</p>
              <p className="text-xs text-muted-foreground">{arrobas.toFixed(2)} arrobas</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso Médio/Animal</p>
              <p className="text-2xl font-bold text-foreground">{pesoMedioPorAnimal.toFixed(1)} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-success">R$ {valorTotal.toLocaleString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Lote</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Peso Individual</TableHead>
                <TableHead>Peso Total</TableHead>
                <TableHead>Valor/Animal</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lote.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {categoryLabels[item.categoria]}
                  </TableCell>
                  <TableCell>
                    {item.raca || '-'}
                  </TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    {item.pesoIndividual ? `${item.pesoIndividual} kg` : '-'}
                  </TableCell>
                  <TableCell>
                    {item.pesoTotal ? `${item.pesoTotal.toFixed(0)} kg` : '-'}
                  </TableCell>
                  <TableCell>
                    {item.valorPorAnimal ? `R$ ${item.valorPorAnimal.toLocaleString('pt-BR')}` : '-'}
                  </TableCell>
                  <TableCell className="font-medium text-success">
                    {item.valorTotal ? `R$ ${item.valorTotal.toLocaleString('pt-BR')}` : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.observacoes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={handleGerarRelatorio} size="lg">
          <FileText className="mr-2 h-5 w-5" />
          Gerar Relatório PDF
        </Button>
      </div>
    </div>
  );
};

export default DetalhesLote;
