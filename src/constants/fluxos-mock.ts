// src/constants/fluxos-mock.ts

export interface FluxoComissao {
  id: string;
  deQuemReceber: string;
  valor: number;
  recorrencia: 'unica' | 'semanal' | 'mensal';
  dataInicio: Date;
  dataFim: Date;
  status: 'ativo' | 'pendente' | 'finalizado';
  proximoPagamento: Date;
  color?: string;
}

// Paleta de cores usada para identificar clientes
export const coresPastel = [
  '#FFD6E7',
  '#D4F0F0',
  '#E2F0CB',
  '#FFF2CC',
  '#E6E6FA',
  '#FFE4E1',
  '#F0E6FF',
  '#E0FFFF',
];

export const fluxosIniciais: FluxoComissao[] = [
  {
    id: '1',
    deQuemReceber: 'Imobiliária Santos',
    valor: 2500,
    recorrencia: 'unica',
    dataInicio: new Date('2025-01-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-15'),
    color: coresPastel[0]
  },
  {
    id: '2',
    deQuemReceber: 'Corretora XYZ',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-20'),
    color: coresPastel[1]
  },
  {
    id: '20',
    deQuemReceber: 'Corretora XYZ',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-27'),
    color: coresPastel[1]
  },
  {
    id: '3',
    deQuemReceber: 'Imobiliária R&R',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-13'),
    color: coresPastel[2]
  },
  {
    id: '4',
    deQuemReceber: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-16'),
    color: coresPastel[3]
  },
  {
    id: '40',
    deQuemReceber: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-16'),
    color: coresPastel[3]
  },
  {
    id: '41',
    deQuemReceber: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-16'),
    color: coresPastel[3]
  },
  {
    id: '10',
    deQuemReceber: 'Imobiliária R&R',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-13'),
    color: coresPastel[2]
  },
  {
    id: '5',
    deQuemReceber: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-21'),
    color: coresPastel[4]
  },
  {
    id: '6',
    deQuemReceber: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-21'),
    color: coresPastel[4]
  },
  {
    id: '7',
    deQuemReceber: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-21'),
    color: coresPastel[4]
  },
  {
    id: '8',
    deQuemReceber: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-01-21'),
    color: coresPastel[4]
  },
  {
    id: '99',
    deQuemReceber: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-02-21'),
    color: coresPastel[4]
  },
];

export function addFluxoMock(newFluxo: FluxoComissao) {
  fluxosIniciais.push(newFluxo);
}


