import { useApp } from '@/contexts/AppContext';
import { LoteCard } from '@/components/LoteCard';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Lotes = () => {
  const { lotes } = useApp();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Lotes</h1>
        <p className="text-muted-foreground">Todos os lotes cadastrados</p>
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
