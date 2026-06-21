import { SEO } from '@/components/SEO';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { ItemLote, Raca } from '@/types';
import { Trash2, Plus, CheckCircle, DollarSign, Lock, Unlock, Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const origemOptions = [
  'Leilão',
  'Fazenda Parceira',
  'Compra Direta',
  'Pasto x Pasto',
  'Outros'
];

const NovaCompra = () => {
  const { fazendas, produtores, addLote, addProdutor, updateLote } = useApp();
  const navigate = useNavigate();
  
  // Informações do Lote
  const [nomeLote, setNomeLote] = useState<string>('');
  const [fazendaSelecionada, setFazendaSelecionada] = useState<string>('');
  const [produtorSelecionado, setProdutorSelecionado] = useState<string>('');
  const [origem, setOrigem] = useState<string>('Compra Direta');
  const [origemOutros, setOrigemOutros] = useState<string>('');
  const [valorPorKgMacho, setValorPorKgMacho] = useState<string>('');
  const [valorPorKgFemea, setValorPorKgFemea] = useState<string>('');
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Precificação individual
  const [precificacaoIndividual, setPrecificacaoIndividual] = useState<boolean>(false);
  const [valorTotalIndividual, setValorTotalIndividual] = useState<string>('');
  
  // Travamento de preço
  const [precoTravado, setPrecoTravado] = useState<boolean>(false);
  
  // Terminal de Pesagem
  const [itensLote, setItensLote] = useState<ItemLote[]>([]);
  const [proximoId, setProximoId] = useState<number>(1);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [showAddProdutor, setShowAddProdutor] = useState<boolean>(false);
  
  // Edição de animal
  const [showEditAnimal, setShowEditAnimal] = useState<boolean>(false);
  const [animalEditando, setAnimalEditando] = useState<ItemLote | null>(null);
  
  // Campos do terminal
  const [idAnimal, setIdAnimal] = useState<string>('1');
  const [sexo, setSexo] = useState<'macho' | 'femea'>('macho');
  const [raca, setRaca] = useState<Raca>('NELORE');
  const [peso, setPeso] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  
  // Novo produtor
  const [novoNomeProdutor, setNovoNomeProdutor] = useState<string>('');
  const [novoObsProdutor, setNovoObsProdutor] = useState<string>('');
  
  // Refs para navegação por teclado
  const idRef = useRef<HTMLInputElement>(null);
  const sexoRef = useRef<HTMLButtonElement>(null);
  const racaRef = useRef<HTMLButtonElement>(null);
  const pesoRef = useRef<HTMLInputElement>(null);
  
  // Manter última raça e sexo selecionados
  const [ultimaRaca, setUltimaRaca] = useState<Raca>('NELORE');
  const [ultimoSexo, setUltimoSexo] = useState<'macho' | 'femea'>('macho');
  
  useEffect(() => {
    setRaca(ultimaRaca);
    setSexo(ultimoSexo);
  }, [proximoId]);
  
  // Atalhos de teclado M/F
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showTerminal && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'm') {
          setSexo('macho');
          setUltimoSexo('macho');
        } else if (e.key.toLowerCase() === 'f') {
          setSexo('femea');
          setUltimoSexo('femea');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTerminal]);
  
  const handleAddAnimal = () => {
    if (!idAnimal || !peso) {
      toast.error('Preencha ID e Peso do animal');
      return;
    }
    
    // Validação condicional baseada no tipo de precificação
    if (precificacaoIndividual) {
      if (!valorTotalIndividual) {
        toast.error('Informe o valor total do animal');
        return;
      }
    } else {
      if (!valorPorKgMacho || !valorPorKgFemea) {
        toast.error('Configure os valores por kg antes de adicionar animais');
        return;
      }
    }
    
    const pesoNum = parseFloat(peso);
    
    // Calcular valor total baseado no tipo de precificação
    let valorTotal: number;
    if (precificacaoIndividual) {
      valorTotal = parseFloat(valorTotalIndividual);
    } else {
      const valorPorKg = sexo === 'macho' ? parseFloat(valorPorKgMacho) : parseFloat(valorPorKgFemea);
      valorTotal = pesoNum * valorPorKg;
    }
    
    const novoItem: ItemLote = {
      id: Date.now().toString(),
      idAnimal: parseInt(idAnimal),
      sexo,
      categoria: sexo === 'macho' ? 'garrote' : 'novilha',
      raca,
      peso: pesoNum,
      valorTotal,
      observacoes: observacoes || undefined,
    };
    
    setItensLote([...itensLote, novoItem]);
    
    // Salvar últimas seleções
    setUltimaRaca(raca);
    setUltimoSexo(sexo);
    
    // Resetar terminal e avançar ID
    setProximoId(proximoId + 1);
    setIdAnimal((proximoId + 1).toString());
    setPeso('');
    setObservacoes('');
    setValorTotalIndividual(''); // Limpar valor individual para próximo animal
    
    toast.success('Animal registrado!');
    
    // Focar no campo de peso para próximo animal
    setTimeout(() => pesoRef.current?.focus(), 100);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
        nextRef.current.click?.();
      } else {
        handleAddAnimal();
      }
    }
  };
  
  const handleFecharLote = async () => {
    if (!nomeLote) {
      toast.error('Informe o nome/número do lote');
      return;
    }
    
    if (!fazendaSelecionada) {
      toast.error('Selecione a fazenda compradora');
      return;
    }
    
    if (!produtorSelecionado) {
      toast.error('Selecione o vendedor');
      return;
    }
    
    if (itensLote.length === 0) {
      toast.error('Adicione pelo menos um animal ao lote');
      return;
    }
    
    if (!valorPorKgMacho || !valorPorKgFemea) {
      toast.error('Configure os valores por kg');
      return;
    }
    
    const origemFinal = origem === 'Outros' ? origemOutros : origem;
    
    await addLote({
      data,
      nomeLote,
      fazendaId: fazendaSelecionada,
      produtorId: produtorSelecionado,
      origem: origemFinal,
      valorPorKgMacho: parseFloat(valorPorKgMacho),
      valorPorKgFemea: parseFloat(valorPorKgFemea),
      itens: itensLote,
    });
    
    toast.success('Lote fechado com sucesso!');
    navigate('/lotes');
  };
  
  const removeItem = (itemId: string) => {
    setItensLote(itensLote.filter(item => item.id !== itemId));
    toast.success('Animal removido');
  };
  
  const handleEditAnimal = (item: ItemLote) => {
    setAnimalEditando(item);
    setIdAnimal(item.idAnimal.toString());
    setSexo(item.sexo);
    setRaca(item.raca || 'NELORE');
    setPeso(item.peso.toString());
    setObservacoes(item.observacoes || '');
    // Carregar valor total existente para permitir edição
    setValorTotalIndividual(item.valorTotal.toString());
    setShowEditAnimal(true);
  };
  
  const handleSaveEditAnimal = () => {
    if (!animalEditando) return;
    
    if (!peso || !idAnimal) {
      toast.error('Preencha ID e Peso do animal');
      return;
    }
    
    const pesoNum = parseFloat(peso);
    
    // Para edição, verificar se tem valor individual ou calcular por kg
    let valorTotalCalc: number;
    if (valorTotalIndividual) {
      valorTotalCalc = parseFloat(valorTotalIndividual);
    } else if (valorPorKgMacho && valorPorKgFemea) {
      const valorPorKg = sexo === 'macho' ? parseFloat(valorPorKgMacho) : parseFloat(valorPorKgFemea);
      valorTotalCalc = pesoNum * valorPorKg;
    } else {
      valorTotalCalc = animalEditando.valorTotal; // Manter valor original se não houver como calcular
    }
    
    const animalAtualizado: ItemLote = {
      ...animalEditando,
      idAnimal: parseInt(idAnimal),
      sexo,
      categoria: sexo === 'macho' ? 'garrote' : 'bezerra',
      raca,
      peso: pesoNum,
      valorTotal: valorTotalCalc,
      observacoes: observacoes || undefined,
    };
    
    setItensLote(itensLote.map(item => 
      item.id === animalEditando.id ? animalAtualizado : item
    ));
    
    toast.success('Animal atualizado!');
    setShowEditAnimal(false);
    setAnimalEditando(null);
    setPeso('');
    setObservacoes('');
  };
  
  const handleAddProdutor = async () => {
    if (!novoNomeProdutor) {
      toast.error('Informe o nome do produtor');
      return;
    }
    
    await addProdutor({
      nome: novoNomeProdutor,
      observacoes: novoObsProdutor || undefined,
    });
    
    toast.success('Produtor cadastrado!');
    setShowAddProdutor(false);
    setNovoNomeProdutor('');
    setNovoObsProdutor('');
  };
  
  const totalAnimais = itensLote.length;
  const totalPeso = itensLote.reduce((acc, item) => acc + item.peso, 0);
  const totalValor = itensLote.reduce((acc, item) => acc + item.valorTotal, 0);
  
  // Calcular estatísticas por categoria (sexo + raça)
  const getEstatisticasCategoria = () => {
    const animaisMesmaSexoRaca = itensLote.filter(
      item => item.sexo === sexo && item.raca === raca
    );
    
    const animaisMesmoSexo = itensLote.filter(item => item.sexo === sexo);
    
    if (animaisMesmaSexoRaca.length === 0 && animaisMesmoSexo.length === 0) {
      return null;
    }
    
    const pesoTotalSexoRaca = animaisMesmaSexoRaca.reduce((acc, item) => acc + item.peso, 0);
    const pesoMedioSexoRaca = animaisMesmaSexoRaca.length > 0 
      ? pesoTotalSexoRaca / animaisMesmaSexoRaca.length 
      : 0;
    
    const pesoTotalSexo = animaisMesmoSexo.reduce((acc, item) => acc + item.peso, 0);
    const pesoMedioSexo = animaisMesmoSexo.length > 0 
      ? pesoTotalSexo / animaisMesmoSexo.length 
      : 0;
    
    return {
      sexoRaca: {
        quantidade: animaisMesmaSexoRaca.length,
        pesoMedio: pesoMedioSexoRaca,
        pesoTotal: pesoTotalSexoRaca,
      },
      sexo: {
        quantidade: animaisMesmoSexo.length,
        pesoMedio: pesoMedioSexo,
        pesoTotal: pesoTotalSexo,
      }
    };
  };
  
  const estatisticasCategoria = getEstatisticasCategoria();
  
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <SEO title="Nova Compra de Gado | BoiControl" description="Registre uma nova compra de gado com terminal de pesagem individual, cálculo por kg ou por cabeça." path="/nova-compra" />
            <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Nova Compra</h1>
        <p className="text-muted-foreground">Terminal profissional de entrada de animais</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna Esquerda - Informações do Lote */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nomeLote">Nome/Número do Lote *</Label>
                <Input
                  id="nomeLote"
                  placeholder="Ex: Lote 01, Compra 15/11"
                  value={nomeLote}
                  onChange={(e) => setNomeLote(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fazenda">Fazenda Compradora *</Label>
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
                <Label htmlFor="produtor">Vendedor (Produtor Rural) *</Label>
                <div className="flex gap-2">
                  <Select value={produtorSelecionado} onValueChange={setProdutorSelecionado}>
                    <SelectTrigger id="produtor" className="flex-1">
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtores.map((produtor) => (
                        <SelectItem key={produtor.id} value={produtor.id}>
                          {produtor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Adicionar novo produtor"
                    onClick={() => setShowAddProdutor(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="origem">Origem do Gado *</Label>
                <Select value={origem} onValueChange={setOrigem}>
                  <SelectTrigger id="origem">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {origemOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {origem === 'Outros' && (
                  <Input
                    className="mt-2"
                    placeholder="Especifique a origem"
                    value={origemOutros}
                    onChange={(e) => setOrigemOutros(e.target.value)}
                  />
                )}
              </div>

              {/* Switch para precificação individual */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Precificação por Cabeça</Label>
                  <p className="text-sm text-muted-foreground">
                    {precificacaoIndividual 
                      ? 'Inserir valor total de cada animal manualmente' 
                      : 'Calcular valor automaticamente (peso × R$/kg)'}
                  </p>
                </div>
                <Switch
                  checked={precificacaoIndividual}
                  onCheckedChange={setPrecificacaoIndividual}
                />
              </div>

              {!precificacaoIndividual && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valorMacho">Valor por Kg (Macho) *</Label>
                      <Input
                        id="valorMacho"
                        type="number"
                        step="0.01"
                        placeholder="R$ 0,00"
                        value={valorPorKgMacho}
                        onChange={(e) => setValorPorKgMacho(e.target.value)}
                        disabled={precoTravado}
                        className={precoTravado ? 'bg-muted cursor-not-allowed' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="valorFemea">Valor por Kg (Fêmea) *</Label>
                      <Input
                        id="valorFemea"
                        type="number"
                        step="0.01"
                        placeholder="R$ 0,00"
                        value={valorPorKgFemea}
                        onChange={(e) => setValorPorKgFemea(e.target.value)}
                        disabled={precoTravado}
                        className={precoTravado ? 'bg-muted cursor-not-allowed' : ''}
                      />
                    </div>
                  </div>
                  
                  {/* Botão de travar preço */}
                  {(valorPorKgMacho || valorPorKgFemea) && (
                    <Button
                      type="button"
                      variant={precoTravado ? 'default' : 'outline'}
                      className={`w-full h-12 transition-all ${
                        precoTravado 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'border-dashed'
                      }`}
                      onClick={() => {
                        if (!precoTravado && (!valorPorKgMacho || !valorPorKgFemea)) {
                          toast.error('Preencha os valores por kg antes de travar');
                          return;
                        }
                        setPrecoTravado(!precoTravado);
                        toast.success(
                          precoTravado 
                            ? 'Preço destravado - pode editar os valores' 
                            : `Preço travado: M R$${valorPorKgMacho}/kg | F R$${valorPorKgFemea}/kg`
                        );
                      }}
                    >
                      {precoTravado ? (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Preço Travado: M R${valorPorKgMacho}/kg | F R${valorPorKgFemea}/kg
                          <Pencil className="ml-2 h-4 w-4 opacity-70" />
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-5 w-5" />
                          Clique para Travar Preço
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="data">Data da Compra *</Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={() => setShowTerminal(true)}
            disabled={!precificacaoIndividual && (!valorPorKgMacho || !valorPorKgFemea)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Abrir Terminal de Pesagem
          </Button>
        </div>

        {/* Coluna Direita - Itens do Lote */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Animais Registrados ({totalAnimais})</CardTitle>
            </CardHeader>
            <CardContent>
              {itensLote.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum animal registrado ainda.</p>
                  <p className="text-sm mt-2">Abra o terminal de pesagem para começar.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border max-h-[400px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sexo</TableHead>
                          <TableHead>Raça</TableHead>
                          <TableHead>Peso (kg)</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead className="w-20"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itensLote.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.idAnimal}</TableCell>
                            <TableCell>
                              <span className={item.sexo === 'macho' ? 'text-blue-600' : 'text-pink-600'}>
                                {item.sexo === 'macho' ? 'M' : 'F'}
                              </span>
                            </TableCell>
                            <TableCell>{item.raca}</TableCell>
                            <TableCell>{item.peso.toFixed(0)}</TableCell>
                            <TableCell>R$ {item.valorTotal.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditAnimal(item)}
                                title="Editar animal"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                title="Excluir animal"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de Animais:</span>
                      <span className="font-semibold">{totalAnimais}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Peso Total:</span>
                      <span className="font-semibold">{totalPeso.toFixed(0)} kg</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Valor Total:</span>
                      <span className="font-bold text-primary">R$ {totalValor.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-4 h-14 text-lg"
                    onClick={handleFecharLote}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Fechar Lote ({totalAnimais} animais)
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Terminal de Pesagem */}
      <Dialog open={showTerminal} onOpenChange={setShowTerminal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Terminal de Pesagem</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idAnimal" className="text-base">ID do Animal</Label>
                <Input
                  ref={idRef}
                  id="idAnimal"
                  type="number"
                  className="h-12 text-lg"
                  value={idAnimal}
                  onChange={(e) => setIdAnimal(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, sexoRef)}
                  autoFocus
                />
              </div>
              
              <div>
                <Label className="text-base">Sexo (M / F)</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    ref={sexoRef}
                    type="button"
                    variant={sexo === 'macho' ? 'default' : 'outline'}
                    className="h-12 text-lg"
                    onClick={() => {
                      setSexo('macho');
                      setUltimoSexo('macho');
                      racaRef.current?.focus();
                    }}
                    onKeyDown={(e) => handleKeyDown(e, racaRef)}
                  >
                    Macho
                  </Button>
                  <Button
                    type="button"
                    variant={sexo === 'femea' ? 'default' : 'outline'}
                    className="h-12 text-lg"
                    onClick={() => {
                      setSexo('femea');
                      setUltimoSexo('femea');
                      racaRef.current?.focus();
                    }}
                    onKeyDown={(e) => handleKeyDown(e, racaRef)}
                  >
                    Fêmea
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="raca" className="text-base">Raça</Label>
              <Select value={raca} onValueChange={(val: Raca) => {
                setRaca(val);
                setUltimaRaca(val);
                pesoRef.current?.focus();
              }}>
                <SelectTrigger ref={racaRef} id="raca" className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NELORE">Nelore</SelectItem>
                  <SelectItem value="CRUZADOS">Cruzados</SelectItem>
                  <SelectItem value="ABERDEEN">Aberdeen</SelectItem>
                  <SelectItem value="ANGUS">Angus</SelectItem>
                  <SelectItem value="SENEPOL">Senepol</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="peso" className="text-base">Peso (kg) *</Label>
              <Input
                ref={pesoRef}
                id="peso"
                type="number"
                step="0.1"
                className="h-12 text-lg"
                placeholder="Digite o peso e pressione ENTER"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                onKeyDown={(e) => {
                  if (precificacaoIndividual) {
                    handleKeyDown(e);
                  } else {
                    handleKeyDown(e);
                  }
                }}
              />
            </div>

            {precificacaoIndividual && (
              <div>
                <Label htmlFor="valorTotalIndividual" className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor Total do Animal *
                </Label>
                <Input
                  id="valorTotalIndividual"
                  type="number"
                  step="0.01"
                  className="h-12 text-lg"
                  placeholder="R$ 0,00 - Valor total por cabeça"
                  value={valorTotalIndividual}
                  onChange={(e) => setValorTotalIndividual(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Insira o valor negociado por cabeça
                </p>
              </div>
            )}

            {/* Estatísticas de peso médio por categoria */}
            {estatisticasCategoria && (
              <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                  Estatísticas da Pesagem
                </div>
                
                {estatisticasCategoria.sexoRaca.quantidade > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {sexo === 'macho' ? 'Machos' : 'Fêmeas'} {raca}:
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-primary">
                        {estatisticasCategoria.sexoRaca.pesoMedio.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        (média de {estatisticasCategoria.sexoRaca.quantidade})
                      </span>
                    </div>
                  </div>
                )}
                
                {estatisticasCategoria.sexo.quantidade > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Todos os {sexo === 'macho' ? 'Machos' : 'Fêmeas'}:
                    </span>
                    <div className="text-right">
                      <span className="font-semibold">
                        {estatisticasCategoria.sexo.pesoMedio.toFixed(1)} kg
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        (média de {estatisticasCategoria.sexo.quantidade})
                      </span>
                    </div>
                  </div>
                )}
                
                {itensLote.length > 0 && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Total Geral:</span>
                    <div className="text-right">
                      <span className="font-semibold">
                        {(totalPeso / totalAnimais).toFixed(1)} kg
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        (média de {totalAnimais})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="obs" className="text-base">Observações (opcional)</Label>
              <Textarea
                id="obs"
                className="text-base"
                placeholder="Observações sobre este animal..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg"
                onClick={handleAddAnimal}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Salvar e Próximo (ENTER)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14"
                onClick={() => setShowTerminal(false)}
              >
                Fechar
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              <p>Use ENTER para navegar entre os campos</p>
              <p>Teclas M e F para selecionar sexo rapidamente</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Animal */}
      <Dialog open={showEditAnimal} onOpenChange={setShowEditAnimal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Animal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editIdAnimal" className="text-base">ID do Animal</Label>
                <Input
                  id="editIdAnimal"
                  type="number"
                  className="h-12 text-lg"
                  value={idAnimal}
                  onChange={(e) => setIdAnimal(e.target.value)}
                />
              </div>
              
              <div>
                <Label className="text-base">Sexo</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={sexo === 'macho' ? 'default' : 'outline'}
                    className="h-12 text-lg"
                    onClick={() => setSexo('macho')}
                  >
                    Macho
                  </Button>
                  <Button
                    type="button"
                    variant={sexo === 'femea' ? 'default' : 'outline'}
                    className="h-12 text-lg"
                    onClick={() => setSexo('femea')}
                  >
                    Fêmea
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="editRaca" className="text-base">Raça</Label>
              <Select value={raca} onValueChange={(val: Raca) => setRaca(val)}>
                <SelectTrigger id="editRaca" className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NELORE">Nelore</SelectItem>
                  <SelectItem value="CRUZADOS">Cruzados</SelectItem>
                  <SelectItem value="ABERDEEN">Aberdeen</SelectItem>
                  <SelectItem value="ANGUS">Angus</SelectItem>
                  <SelectItem value="SENEPOL">Senepol</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editPeso" className="text-base">Peso (kg)</Label>
              <Input
                id="editPeso"
                type="number"
                step="0.1"
                className="h-12 text-lg"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="editValorTotal" className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Total do Animal
              </Label>
              <Input
                id="editValorTotal"
                type="number"
                step="0.01"
                className="h-12 text-lg"
                placeholder="Deixe vazio para calcular por kg"
                value={valorTotalIndividual}
                onChange={(e) => setValorTotalIndividual(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Preencha apenas se o valor foi negociado por cabeça
              </p>
            </div>

            <div>
              <Label htmlFor="editObs" className="text-base">Observações (opcional)</Label>
              <Textarea
                id="editObs"
                className="text-base"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditAnimal(false);
                  setAnimalEditando(null);
                  setPeso('');
                  setObservacoes('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEditAnimal}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Adicionar Produtor */}
      <Dialog open={showAddProdutor} onOpenChange={setShowAddProdutor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produtor</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="nomeProdutor">Nome do Produtor *</Label>
              <Input
                id="nomeProdutor"
                placeholder="Nome completo"
                value={novoNomeProdutor}
                onChange={(e) => setNovoNomeProdutor(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="obsProdutor">Observações</Label>
              <Textarea
                id="obsProdutor"
                placeholder="Informações adicionais..."
                value={novoObsProdutor}
                onChange={(e) => setNovoObsProdutor(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleAddProdutor}>
                Adicionar Produtor
              </Button>
              <Button variant="outline" onClick={() => setShowAddProdutor(false)}>
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
