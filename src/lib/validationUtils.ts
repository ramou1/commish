// src/lib/validationUtils.ts
// Utilitários para validação e sanitização de dados
// Previne problemas de segurança e garante dados limpos

/**
 * Sanitiza uma string removendo caracteres perigosos e limitando o tamanho
 * 
 * Por que isso é importante?
 * - Previne problemas se migrar para banco SQL no futuro
 * - Remove caracteres de controle que podem causar problemas
 * - Garante que o tamanho está dentro dos limites
 */
export function sanitizeString(value: string, maxLength: number): string {
  if (!value) return '';
  
  // Remover caracteres de controle (exceto espaços, quebras de linha, tabs)
  let sanitized = value.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limitar tamanho
  sanitized = sanitized.slice(0, maxLength);
  
  // Remover espaços extras no início e fim
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Valida e sanitiza dados de endereço
 */
export function sanitizeEndereco(endereco: {
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}) {
  return {
    cep: sanitizeString(endereco.cep || '', 10), // CEP: 00000-000 (9 caracteres + 1 de segurança)
    rua: sanitizeString(endereco.rua || '', 100),
    numero: sanitizeString(endereco.numero || '', 10),
    complemento: sanitizeString(endereco.complemento || '', 100),
    bairro: sanitizeString(endereco.bairro || '', 50),
    cidade: sanitizeString(endereco.cidade || '', 50),
    estado: sanitizeString(endereco.estado || '', 2).toUpperCase(),
  };
}

/**
 * Valida e sanitiza string de texto genérico (para descrições, etc)
 */
export function sanitizeText(value: string, maxLength: number = 5000): string {
  return sanitizeString(value, maxLength);
}
