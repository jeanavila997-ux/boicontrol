import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Offline = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <WifiOff className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Você está offline</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Parece que você perdeu a conexão com a internet. O BoiControl funciona offline,
          mas você precisa estar online para acessar esta página pela primeira vez.
        </p>
        <Button onClick={handleReload} size="lg">
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};

export default Offline;
