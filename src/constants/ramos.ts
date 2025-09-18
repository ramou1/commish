// src/constants/ramos.ts

export interface RamoOption {
  value: string;
  label: string;
}

export const ramos: RamoOption[] = [
  { value: 'imoveis', label: 'Imóveis' },
  { value: 'automoveis', label: 'Automóveis' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'planos-saude', label: 'Planos de Saúde' },
  { value: 'vendedor-digital', label: 'Vendedor Digital' },
  { value: 'outros', label: 'Outros' }
];


