// src/constants/empresa-mock.ts

import { colors } from './fluxos-mock';

export interface ClientePagamento {
  id: string;
  nomeEmpresa: string;
  cnpj?: string;
  cpf?: string;
  valor: number;
  dataVencimento: Date;
  status: 'pendente' | 'pago' | 'atrasado';
  ramo: string;
  color: string;
  descricao?: string;
  documentoNome?: string;
  observacoes?: string;
  tipo: 'empresa' | 'pessoa';
}

export const clientesPagamento: ClientePagamento[] = [
  // EMPRESAS
  {
    id: '1',
    nomeEmpresa: 'Construtora Alpha Ltda',
    cnpj: '12.345.678/0001-90',
    valor: 15000.00,
    dataVencimento: new Date(2024, 11, 15), // 15 de dezembro
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
    valor: 8500.00,
    dataVencimento: new Date(2024, 11, 20),
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
    valor: 22000.00,
    dataVencimento: new Date(2024, 10, 30), // 30 de novembro (atrasado)
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
    valor: 12500.00,
    dataVencimento: new Date(2024, 11, 5),
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
    valor: 18000.00,
    dataVencimento: new Date(2024, 11, 25),
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
    valor: 9500.00,
    dataVencimento: new Date(2024, 11, 10),
    status: 'pago',
    ramo: 'Loteamentos',
    color: colors[5],
    descricao: 'Comissão de venda lote - Residencial Zeta',
    documentoNome: 'lote_zeta.pdf',
    tipo: 'empresa'
  },
  {
    id: '7',
    nomeEmpresa: 'Incorporações Eta S.A.',
    cnpj: '78.901.234/0001-56',
    valor: 28000.00,
    dataVencimento: new Date(2024, 11, 28),
    status: 'pendente',
    ramo: 'Incorporação',
    color: colors[6],
    descricao: 'Comissão de venda apartamento - Torre Premium',
    documentoNome: 'premium_eta.pdf',
    tipo: 'empresa'
  },
  {
    id: '8',
    nomeEmpresa: 'Construções Theta Ltda',
    cnpj: '89.012.345/0001-67',
    valor: 13500.00,
    dataVencimento: new Date(2024, 11, 12),
    status: 'pendente',
    ramo: 'Construção Civil',
    color: colors[7],
    descricao: 'Comissão de venda casa - Residencial Theta',
    documentoNome: 'casa_theta.pdf',
    tipo: 'empresa'
  },
  
  // PESSOAS FÍSICAS
  {
    id: '9',
    nomeEmpresa: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    valor: 7500.00,
    dataVencimento: new Date(2024, 11, 18),
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
    valor: 16500.00,
    dataVencimento: new Date(2025, 0, 10), // 10 de janeiro
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
    valor: 19500.00,
    dataVencimento: new Date(2025, 0, 18), // 18 de janeiro
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
    valor: 11200.00,
    dataVencimento: new Date(2025, 0, 25), // 25 de janeiro
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
    status: 'pendente',
    ramo: 'Pessoa Física',
    color: colors[0],
    descricao: 'Comissão de venda casa - Residencial Flores',
    documentoNome: 'venda_fernanda.pdf',
    tipo: 'pessoa'
  }
];

