import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Weight, DollarSign, ChevronRight } from 'lucide-react';
import { Lote } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface LoteCardProps {
  lote: Lote;
}

export const LoteCard = ({ lote }: LoteCardProps) => {
  const { getFazendaById, getProdutorById } = useApp();
  const navigate = useNavigate();
  
  const fazenda = getFazendaById(lote.fazendaId);
  const produtor = getProdutorById(lote.produtorId);
  
  const quantidadeTotal = lote.itens.length;
  const pesoTotal = lote.itens.reduce((acc, item) => acc + item.peso, 0);
  const valorTotal = lote.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0);

  return (
    <Card className="border-2 hover:shadow-lg transition-all hover:border-primary">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(lote.data).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{fazenda?.nome}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{produtor?.nome}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Animais</p>
              <p className="text-lg font-bold text-foreground">{quantidadeTotal}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peso Total</p>
              <p className="text-lg font-bold text-foreground">{pesoTotal} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="text-lg font-bold text-success">
                R$ {valorTotal.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <Button 
            onClick={() => navigate(`/lotes/${lote.id}`)}
            className="w-full mt-4"
            variant="outline"
          >
            Ver Detalhes
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
