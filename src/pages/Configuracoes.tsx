import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

const Configuracoes = () => {
  const { configuracoes, updateConfiguracoes } = useApp();
  const [kgPorArroba, setKgPorArroba] = useState(configuracoes.kgPorArroba.toString());
  const [nomeFazendaPrincipal, setNomeFazendaPrincipal] = useState(configuracoes.nomeFazendaPrincipal);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kg = parseFloat(kgPorArroba);
    if (isNaN(kg) || kg <= 0) {
      toast.error('Kg por arroba deve ser um número válido');
      return;
    }

    updateConfiguracoes({
      kgPorArroba: kg,
      nomeFazendaPrincipal,
    });

    toast.success('Configurações salvas com sucesso');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Ajuste as configurações básicas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="kgPorArroba">Kg por Arroba</Label>
              <Input
                id="kgPorArroba"
                type="number"
                step="0.1"
                value={kgPorArroba}
                onChange={(e) => setKgPorArroba(e.target.value)}
                placeholder="15"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Usado para calcular o peso em arrobas
              </p>
            </div>

            <div>
              <Label htmlFor="nomeFazenda">Nome da Fazenda Principal</Label>
              <Input
                id="nomeFazenda"
                value={nomeFazendaPrincipal}
                onChange={(e) => setNomeFazendaPrincipal(e.target.value)}
                placeholder="Nome da sua fazenda"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Nome da fazenda que aparecerá nos relatórios
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
