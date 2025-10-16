// src/lib/fluxoUtils.ts
import { Timestamp } from 'firebase/firestore';
import { FluxoComissao, FluxoFirebase } from '@/types/fluxo';
import { ClientePagamento } from '@/constants/empresa-mock';

// Tipo para Timestamp do Firebase
type FirebaseTimestamp = {
  toDate(): Date;
};

// Converter dados do formulário para formato do Firebase
export function convertFormDataToFirebase(
  formData: {
    descricao?: string;
    cnpj: string;
    nomeEmpresa: string;
    ramo?: string;
    valor: string;
    recorrencia: 'unica' | 'semanal' | 'mensal' | '';
    dataInicio: string;
    dataFim: string;
    quantidadeParcelas: number;
    color?: string;
    documento?: File | null;
  },
  userId: string,
  proximoPagamento: Date,
  corAuto: string
): Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'> {
  const firebaseData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    descricao: formData.descricao || '',
    cnpj: formData.cnpj,
    nomeEmpresa: formData.nomeEmpresa,
    ramo: formData.ramo || '',
    valor: Number(String(formData.valor).replace(/\D/g, '')) / 100,
    recorrencia: formData.recorrencia as 'unica' | 'semanal' | 'mensal',
    dataInicio: Timestamp.fromDate(new Date(formData.dataInicio)),
    dataFim: Timestamp.fromDate(new Date(formData.dataFim)),
    quantidadeParcelas: formData.quantidadeParcelas,
    status: 'ativo' as const,
    proximoPagamento: Timestamp.fromDate(proximoPagamento),
    color: formData.color || corAuto,
    tipo: 'empresa' as const, // Para fluxos de usuários comuns, sempre empresa
  };

  // Adicionar documentoNome apenas se existir
  if (formData.documento && formData.documento.name) {
    firebaseData.documentoNome = formData.documento.name;
  }

  return firebaseData;
}

// Converter dados do Firebase para formato do mock (FluxoComissao)
export function convertFirebaseToFluxoComissao(firebaseFluxo: FluxoFirebase): FluxoComissao {
  return {
    id: firebaseFluxo.id || '',
    nomeEmpresa: firebaseFluxo.nomeEmpresa,
    valor: firebaseFluxo.valor,
    recorrencia: firebaseFluxo.recorrencia,
    dataInicio: (firebaseFluxo.dataInicio as FirebaseTimestamp).toDate(),
    dataFim: (firebaseFluxo.dataFim as FirebaseTimestamp).toDate(),
    status: firebaseFluxo.status,
    proximoPagamento: (firebaseFluxo.proximoPagamento as FirebaseTimestamp).toDate(),
    quantidadeParcelas: firebaseFluxo.quantidadeParcelas,
    color: firebaseFluxo.color,
    cnpj: firebaseFluxo.cnpj,
    ramo: firebaseFluxo.ramo,
    documentoNome: firebaseFluxo.documentoNome,
    documentoUrl: firebaseFluxo.documentoUrl,
    descricao: firebaseFluxo.descricao,
  };
}

// Converter múltiplos fluxos do Firebase para formato do mock
export function convertFirebaseFluxosToComissao(firebaseFluxos: FluxoFirebase[]): FluxoComissao[] {
  return firebaseFluxos.map(convertFirebaseToFluxoComissao);
}

// Converter dados do Firebase para formato da empresa (ClientePagamento)
export function convertFirebaseToClientePagamento(firebaseFluxo: FluxoFirebase): ClientePagamento {
  return {
    id: firebaseFluxo.id || '',
    nomeEmpresa: firebaseFluxo.nomeEmpresa,
    valor: firebaseFluxo.valor,
    dataVencimento: (firebaseFluxo.proximoPagamento as FirebaseTimestamp).toDate(),
    dataInicio: (firebaseFluxo.dataInicio as FirebaseTimestamp).toDate(),
    dataFim: (firebaseFluxo.dataFim as FirebaseTimestamp).toDate(),
    status: firebaseFluxo.status === 'ativo' ? 'pendente' : 
            firebaseFluxo.status === 'finalizado' ? 'pago' : 
            firebaseFluxo.status === 'rejeitado' ? 'atrasado' : 'pendente',
    ramo: firebaseFluxo.ramo || '',
    color: firebaseFluxo.color || '#E5E7EB',
    descricao: firebaseFluxo.descricao,
    documentoNome: firebaseFluxo.documentoNome,
    tipo: firebaseFluxo.tipo || 'empresa', // Garantir que sempre tenha um valor
    recorrencia: firebaseFluxo.recorrencia,
    quantidadeParcelas: firebaseFluxo.quantidadeParcelas,
    cnpj: firebaseFluxo.cnpj,
  };
}

// Converter múltiplos fluxos do Firebase para formato da empresa
export function convertFirebaseFluxosToEmpresa(firebaseFluxos: FluxoFirebase[]): ClientePagamento[] {
  return firebaseFluxos.map(convertFirebaseToClientePagamento);
}

// Converter dados da empresa para formato do Firebase
export function convertEmpresaFormDataToFirebase(
  formData: ClientePagamento,
  userId: string,
  proximoPagamento: Date,
  corAuto: string
): Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'> {
  const firebaseData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'> = {
    userId,
    descricao: formData.descricao || '',
    cnpj: formData.cnpj || '',
    nomeEmpresa: formData.nomeEmpresa,
    ramo: formData.ramo || '',
    valor: formData.valor,
    recorrencia: formData.recorrencia || 'unica',
    dataInicio: Timestamp.fromDate(formData.dataInicio),
    dataFim: Timestamp.fromDate(formData.dataFim),
    quantidadeParcelas: formData.quantidadeParcelas || 1,
    status: 'ativo' as const,
    proximoPagamento: Timestamp.fromDate(proximoPagamento),
    color: formData.color || corAuto,
    tipo: formData.tipo || 'empresa', // Garantir que sempre tenha um valor
  };

  // Adicionar documentoNome apenas se existir
  if (formData.documentoNome) {
    firebaseData.documentoNome = formData.documentoNome;
  }

  return firebaseData;
}
