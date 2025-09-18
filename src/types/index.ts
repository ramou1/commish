// src/types/index.ts
export interface FluxoComissao {
  id: string;
  deQuemReceber: string;
  valor: number;
  recorrencia: 'semanal' | 'mensal';
  dataInicio: Date;
  dataFim: Date;
  userId: string;
}

export interface NovoFluxoFormData {
  descricao?: string;
  cnpj: string;
  nomeEmpresa: string;
  ramo: string;
  valor: string;
  recorrencia: 'unica' | 'semanal' | 'mensal' | '';
  dataInicio: string;
  quantidadeParcelas: number;
  dataFim: string;
  color?: string;
  documento?: File | null;
}