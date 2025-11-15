import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Fazenda, Produtor, Lote, Configuracoes } from '@/types';

interface BoiControlDB extends DBSchema {
  fazendas: {
    key: string;
    value: Fazenda;
  };
  produtores: {
    key: string;
    value: Produtor;
  };
  lotes: {
    key: string;
    value: Lote;
    indexes: { 'by-data': string };
  };
  configuracoes: {
    key: string;
    value: Configuracoes;
  };
}

const DB_NAME = 'boicontrol-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BoiControlDB>> | null = null;

export const initDB = async () => {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<BoiControlDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Criar object stores
      if (!db.objectStoreNames.contains('fazendas')) {
        db.createObjectStore('fazendas', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('produtores')) {
        db.createObjectStore('produtores', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('lotes')) {
        const loteStore = db.createObjectStore('lotes', { keyPath: 'id' });
        loteStore.createIndex('by-data', 'data');
      }
      
      if (!db.objectStoreNames.contains('configuracoes')) {
        db.createObjectStore('configuracoes');
      }
    },
  });

  return dbPromise;
};

// Fazendas
export const getAllFazendas = async (): Promise<Fazenda[]> => {
  const db = await initDB();
  return db.getAll('fazendas');
};

export const addFazenda = async (fazenda: Fazenda): Promise<void> => {
  const db = await initDB();
  await db.put('fazendas', fazenda);
};

export const getFazendaById = async (id: string): Promise<Fazenda | undefined> => {
  const db = await initDB();
  return db.get('fazendas', id);
};

// Produtores
export const getAllProdutores = async (): Promise<Produtor[]> => {
  const db = await initDB();
  return db.getAll('produtores');
};

export const addProdutor = async (produtor: Produtor): Promise<void> => {
  const db = await initDB();
  await db.put('produtores', produtor);
};

export const getProdutorById = async (id: string): Promise<Produtor | undefined> => {
  const db = await initDB();
  return db.get('produtores', id);
};

// Lotes
export const getAllLotes = async (): Promise<Lote[]> => {
  const db = await initDB();
  const lotes = await db.getAll('lotes');
  // Ordenar por data decrescente
  return lotes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
};

export const addLote = async (lote: Lote): Promise<void> => {
  const db = await initDB();
  await db.put('lotes', lote);
};

export const getLoteById = async (id: string): Promise<Lote | undefined> => {
  const db = await initDB();
  return db.get('lotes', id);
};

// Configurações
export const getConfiguracoes = async (): Promise<Configuracoes> => {
  const db = await initDB();
  const config = await db.get('configuracoes', 'main');
  return config || { kgPorArroba: 15, nomeFazendaPrincipal: 'Fazenda Santa Rita' };
};

export const saveConfiguracoes = async (config: Configuracoes): Promise<void> => {
  const db = await initDB();
  await db.put('configuracoes', config, 'main');
};

// Inicializar dados mock se não houver dados
export const initializeMockData = async () => {
  const fazendas = await getAllFazendas();
  const produtores = await getAllProdutores();
  const lotes = await getAllLotes();

  // Só adiciona dados mock se o banco estiver vazio
  if (fazendas.length === 0) {
    await addFazenda({ id: '1', nome: 'Fazenda Santa Rita', observacoes: 'Fazenda principal' });
    await addFazenda({ id: '2', nome: 'Fazenda Boa Vista', observacoes: 'Fazenda secundária' });
  }

  if (produtores.length === 0) {
    await addProdutor({ id: '1', nome: 'João Silva', observacoes: 'Produtor parceiro há 5 anos' });
    await addProdutor({ id: '2', nome: 'Maria Santos', observacoes: 'Produtora regional' });
  }

  if (lotes.length === 0) {
    await addLote({
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
    });
  }
};
