import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Fazenda, Produtor, Lote, Configuracoes, ItemLote } from '@/types';
import * as storage from '@/lib/storage';

interface AppContextType {
  fazendas: Fazenda[];
  produtores: Produtor[];
  lotes: Lote[];
  configuracoes: Configuracoes;
  addFazenda: (fazenda: Omit<Fazenda, 'id'>) => void;
  addProdutor: (produtor: Omit<Produtor, 'id'>) => void;
  addLote: (lote: Omit<Lote, 'id'>) => void;
  updateFazenda: (fazenda: Fazenda) => void;
  updateProdutor: (produtor: Produtor) => void;
  updateLote: (lote: Lote) => void;
  updateConfiguracoes: (config: Partial<Configuracoes>) => void;
  getLoteById: (id: string) => Lote | undefined;
  getFazendaById: (id: string) => Fazenda | undefined;
  getProdutorById: (id: string) => Produtor | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    kgPorArroba: 15,
    nomeFazendaPrincipal: 'Fazenda Santa Rita'
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados do IndexedDB ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        await storage.initDB();
        await storage.initializeMockData();
        
        const [loadedFazendas, loadedProdutores, loadedLotes, loadedConfig] = await Promise.all([
          storage.getAllFazendas(),
          storage.getAllProdutores(),
          storage.getAllLotes(),
          storage.getConfiguracoes()
        ]);

        setFazendas(loadedFazendas);
        setProdutores(loadedProdutores);
        setLotes(loadedLotes);
        setConfiguracoes(loadedConfig);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addFazenda = async (fazenda: Omit<Fazenda, 'id'>) => {
    const newFazenda: Fazenda = {
      ...fazenda,
      id: Date.now().toString()
    };
    await storage.addFazenda(newFazenda);
    setFazendas([...fazendas, newFazenda]);
  };

  const addProdutor = async (produtor: Omit<Produtor, 'id'>) => {
    const newProdutor: Produtor = {
      ...produtor,
      id: Date.now().toString()
    };
    await storage.addProdutor(newProdutor);
    setProdutores([...produtores, newProdutor]);
  };

  const addLote = async (lote: Omit<Lote, 'id'>) => {
    const newLote: Lote = {
      ...lote,
      id: Date.now().toString()
    };
    await storage.addLote(newLote);
    setLotes([newLote, ...lotes]);
  };

  const updateFazenda = async (fazenda: Fazenda) => {
    await storage.updateFazenda(fazenda);
    setFazendas(fazendas.map(f => f.id === fazenda.id ? fazenda : f));
  };

  const updateProdutor = async (produtor: Produtor) => {
    await storage.updateProdutor(produtor);
    setProdutores(produtores.map(p => p.id === produtor.id ? produtor : p));
  };

  const updateLote = async (lote: Lote) => {
    await storage.updateLote(lote);
    setLotes(lotes.map(l => l.id === lote.id ? lote : l));
  };

  const updateConfiguracoes = async (config: Partial<Configuracoes>) => {
    const newConfig = { ...configuracoes, ...config };
    await storage.saveConfiguracoes(newConfig);
    setConfiguracoes(newConfig);
  };

  const getLoteById = (id: string) => lotes.find(l => l.id === id);
  const getFazendaById = (id: string) => fazendas.find(f => f.id === id);
  const getProdutorById = (id: string) => produtores.find(p => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        fazendas,
        produtores,
        lotes,
        configuracoes,
        addFazenda,
        addProdutor,
        addLote,
        updateFazenda,
        updateProdutor,
        updateLote,
        updateConfiguracoes,
        getLoteById,
        getFazendaById,
        getProdutorById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
