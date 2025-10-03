// src/types/fluxo.ts

export interface FluxoComissao {
  id: string;
  nomeEmpresa: string;
  valor: number;
  recorrencia: 'unica' | 'semanal' | 'mensal';
  dataInicio: Date;
  dataFim: Date;
  status: 'ativo' | 'pendente' | 'finalizado';
  proximoPagamento: Date;
  quantidadeParcelas?: number; // Adicionado para suporte a parcelas
  color?: string;
  cnpj?: string;
  ramo?: string;
  documentoNome?: string;
  documentoUrl?: string;
  descricao?: string;
  userId?: string; // Adicionado para compatibilidade com Firebase
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

// Interface específica para dados do Firebase (com Timestamp)
export interface FluxoFirebase {
  id?: string;
  userId: string;
  descricao?: string;
  cnpj: string;
  nomeEmpresa: string;
  ramo?: string;
  valor: number;
  recorrencia: 'unica' | 'semanal' | 'mensal';
  dataInicio: unknown; // Timestamp do Firebase
  dataFim: unknown; // Timestamp do Firebase
  quantidadeParcelas: number;
  status: 'ativo' | 'pendente' | 'finalizado';
  proximoPagamento: unknown; // Timestamp do Firebase
  color?: string;
  documentoNome?: string;
  documentoUrl?: string;
  createdAt: unknown; // Timestamp do Firebase
  updatedAt: unknown; // Timestamp do Firebase
}
