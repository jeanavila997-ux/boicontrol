export type AnimalCategory = 
  | 'bezerro'
  | 'bezerra'
  | 'vaca'
  | 'novilha'
  | 'garrote'
  | 'boi';

export type Raca = 
  | 'NELORE'
  | 'CRUZADOS'
  | 'ABERDEEN'
  | 'ANGUS'
  | 'SENEPOL'
  | 'OUTROS';

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
  raca?: Raca;
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
