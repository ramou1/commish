// src/lib/fluxoUtils.ts
import { Timestamp } from 'firebase/firestore';
import { FluxoComissao, FluxoFirebase } from '@/types/fluxo';

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
