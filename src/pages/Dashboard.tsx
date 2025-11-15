import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { LoteCard } from '@/components/LoteCard';
import { Plus, Package, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { lotes } = useApp();
  const navigate = useNavigate();

  const totalLotes = lotes.length;
  const totalAnimais = lotes.reduce((acc, lote) => {
    return acc + lote.itens.reduce((sum, item) => sum + item.quantidade, 0);
  }, 0);

  const ultimosLotes = lotes.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas compras de gado</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total de Lotes"
          value={totalLotes}
          icon={Package}
          description="Lotes cadastrados no sistema"
        />
        <StatsCard
          title="Total de Animais"
          value={totalAnimais}
          icon={TrendingUp}
          description="Animais comprados"
        />
        <StatsCard
          title="Último Lote"
          value={ultimosLotes[0] ? new Date(ultimosLotes[0].data).toLocaleDateString('pt-BR') : '-'}
          icon={Calendar}
          description="Data da última compra"
        />
      </div>

      {/* Nova Compra Button */}
      <div className="mb-8">
        <Button
          onClick={() => navigate('/nova-compra')}
          size="lg"
          className="w-full md:w-auto text-lg h-16 px-8"
        >
          <Plus className="mr-2 h-6 w-6" />
          Nova Compra
        </Button>
      </div>

      {/* Últimos Lotes */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Últimos 5 Lotes</h2>
        {ultimosLotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ultimosLotes.map((lote) => (
              <LoteCard key={lote.id} lote={lote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum lote cadastrado ainda</p>
            <Button onClick={() => navigate('/nova-compra')} className="mt-4">
              Criar Primeiro Lote
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
