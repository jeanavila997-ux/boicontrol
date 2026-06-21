import { SEO } from '@/components/SEO';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, User, FileSpreadsheet, Download, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel } from '@/utils/export';
import { Produtor } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Produtores = () => {
  const { produtores, addProdutor, updateProdutor } = useApp();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [produtorEditando, setProdutorEditando] = useState<Produtor | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      toast.error('Nome é obrigatório');
      return;
    }

    addProdutor({ nome, observacoes });
    toast.success('Produtor adicionado com sucesso');
    setNome('');
    setObservacoes('');
    setOpen(false);
  };
  
  const handleEdit = (produtor: Produtor) => {
    setProdutorEditando(produtor);
    setNome(produtor.nome);
    setObservacoes(produtor.observacoes || '');
    setOpenEdit(true);
  };
  
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtorEditando) return;
    
    if (!nome) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    updateProdutor({
      ...produtorEditando,
      nome,
      observacoes: observacoes || undefined,
    });
    
    toast.success('Produtor atualizado com sucesso');
    setNome('');
    setObservacoes('');
    setProdutorEditando(null);
    setOpenEdit(false);
  };

  const handleExportCSV = () => {
    try {
      const dataToExport = produtores.map(produtor => ({
        'ID': produtor.id,
        'Nome': produtor.nome,
        'Observações': produtor.observacoes || '-',
      }));
      
      exportToCSV('produtores', dataToExport);
      toast.success('Arquivo CSV gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = produtores.map(produtor => ({
        'ID': produtor.id,
        'Nome': produtor.nome,
        'Observações': produtor.observacoes || '-',
      }));
      
      exportToExcel('produtores', 'Produtores', dataToExport);
      toast.success('Arquivo Excel gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO title="Produtores | BoiControl" description="Cadastro e gestão dos produtores parceiros nas operações de compra de gado." path="/produtores" />
            <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Produtores</h1>
          <p className="text-muted-foreground">Gerencie os produtores de gado</p>
        </div>
        
        <div className="flex gap-2">
          {produtores.length > 0 && (
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produtor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produtor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do produtor"
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações adicionais"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Adicionar Produtor
              </Button>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {produtores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtores.map((produtor) => (
            <Card key={produtor.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{produtor.nome}</h3>
                    {produtor.observacoes && (
                      <p className="text-sm text-muted-foreground">{produtor.observacoes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum produtor cadastrado</p>
        </div>
      )}
    </div>
  );
};

export default Produtores;
