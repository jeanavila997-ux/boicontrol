import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Fazenda, Produtor, Lote, Configuracoes, ItemLote } from '@/types';

interface AppContextType {
  fazendas: Fazenda[];
  produtores: Produtor[];
  lotes: Lote[];
  configuracoes: Configuracoes;
  addFazenda: (fazenda: Omit<Fazenda, 'id'>) => void;
  addProdutor: (produtor: Omit<Produtor, 'id'>) => void;
  addLote: (lote: Omit<Lote, 'id'>) => void;
  updateConfiguracoes: (config: Partial<Configuracoes>) => void;
  getLoteById: (id: string) => Lote | undefined;
  getFazendaById: (id: string) => Fazenda | undefined;
  getProdutorById: (id: string) => Produtor | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data inicial
const mockFazendas: Fazenda[] = [
  { id: '1', nome: 'Fazenda Santa Rita', observacoes: 'Fazenda principal' },
  { id: '2', nome: 'Fazenda Boa Vista', observacoes: 'Fazenda secundária' },
];

const mockProdutores: Produtor[] = [
  { id: '1', nome: 'João Silva', observacoes: 'Produtor parceiro há 5 anos' },
  { id: '2', nome: 'Maria Santos', observacoes: 'Produtora regional' },
];

const mockLotes: Lote[] = [
  {
    id: '1',
    data: '2025-11-10',
    fazendaId: '1',
    produtorId: '1',
    itens: [
      {
        id: '1',
        categoria: 'bezerro',
        quantidade: 10,
        pesoIndividual: 180,
        pesoTotal: 1800,
        valorPorAnimal: 2500,
        valorTotal: 25000,
        observacoes: 'Animais de boa qualidade'
      },
      {
        id: '2',
        categoria: 'bezerra',
        quantidade: 8,
        pesoIndividual: 160,
        pesoTotal: 1280,
        valorPorAnimal: 2200,
        valorTotal: 17600,
      }
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fazendas, setFazendas] = useState<Fazenda[]>(mockFazendas);
  const [produtores, setProdutores] = useState<Produtor[]>(mockProdutores);
  const [lotes, setLotes] = useState<Lote[]>(mockLotes);
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    kgPorArroba: 15,
    nomeFazendaPrincipal: 'Fazenda Santa Rita'
  });

  const addFazenda = (fazenda: Omit<Fazenda, 'id'>) => {
    const newFazenda: Fazenda = {
      ...fazenda,
      id: Date.now().toString()
    };
    setFazendas([...fazendas, newFazenda]);
  };

  const addProdutor = (produtor: Omit<Produtor, 'id'>) => {
    const newProdutor: Produtor = {
      ...produtor,
      id: Date.now().toString()
    };
    setProdutores([...produtores, newProdutor]);
  };

  const addLote = (lote: Omit<Lote, 'id'>) => {
    const newLote: Lote = {
      ...lote,
      id: Date.now().toString()
    };
    setLotes([newLote, ...lotes]);
  };

  const updateConfiguracoes = (config: Partial<Configuracoes>) => {
    setConfiguracoes({ ...configuracoes, ...config });
  };

  const getLoteById = (id: string) => lotes.find(l => l.id === id);
  const getFazendaById = (id: string) => fazendas.find(f => f.id === id);
  const getProdutorById = (id: string) => produtores.find(p => p.id === id);

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
