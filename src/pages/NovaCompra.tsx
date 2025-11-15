import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CategoryButton } from '@/components/CategoryButton';
import { useApp } from '@/contexts/AppContext';
import { AnimalCategory, ItemLote } from '@/types';
import { Baby, Beef, Rabbit, Beef as Vaca } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const categoryIcons = {
  bezerro: Baby,
  bezerra: Rabbit,
  vaca: Vaca,
  novilha: Rabbit,
  garrote: Beef,
  boi: Beef,
};

const categoryLabels = {
  bezerro: 'Bezerro (M)',
  bezerra: 'Bezerra (F)',
  vaca: 'Vaca',
  novilha: 'Novilha',
  garrote: 'Garrote',
  boi: 'Boi',
};

const NovaCompra = () => {
  const { fazendas, produtores, addLote } = useApp();
  const navigate = useNavigate();
  
  const [fazendaSelecionada, setFazendaSelecionada] = useState<string>('');
  const [produtorSelecionado, setProdutorSelecionado] = useState<string>('');
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<AnimalCategory | null>(null);
  const [itensLote, setItensLote] = useState<ItemLote[]>([]);
  
  // Form fields for item
  const [quantidade, setQuantidade] = useState<string>('');
  const [pesoIndividual, setPesoIndividual] = useState<string>('');
  const [pesoTotal, setPesoTotal] = useState<string>('');
  const [valorPorAnimal, setValorPorAnimal] = useState<string>('');
  const [valorTotal, setValorTotal] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  const handleCategoryClick = (category: AnimalCategory) => {
    setCategoriaSelecionada(category);
  };

  const resetItemForm = () => {
    setQuantidade('');
    setPesoIndividual('');
    setPesoTotal('');
    setValorPorAnimal('');
    setValorTotal('');
    setObservacoes('');
    setCategoriaSelecionada(null);
  };

  const handleAddItem = () => {
    if (!categoriaSelecionada || !quantidade) {
      toast.error('Preencha categoria e quantidade');
      return;
    }

    const qtd = parseInt(quantidade);
    const pesoInd = pesoIndividual ? parseFloat(pesoIndividual) : undefined;
    const pesoTot = pesoTotal ? parseFloat(pesoTotal) : (pesoInd ? pesoInd * qtd : undefined);
    const valorAnim = valorPorAnimal ? parseFloat(valorPorAnimal) : undefined;
    const valorTot = valorTotal ? parseFloat(valorTotal) : (valorAnim ? valorAnim * qtd : undefined);

    const novoItem: ItemLote = {
      id: Date.now().toString(),
      categoria: categoriaSelecionada,
      quantidade: qtd,
      pesoIndividual: pesoInd,
      pesoTotal: pesoTot,
      valorPorAnimal: valorAnim,
      valorTotal: valorTot,
      observacoes: observacoes || undefined,
    };

    setItensLote([...itensLote, novoItem]);
    resetItemForm();
    toast.success('Item adicionado ao lote');
  };

  const handleFecharLote = () => {
    if (!fazendaSelecionada || !produtorSelecionado || itensLote.length === 0) {
      toast.error('Preencha todos os campos e adicione pelo menos um item');
      return;
    }

    addLote({
      data,
      fazendaId: fazendaSelecionada,
      produtorId: produtorSelecionado,
      itens: itensLote,
    });

    toast.success('Lote fechado com sucesso!');
    navigate('/lotes');
  };

  const removeItem = (id: string) => {
    setItensLote(itensLote.filter(item => item.id !== id));
    toast.success('Item removido');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Nova Compra</h1>
        <p className="text-muted-foreground">Registre uma nova compra de gado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário Principal */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fazenda">Fazenda</Label>
                <Select value={fazendaSelecionada} onValueChange={setFazendaSelecionada}>
                  <SelectTrigger id="fazenda">
                    <SelectValue placeholder="Selecione a fazenda" />
                  </SelectTrigger>
                  <SelectContent>
                    {fazendas.map((fazenda) => (
                      <SelectItem key={fazenda.id} value={fazenda.id}>
                        {fazenda.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="produtor">Produtor</Label>
                <Select value={produtorSelecionado} onValueChange={setProdutorSelecionado}>
                  <SelectTrigger id="produtor">
                    <SelectValue placeholder="Selecione o produtor" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtores.map((produtor) => (
                      <SelectItem key={produtor.id} value={produtor.id}>
                        {produtor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selecione a Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(categoryIcons) as AnimalCategory[]).map((category) => (
                  <CategoryButton
                    key={category}
                    icon={categoryIcons[category]}
                    label={categoryLabels[category]}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Itens do Lote */}
        <div className="space-y-6">
          {itensLote.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itens do Lote ({itensLote.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Valor (R$)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itensLote.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {categoryLabels[item.categoria]}
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{item.pesoTotal?.toFixed(0) || '-'}</TableCell>
                        <TableCell>{item.valorTotal?.toLocaleString('pt-BR') || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleFecharLote}
            className="w-full"
            size="lg"
            disabled={itensLote.length === 0}
          >
            Fechar Lote ({itensLote.length} {itensLote.length === 1 ? 'item' : 'itens'})
          </Button>
        </div>
      </div>

      {/* Dialog para adicionar item */}
      <Dialog open={categoriaSelecionada !== null} onOpenChange={(open) => !open && resetItemForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Adicionar {categoriaSelecionada && categoryLabels[categoriaSelecionada]}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pesoIndividual">Peso Individual (kg)</Label>
                <Input
                  id="pesoIndividual"
                  type="number"
                  value={pesoIndividual}
                  onChange={(e) => setPesoIndividual(e.target.value)}
                  placeholder="Ex: 180"
                />
              </div>
              <div>
                <Label htmlFor="pesoTotal">OU Peso Total (kg)</Label>
                <Input
                  id="pesoTotal"
                  type="number"
                  value={pesoTotal}
                  onChange={(e) => setPesoTotal(e.target.value)}
                  placeholder="Ex: 1800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorPorAnimal">Valor por Animal (R$)</Label>
                <Input
                  id="valorPorAnimal"
                  type="number"
                  value={valorPorAnimal}
                  onChange={(e) => setValorPorAnimal(e.target.value)}
                  placeholder="Ex: 2500"
                />
              </div>
              <div>
                <Label htmlFor="valorTotal">OU Valor Total (R$)</Label>
                <Input
                  id="valorTotal"
                  type="number"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  placeholder="Ex: 25000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="flex-1">
                Adicionar ao Lote
              </Button>
              <Button onClick={resetItemForm} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NovaCompra;
