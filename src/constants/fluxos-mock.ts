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
  descricao?: string;
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
    cnpj: '12.345.678/0001-90',
    valor: 2500,
    recorrencia: 'unica',
    dataInicio: new Date('2025-01-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-15'),
    color: colors[0],
    descricao: 'Comissão de venda do apartamento no Residencial Jardins'
  },
  {
    id: '2',
    nomeEmpresa: 'Corretora XYZ',
    cnpj: '98.765.432/0001-10',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-20'),
    color: colors[1]    
  },
  {
    id: '20',
    nomeEmpresa: 'Corretora XYZ',
    cnpj: '98.765.432/0001-10',
    valor: 800,
    recorrencia: 'semanal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-09-30'),
    status: 'ativo',
    proximoPagamento: new Date('2025-09-27'),
    color: colors[1],
  },
  {
    id: '3',
    nomeEmpresa: 'Imobiliária R&R',
    cnpj: '11.222.333/0001-44',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-13'),
    color: colors[2],
    descricao: 'Comissão mensal por indicações de clientes'
  },
  {
    id: '4',
    nomeEmpresa: 'Corretora Porto',
    cnpj: '55.666.777/0001-88',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-16'),
    color: colors[3],
  },
  {
    id: '40',
    nomeEmpresa: 'Corretora Porto',
    cnpj: '55.666.777/0001-88',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-16'),
    color: colors[3],
  },
  {
    id: '41',
    nomeEmpresa: 'Corretora Porto',
    cnpj: '55.666.777/0001-88',
    valor: 500,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-16'),
    color: colors[3],
  },
  {
    id: '10',
    nomeEmpresa: 'Imobiliária R&R',
    cnpj: '11.222.333/0001-44',
    valor: 1000,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-09-01'),
    dataFim: new Date('2025-12-31'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-13'),
    color: colors[2],
  },
  {
    id: '5',
    nomeEmpresa: 'Corretora SP',
    cnpj: '22.333.444/0001-55',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-10-21'),
    color: colors[4],
    descricao: 'Comissão por vendas de imóveis comerciais - projeto empresarial'
  },
  {
    id: '6',
    nomeEmpresa: 'Corretora SP',
    cnpj: '22.333.444/0001-55',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-11-21'),
    color: colors[4],
  },
  {
    id: '7',
    nomeEmpresa: 'Corretora SP',
    cnpj: '22.333.444/0001-55',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2025-12-21'),
    color: colors[4],
  },
  {
    id: '8',
    nomeEmpresa: 'Corretora SP',
    cnpj: '22.333.444/0001-55',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-01-21'),
    color: colors[4],
  },
  {
    id: '99',
    nomeEmpresa: 'Corretora SP',
    cnpj: '22.333.444/0001-55',
    valor: 2300,
    recorrencia: 'mensal',
    dataInicio: new Date('2025-10-21'),
    dataFim: new Date('2026-02-21'),
    status: 'ativo',
    proximoPagamento: new Date('2026-02-21'),
    color: colors[4],
  },
];

export function addFluxoMock(newFluxo: FluxoComissao) {
  fluxosIniciais.push(newFluxo);
}


