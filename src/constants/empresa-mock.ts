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
  // {
  //   id: '3',
  //   nomeEmpresa: 'Desenvolvimento Gamma Ltda',
  //   cnpj: '34.567.890/0001-12',
  //   valor: 12500.00,
  //   dataVencimento: new Date(2024, 10, 30), // 30 de novembro (atrasado)
  //   dataInicio: new Date(2024, 10, 30),
  //   dataFim: new Date(2024, 10, 30),
  //   status: 'atrasado',
  //   ramo: 'Desenvolvimento Imobiliário',
  //   color: colors[2],
  //   descricao: 'Comissão projeto comercial - Shopping Center',
  //   documentoNome: 'projeto_gamma.pdf',
  //   observacoes: 'Cliente solicitou prazo adicional',
  //   tipo: 'empresa'
  // },
  // {
  //   id: '6',
  //   nomeEmpresa: 'Loteamentos Zeta Ltda',
  //   cnpj: '67.890.123/0001-45',
  //   valor: 4800.00,
  //   dataVencimento: new Date(2024, 10, 10),
  //   dataInicio: new Date(2024, 10, 10),
  //   dataFim: new Date(2024, 10, 10),
  //   status: 'atrasado',
  //   ramo: 'Loteamentos',
  //   color: colors[5],
  //   descricao: 'Comissão de venda lote - Residencial Zeta',
  //   documentoNome: 'lote_zeta.pdf',
  //   tipo: 'empresa'
  // },
  // {
  //   id: '4',
  //   nomeEmpresa: 'Investimentos Delta Ltda',
  //   cnpj: '45.678.901/0001-23',
  //   valor: 6800.00,
  //   dataVencimento: new Date(2024, 11, 5),
  //   dataInicio: new Date(2024, 11, 5),
  //   dataFim: new Date(2024, 11, 5),
  //   status: 'pago',
  //   ramo: 'Investimentos',
  //   color: colors[3],
  //   descricao: 'Comissão de venda terreno - Condomínio Delta',
  //   documentoNome: 'terreno_delta.pdf',
  //   tipo: 'empresa'
  // },
  // {
  //   id: '5',
  //   nomeEmpresa: 'Empreendimentos Epsilon S.A.',
  //   cnpj: '56.789.012/0001-34',
  //   valor: 9500.00,
  //   dataVencimento: new Date(2024, 11, 25),
  //   dataInicio: new Date(2024, 11, 25),
  //   dataFim: new Date(2024, 11, 25),
  //   status: 'pendente',
  //   ramo: 'Construção Civil',
  //   color: colors[4],
  //   descricao: 'Comissão de venda apartamento - Torre B',
  //   documentoNome: 'contrato_epsilon.pdf',
  //   tipo: 'empresa'
  // },

  
  // PESSOAS FÍSICAS
  // {
  //   id: '9',
  //   nomeEmpresa: 'Maria Silva Santos',
  //   cpf: '123.456.789-01',
  //   valor: 7500.00,
  //   dataVencimento: new Date(2024, 11, 18),
  //   dataInicio: new Date(2024, 11, 18),
  //   dataFim: new Date(2024, 11, 18),
  //   status: 'pendente',
  //   ramo: 'Pessoa Física',
  //   color: colors[0],
  //   descricao: 'Comissão de venda casa - Residencial Jardim',
  //   documentoNome: 'venda_maria.pdf',
  //   tipo: 'pessoa'
  // },
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
  // {
  //   id: '12',
  //   nomeEmpresa: 'Carlos Eduardo Lima',
  //   cpf: '789.123.456-04',
  //   valor: 15500.00,
  //   dataVencimento: new Date(2024, 11, 8),
  //   dataInicio: new Date(2024, 11, 8),
  //   dataFim: new Date(2024, 11, 8),
  //   status: 'pago',
  //   ramo: 'Pessoa Física',
  //   color: colors[3],
  //   descricao: 'Comissão de venda casa - Residencial Sol',
  //   documentoNome: 'venda_carlos.pdf',
  //   tipo: 'pessoa'
  // },
  
  // JANEIRO 2025 - EMPRESAS
  // {
  //   id: '13',
  //   nomeEmpresa: 'Desenvolvimento Iota Ltda',
  //   cnpj: '90.123.456/0001-78',
  //   valor: 8900.00,
  //   dataVencimento: new Date(2025, 0, 10), // 10 de janeiro
  //   dataInicio: new Date(2025, 0, 10),
  //   dataFim: new Date(2025, 0, 10),
  //   status: 'pendente',
  //   ramo: 'Desenvolvimento Imobiliário',
  //   color: colors[4],
  //   descricao: 'Comissão de venda apartamento - Residencial Iota',
  //   documentoNome: 'iota_contrato.pdf',
  //   tipo: 'empresa'
  // },
  // {
  //   id: '14',
  //   nomeEmpresa: 'Construções Kappa S.A.',
  //   cnpj: '01.234.567/0001-89',
  //   valor: 10500.00,
  //   dataVencimento: new Date(2025, 0, 18), // 18 de janeiro
  //   dataInicio: new Date(2025, 0, 18),
  //   dataFim: new Date(2025, 0, 18),
  //   status: 'pendente',
  //   ramo: 'Construção Civil',
  //   color: colors[5],
  //   descricao: 'Comissão de venda casa - Condomínio Kappa',
  //   documentoNome: 'kappa_venda.pdf',
  //   tipo: 'empresa'
  // },
  
  // FEVEREIRO 2025 - PAGAMENTOS SEMANAIS
  // {
  //   id: '18',
  //   nomeEmpresa: 'Consultoria Omega Ltda',
  //   cnpj: '23.456.789/0001-91',
  //   valor: 2500.00,
  //   dataVencimento: new Date(2025, 1, 3), // 3 de fevereiro
  //   dataInicio: new Date(2025, 1, 3),
  //   dataFim: new Date(2025, 1, 24),
  //   status: 'pendente',
  //   ramo: 'Consultoria',
  //   color: colors[1],
  //   descricao: 'Comissão semanal - Projeto de consultoria (Semana 1)',
  //   documentoNome: 'omega_semana1.pdf',
  //   tipo: 'empresa',
  //   recorrencia: 'semanal',
  //   quantidadeParcelas: 4
  // },
  // {
  //   id: '19',
  //   nomeEmpresa: 'Consultoria Omega Ltda',
  //   cnpj: '23.456.789/0001-91',
  //   valor: 2500.00,
  //   dataVencimento: new Date(2025, 1, 10), // 10 de fevereiro
  //   dataInicio: new Date(2025, 1, 3),
  //   dataFim: new Date(2025, 1, 24),
  //   status: 'pendente',
  //   ramo: 'Consultoria',
  //   color: colors[1],
  //   descricao: 'Comissão semanal - Projeto de consultoria (Semana 2)',
  //   documentoNome: 'omega_semana2.pdf',
  //   tipo: 'empresa',
  //   recorrencia: 'semanal',
  //   quantidadeParcelas: 4
  // },
  // {
  //   id: '20',
  //   nomeEmpresa: 'Consultoria Omega Ltda',
  //   cnpj: '23.456.789/0001-91',
  //   valor: 2500.00,
  //   dataVencimento: new Date(2025, 1, 17), // 17 de fevereiro
  //   dataInicio: new Date(2025, 1, 3),
  //   dataFim: new Date(2025, 1, 24),
  //   status: 'pendente',
  //   ramo: 'Consultoria',
  //   color: colors[1],
  //   descricao: 'Comissão semanal - Projeto de consultoria (Semana 3)',
  //   documentoNome: 'omega_semana3.pdf',
  //   tipo: 'empresa',
  //   recorrencia: 'semanal',
  //   quantidadeParcelas: 4
  // },
  // {
  //   id: '21',
  //   nomeEmpresa: 'Consultoria Omega Ltda',
  //   cnpj: '23.456.789/0001-91',
  //   valor: 2500.00,
  //   dataVencimento: new Date(2025, 1, 24), // 24 de fevereiro
  //   dataInicio: new Date(2025, 1, 3),
  //   dataFim: new Date(2025, 1, 24),
  //   status: 'pendente',
  //   ramo: 'Consultoria',
  //   color: colors[1],
  //   descricao: 'Comissão semanal - Projeto de consultoria (Semana 4)',
  //   documentoNome: 'omega_semana4.pdf',
  //   tipo: 'empresa',
  //   recorrencia: 'semanal',
  //   quantidadeParcelas: 4
  // }
];

// Interface para fluxos pendentes de aprovação
export interface FluxoPendenteAprovacao {
  id: string;
  nomeUsuario: string;
  emailUsuario: string;
  cnpjEmpresa: string;
  nomeEmpresa: string;
  valor: number;
  dataCriacao: Date;
  dataVencimento: Date;
  recorrencia: 'unica' | 'semanal' | 'mensal';
  quantidadeParcelas?: number;
  descricao: string;
  documentoNome?: string;
  observacoesUsuario?: string;
  status: 'pendente_aprovacao';
}

// Dados mockados para fluxos pendentes de aprovação
export const fluxosPendentesAprovacao: FluxoPendenteAprovacao[] = [
  {
    id: 'pa-1',
    nomeUsuario: 'Carlos Mendes',
    emailUsuario: 'carlos.mendes@email.com',
    cnpjEmpresa: '12.345.678/0001-90',
    nomeEmpresa: 'Construtora Alpha Ltda',
    valor: 8500.00,
    dataCriacao: new Date(2024, 11, 10),
    dataVencimento: new Date(2024, 11, 15),
    recorrencia: 'unica',
    descricao: 'Comissão de venda apartamento - Torre A, apartamento 1201',
    documentoNome: 'contrato_alpha_1201.pdf',
    observacoesUsuario: 'Cliente já assinou o contrato e fez o pagamento inicial',
    status: 'pendente_aprovacao'
  },
  {
    id: 'pa-2',
    nomeUsuario: 'Ana Beatriz Silva',
    emailUsuario: 'ana.silva@email.com',
    cnpjEmpresa: '23.456.789/0001-01',
    nomeEmpresa: 'Imobiliária Beta S.A.',
    valor: 4200.00,
    dataCriacao: new Date(2024, 11, 12),
    dataVencimento: new Date(2024, 11, 20),
    recorrencia: 'unica',
    descricao: 'Comissão de venda casa - Residencial Verde, casa 45',
    documentoNome: 'venda_beta_casa45.pdf',
    observacoesUsuario: 'Venda realizada com financiamento aprovado',
    status: 'pendente_aprovacao'
  },
  {
    id: 'pa-3',
    nomeUsuario: 'Roberto Santos',
    emailUsuario: 'roberto.santos@email.com',
    cnpjEmpresa: '34.567.890/0001-12',
    nomeEmpresa: 'Desenvolvimento Gamma Ltda',
    valor: 12500.00,
    dataCriacao: new Date(2024, 11, 8),
    dataVencimento: new Date(2024, 11, 30),
    recorrencia: 'mensal',
    quantidadeParcelas: 3,
    descricao: 'Comissão projeto comercial - Shopping Center, loja 15',
    documentoNome: 'projeto_gamma_loja15.pdf',
    observacoesUsuario: 'Projeto em fase final de construção',
    status: 'pendente_aprovacao'
  },
  {
    id: 'pa-4',
    nomeUsuario: 'Mariana Costa',
    emailUsuario: 'mariana.costa@email.com',
    cnpjEmpresa: '45.678.901/0001-23',
    nomeEmpresa: 'Investimentos Delta Ltda',
    valor: 6800.00,
    dataCriacao: new Date(2024, 11, 14),
    dataVencimento: new Date(2024, 11, 25),
    recorrencia: 'unica',
    descricao: 'Comissão de venda terreno - Condomínio Delta, lote 78',
    documentoNome: 'terreno_delta_lote78.pdf',
    observacoesUsuario: 'Cliente interessado em construir casa de alto padrão',
    status: 'pendente_aprovacao'
  },
  {
    id: 'pa-5',
    nomeUsuario: 'Pedro Oliveira',
    emailUsuario: 'pedro.oliveira@email.com',
    cnpjEmpresa: '56.789.012/0001-34',
    nomeEmpresa: 'Empreendimentos Epsilon S.A.',
    valor: 9500.00,
    dataCriacao: new Date(2024, 11, 11),
    dataVencimento: new Date(2024, 11, 28),
    recorrencia: 'semanal',
    quantidadeParcelas: 4,
    descricao: 'Comissão de venda apartamento - Torre B, apartamento 205',
    documentoNome: 'contrato_epsilon_205.pdf',
    observacoesUsuario: 'Cliente fez proposta acima do valor de tabela',
    status: 'pendente_aprovacao'
  }
];

