import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registrado');
    },
    onRegisterError(error) {
      console.log('Erro ao registrar Service Worker', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      console.log('App pronto para funcionar offline');
    }
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [offlineReady, needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            Nova versão disponível
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Uma atualização do BoiControl está pronta para ser instalada.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleUpdate} size="sm">
              Atualizar
            </Button>
            <Button onClick={handleClose} variant="outline" size="sm">
              Depois
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
