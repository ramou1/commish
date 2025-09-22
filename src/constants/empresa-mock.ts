// src/constants/empresa-mock.ts

import { colors } from './fluxos-mock';

export interface ClientePagamento {
  id: string;
  nomeEmpresa: string;
  cnpj?: string;
  cpf?: string;
  valor: number;
  dataVencimento: Date;
  dataInicio: Date;
  dataFim: Date;
  status: 'pendente' | 'pago' | 'atrasado';
  ramo: string;
  color: string;
  descricao?: string;
  documentoNome?: string;
  observacoes?: string;
  tipo: 'empresa' | 'pessoa';
  recorrencia?: 'unica' | 'semanal' | 'mensal';
  quantidadeParcelas?: number;
}

export const clientesPagamento: ClientePagamento[] = [
  // EMPRESAS
  {
    id: '1',
    nomeEmpresa: 'Construtora Alpha Ltda',
    cnpj: '12.345.678/0001-90',
    valor: 8500.00,
    dataVencimento: new Date(2024, 11, 15), // 15 de dezembro
    dataInicio: new Date(2024, 11, 15),
    dataFim: new Date(2024, 11, 15),
    status: 'pendente',
    ramo: 'Construção Civil',
    color: colors[0],
    descricao: 'Comissão de venda apartamento - Torre A',
    documentoNome: 'contrato_alpha.pdf',
    tipo: 'empresa'
  },
  {
    id: '2',
    nomeEmpresa: 'Imobiliária Beta S.A.',
    cnpj: '23.456.789/0001-01',
    valor: 4200.00,
    dataVencimento: new Date(2024, 11, 20),
    dataInicio: new Date(2024, 11, 20),
    dataFim: new Date(2024, 11, 20),
    status: 'pendente',
    ramo: 'Imobiliário',
    color: colors[1],
    descricao: 'Comissão de venda casa - Residencial Verde',
    documentoNome: 'venda_beta.docx',
    tipo: 'empresa'
  },
  {
    id: '3',
    nomeEmpresa: 'Desenvolvimento Gamma Ltda',
    cnpj: '34.567.890/0001-12',
    valor: 12500.00,
    dataVencimento: new Date(2024, 10, 30), // 30 de novembro (atrasado)
    dataInicio: new Date(2024, 10, 30),
    dataFim: new Date(2024, 10, 30),
    status: 'atrasado',
    ramo: 'Desenvolvimento Imobiliário',
    color: colors[2],
    descricao: 'Comissão projeto comercial - Shopping Center',
    documentoNome: 'projeto_gamma.pdf',
    observacoes: 'Cliente solicitou prazo adicional',
    tipo: 'empresa'
  },
  {
    id: '4',
    nomeEmpresa: 'Investimentos Delta Ltda',
    cnpj: '45.678.901/0001-23',
    valor: 6800.00,
    dataVencimento: new Date(2024, 11, 5),
    dataInicio: new Date(2024, 11, 5),
    dataFim: new Date(2024, 11, 5),
    status: 'pago',
    ramo: 'Investimentos',
    color: colors[3],
    descricao: 'Comissão de venda terreno - Condomínio Delta',
    documentoNome: 'terreno_delta.pdf',
    tipo: 'empresa'
  },
  {
    id: '5',
    nomeEmpresa: 'Empreendimentos Epsilon S.A.',
    cnpj: '56.789.012/0001-34',
    valor: 9500.00,
    dataVencimento: new Date(2024, 11, 25),
    dataInicio: new Date(2024, 11, 25),
    dataFim: new Date(2024, 11, 25),
    status: 'pendente',
    ramo: 'Construção Civil',
    color: colors[4],
    descricao: 'Comissão de venda apartamento - Torre B',
    documentoNome: 'contrato_epsilon.pdf',
    tipo: 'empresa'
  },
  {
    id: '6',
    nomeEmpresa: 'Loteamentos Zeta Ltda',
    cnpj: '67.890.123/0001-45',
    valor: 4800.00,
    dataVencimento: new Date(2024, 11, 10),
    dataInicio: new Date(2024, 11, 10),
    dataFim: new Date(2024, 11, 10),
    status: 'pago',
    ramo: 'Loteamentos',
    color: colors[5],
    descricao: 'Comissão de venda lote - Residencial Zeta',
    documentoNome: 'lote_zeta.pdf',
    tipo: 'empresa'
  },
  
  // PESSOAS FÍSICAS
  {
    id: '9',
    nomeEmpresa: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    valor: 7500.00,
    dataVencimento: new Date(2024, 11, 18),
    dataInicio: new Date(2024, 11, 18),
    dataFim: new Date(2024, 11, 18),
    status: 'pendente',
    ramo: 'Pessoa Física',
    color: colors[0],
    descricao: 'Comissão de venda casa - Residencial Jardim',
    documentoNome: 'venda_maria.pdf',
    tipo: 'pessoa'
  },
  {
    id: '10',
    nomeEmpresa: 'João Pedro Oliveira',
    cpf: '987.654.321-02',
    valor: 12000.00,
    dataVencimento: new Date(2024, 11, 22),
    dataInicio: new Date(2024, 11, 22),
    dataFim: new Date(2024, 11, 22),
    status: 'pendente',
    ramo: 'Pessoa Física',
    color: colors[1],
    descricao: 'Comissão de venda apartamento - Torre Central',
    documentoNome: 'venda_joao.pdf',
    tipo: 'pessoa'
  },
  {
    id: '11',
    nomeEmpresa: 'Ana Carolina Costa',
    cpf: '456.789.123-03',
    valor: 9200.00,
    dataVencimento: new Date(2024, 10, 28), // 28 de novembro (atrasado)
    dataInicio: new Date(2024, 10, 28),
    dataFim: new Date(2024, 10, 28),
    status: 'atrasado',
    ramo: 'Pessoa Física',
    color: colors[2],
    descricao: 'Comissão de venda terreno - Loteamento Vista',
    documentoNome: 'venda_ana.pdf',
    observacoes: 'Aguardando documentação',
    tipo: 'pessoa'
  },
  {
    id: '12',
    nomeEmpresa: 'Carlos Eduardo Lima',
    cpf: '789.123.456-04',
    valor: 15500.00,
    dataVencimento: new Date(2024, 11, 8),
    dataInicio: new Date(2024, 11, 8),
    dataFim: new Date(2024, 11, 8),
    status: 'pago',
    ramo: 'Pessoa Física',
    color: colors[3],
    descricao: 'Comissão de venda casa - Residencial Sol',
    documentoNome: 'venda_carlos.pdf',
    tipo: 'pessoa'
  },
  
  // JANEIRO 2025 - EMPRESAS
  {
    id: '13',
    nomeEmpresa: 'Desenvolvimento Iota Ltda',
    cnpj: '90.123.456/0001-78',
    valor: 8900.00,
    dataVencimento: new Date(2025, 0, 10), // 10 de janeiro
    dataInicio: new Date(2025, 0, 10),
    dataFim: new Date(2025, 0, 10),
    status: 'pendente',
    ramo: 'Desenvolvimento Imobiliário',
    color: colors[4],
    descricao: 'Comissão de venda apartamento - Residencial Iota',
    documentoNome: 'iota_contrato.pdf',
    tipo: 'empresa'
  },
  {
    id: '14',
    nomeEmpresa: 'Construções Kappa S.A.',
    cnpj: '01.234.567/0001-89',
    valor: 10500.00,
    dataVencimento: new Date(2025, 0, 18), // 18 de janeiro
    dataInicio: new Date(2025, 0, 18),
    dataFim: new Date(2025, 0, 18),
    status: 'pendente',
    ramo: 'Construção Civil',
    color: colors[5],
    descricao: 'Comissão de venda casa - Condomínio Kappa',
    documentoNome: 'kappa_venda.pdf',
    tipo: 'empresa'
  },
  {
    id: '15',
    nomeEmpresa: 'Imobiliária Lambda Ltda',
    cnpj: '12.345.678/0001-90',
    valor: 6100.00,
    dataVencimento: new Date(2025, 0, 25), // 25 de janeiro
    dataInicio: new Date(2025, 0, 25),
    dataFim: new Date(2025, 0, 25),
    status: 'pendente',
    ramo: 'Imobiliário',
    color: colors[6],
    descricao: 'Comissão de venda terreno - Loteamento Lambda',
    documentoNome: 'lambda_terreno.pdf',
    tipo: 'empresa'
  },
  
  // JANEIRO 2025 - PESSOAS FÍSICAS
  {
    id: '16',
    nomeEmpresa: 'Roberto Almeida',
    cpf: '321.654.987-05',
    valor: 8800.00,
    dataVencimento: new Date(2025, 0, 12), // 12 de janeiro
    dataInicio: new Date(2025, 0, 12),
    dataFim: new Date(2025, 0, 12),
    status: 'pendente',
    ramo: 'Pessoa Física',
    color: colors[7],
    descricao: 'Comissão de venda apartamento - Residencial Primavera',
    documentoNome: 'venda_roberto.pdf',
    tipo: 'pessoa'
  },
  {
    id: '17',
    nomeEmpresa: 'Fernanda Rodrigues',
    cpf: '654.987.321-06',
    valor: 13400.00,
    dataVencimento: new Date(2025, 0, 20), // 20 de janeiro
    dataInicio: new Date(2025, 0, 20),
    dataFim: new Date(2025, 0, 20),
    status: 'pendente',
    ramo: 'Pessoa Física',
    color: colors[0],
    descricao: 'Comissão de venda casa - Residencial Flores',
    documentoNome: 'venda_fernanda.pdf',
    tipo: 'pessoa'
  },
  
  // FEVEREIRO 2025 - PAGAMENTOS SEMANAIS
  {
    id: '18',
    nomeEmpresa: 'Consultoria Omega Ltda',
    cnpj: '23.456.789/0001-91',
    valor: 2500.00,
    dataVencimento: new Date(2025, 1, 3), // 3 de fevereiro
    dataInicio: new Date(2025, 1, 3),
    dataFim: new Date(2025, 1, 24),
    status: 'pendente',
    ramo: 'Consultoria',
    color: colors[1],
    descricao: 'Comissão semanal - Projeto de consultoria (Semana 1)',
    documentoNome: 'omega_semana1.pdf',
    tipo: 'empresa',
    recorrencia: 'semanal',
    quantidadeParcelas: 4
  },
  {
    id: '19',
    nomeEmpresa: 'Consultoria Omega Ltda',
    cnpj: '23.456.789/0001-91',
    valor: 2500.00,
    dataVencimento: new Date(2025, 1, 10), // 10 de fevereiro
    dataInicio: new Date(2025, 1, 3),
    dataFim: new Date(2025, 1, 24),
    status: 'pendente',
    ramo: 'Consultoria',
    color: colors[1],
    descricao: 'Comissão semanal - Projeto de consultoria (Semana 2)',
    documentoNome: 'omega_semana2.pdf',
    tipo: 'empresa',
    recorrencia: 'semanal',
    quantidadeParcelas: 4
  },
  {
    id: '20',
    nomeEmpresa: 'Consultoria Omega Ltda',
    cnpj: '23.456.789/0001-91',
    valor: 2500.00,
    dataVencimento: new Date(2025, 1, 17), // 17 de fevereiro
    dataInicio: new Date(2025, 1, 3),
    dataFim: new Date(2025, 1, 24),
    status: 'pendente',
    ramo: 'Consultoria',
    color: colors[1],
    descricao: 'Comissão semanal - Projeto de consultoria (Semana 3)',
    documentoNome: 'omega_semana3.pdf',
    tipo: 'empresa',
    recorrencia: 'semanal',
    quantidadeParcelas: 4
  },
  {
    id: '21',
    nomeEmpresa: 'Consultoria Omega Ltda',
    cnpj: '23.456.789/0001-91',
    valor: 2500.00,
    dataVencimento: new Date(2025, 1, 24), // 24 de fevereiro
    dataInicio: new Date(2025, 1, 3),
    dataFim: new Date(2025, 1, 24),
    status: 'pendente',
    ramo: 'Consultoria',
    color: colors[1],
    descricao: 'Comissão semanal - Projeto de consultoria (Semana 4)',
    documentoNome: 'omega_semana4.pdf',
    tipo: 'empresa',
    recorrencia: 'semanal',
    quantidadeParcelas: 4
  }
];

