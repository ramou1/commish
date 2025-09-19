// src/constants/fluxos-mock.ts

export interface FluxoComissao {
  id: string;
  nomeEmpresa: string;
  valor: number;
  recorrencia: 'unica' | 'semanal' | 'mensal';
  dataInicio: Date;
  dataFim: Date;
  status: 'ativo' | 'pendente' | 'finalizado';
  proximoPagamento: Date;
  color?: string;
  cnpj?: string;
  ramo?: string;
  documentoNome?: string;
  documentoUrl?: string;
}

// Paleta de cores usada para identificar clientes
export const colors = [
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
    nomeEmpresa: 'Imobiliária Santos',
    valor: 2500,
    recorrencia: 'unica',
    dataInicio: new Date('2025-01-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-15'),
    color: colors[0],
    cnpj: '12.345.678/0001-90'
  },
  {
    id: '2',
    nomeEmpresa: 'Corretora XYZ',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-20'),
    color: colors[1],
    cnpj: '98.765.432/0001-10'
  },
  {
    id: '20',
    nomeEmpresa: 'Corretora XYZ',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-27'),
    color: colors[1],
    cnpj: '98.765.432/0001-10'
  },
  {
    id: '3',
    nomeEmpresa: 'Imobiliária R&R',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-13'),
    color: colors[2],
    cnpj: '11.222.333/0001-44'
  },
  {
    id: '4',
    nomeEmpresa: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-16'),
    color: colors[3],
    cnpj: '55.666.777/0001-88'
  },
  {
    id: '40',
    nomeEmpresa: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-16'),
    color: colors[3],
    cnpj: '55.666.777/0001-88'
  },
  {
    id: '41',
    nomeEmpresa: 'Corretora Porto',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-16'),
    color: colors[3],
    cnpj: '55.666.777/0001-88'
  },
  {
    id: '10',
    nomeEmpresa: 'Imobiliária R&R',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-13'),
    color: colors[2],
    cnpj: '11.222.333/0001-44'
  },
  {
    id: '5',
    nomeEmpresa: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-21'),
    color: colors[4],
    cnpj: '22.333.444/0001-55'
  },
  {
    id: '6',
    nomeEmpresa: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-21'),
    color: colors[4],
    cnpj: '22.333.444/0001-55'
  },
  {
    id: '7',
    nomeEmpresa: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-21'),
    color: colors[4],
    cnpj: '22.333.444/0001-55'
  },
  {
    id: '8',
    nomeEmpresa: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-01-21'),
    color: colors[4],
    cnpj: '22.333.444/0001-55'
  },
  {
    id: '99',
    nomeEmpresa: 'Corretora SP',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-02-21'),
    color: colors[4],
    cnpj: '22.333.444/0001-55'
  },
];

export function addFluxoMock(newFluxo: FluxoComissao) {
  fluxosIniciais.push(newFluxo);
}


