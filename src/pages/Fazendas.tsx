import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel } from '@/utils/export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Fazendas = () => {
  const { fazendas, addFazenda } = useApp();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      toast.error('Nome é obrigatório');
      return;
    }

    addFazenda({ nome, observacoes });
    toast.success('Fazenda adicionada com sucesso');
    setNome('');
    setObservacoes('');
    setOpen(false);
  };

  const handleExportCSV = () => {
    try {
      const dataToExport = fazendas.map(fazenda => ({
        'ID': fazenda.id,
        'Nome': fazenda.nome,
        'Observações': fazenda.observacoes || '-',
      }));
      
      exportToCSV('fazendas', dataToExport);
      toast.success('Arquivo CSV gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = fazendas.map(fazenda => ({
        'ID': fazenda.id,
        'Nome': fazenda.nome,
        'Observações': fazenda.observacoes || '-',
      }));
      
      exportToExcel('fazendas', 'Fazendas', dataToExport);
      toast.success('Arquivo Excel gerado com sucesso!');
    } catch (error) {
      toast.error('Não foi possível gerar o arquivo. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Fazendas</h1>
          <p className="text-muted-foreground">Gerencie as fazendas cadastradas</p>
        </div>
        
        <div className="flex gap-2">
          {fazendas.length > 0 && (
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
              Nova Fazenda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Fazenda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome da fazenda"
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
                Adicionar Fazenda
              </Button>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {fazendas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fazendas.map((fazenda) => (
            <Card key={fazenda.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{fazenda.nome}</h3>
                    {fazenda.observacoes && (
                      <p className="text-sm text-muted-foreground">{fazenda.observacoes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma fazenda cadastrada</p>
        </div>
      )}
    </div>
  );
};

export default Fazendas;
