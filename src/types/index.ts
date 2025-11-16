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
  idAnimal: number;
  sexo: 'macho' | 'femea';
  categoria: AnimalCategory;
  raca?: Raca;
  peso: number;
  valorTotal: number;
  observacoes?: string;
}

export interface Lote {
  id: string;
  data: string;
  nomeLote: string;
  fazendaId: string;
  produtorId: string;
  origem: string;
  valorPorKgMacho: number;
  valorPorKgFemea: number;
  itens: ItemLote[];
}

export interface Configuracoes {
  kgPorArroba: number;
  nomeFazendaPrincipal: string;
}
