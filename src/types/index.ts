export type AnimalCategory = 
  | 'bezerro'
  | 'bezerra'
  | 'vaca'
  | 'novilha'
  | 'garrote'
  | 'boi';

export interface Fazenda {
  id: string;
  nome: string;
  observacoes?: string;
}

export interface Produtor {
  id: string;
  nome: string;
  observacoes?: string;
}

export interface ItemLote {
  id: string;
  categoria: AnimalCategory;
  quantidade: number;
  pesoIndividual?: number;
  pesoTotal?: number;
  valorPorAnimal?: number;
  valorTotal?: number;
  observacoes?: string;
}

export interface Lote {
  id: string;
  data: string;
  fazendaId: string;
  produtorId: string;
  itens: ItemLote[];
}

export interface Configuracoes {
  kgPorArroba: number;
  nomeFazendaPrincipal: string;
}
