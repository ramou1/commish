// src/lib/timestampUtils.ts
// Utilitário centralizado para conversão de timestamps
// Facilita a troca de banco de dados no futuro

import { Timestamp } from 'firebase/firestore';
import { formatarDataBrasil } from './dateUtils';

/**
 * Converte um timestamp do Firebase (ou qualquer formato) para uma data JavaScript
 * 
 * Por que essa função existe?
 * - O Firebase retorna datas como objetos Timestamp especiais
 * - Outros bancos podem retornar strings, números, ou outros formatos
 * - Esta função centraliza a conversão, facilitando mudanças futuras
 */
export function converterTimestampParaData(timestamp: unknown): Date | null {
  if (!timestamp) return null;
  
  try {
    // Caso 1: É um Timestamp do Firebase (formato mais comum)
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    
    // Caso 2: É um objeto que tem o método toDate (fallback para outros formatos)
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      const ts = timestamp as { toDate: () => Date };
      return ts.toDate();
    }
    
    // Caso 3: É uma string de data (ex: "2024-01-15T10:30:00Z")
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    
    // Caso 4: É um número (timestamp Unix em milissegundos)
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Formata um timestamp para exibição em português brasileiro
 * Retorna "N/A" se não conseguir converter
 */
export function formatarTimestamp(timestamp: unknown): string {
  const data = converterTimestampParaData(timestamp);
  if (!data) return 'N/A';
  return formatarDataBrasil(data);
}
