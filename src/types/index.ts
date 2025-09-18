// src/types/index.ts
export interface User {
    id: string;
    nomeCompleto: string;
    cpf: string;
    tipo: 'vendedor';
    ramo: 'imóveis' | 'automóveis' | 'seguros' | 'planos de saúde' | 'vendedor digital' | 'outros';
  }
  
  export interface FluxoComissao {
    id: string;
    deQuemReceber: string;
    valor: number;
  recorrencia: 'semanal' | 'mensal';
    dataInicio: Date;
    dataFim: Date;
    userId: string;
  }