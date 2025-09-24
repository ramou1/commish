// src/types/user.ts
import { User as FirebaseUser } from 'firebase/auth';

// Tipos base
export type TipoUsuario = 'vendedor' | 'empresa';
export type RamoNegocio = 'imóveis' | 'automóveis' | 'seguros' | 'planos de saúde' | 'vendedor digital' | 'outros';

// Dados específicos por tipo de usuário
export interface DadosVendedor {
    nome: string;
    cpf: string;
}

export interface DadosEmpresa {
    razaoSocial: string;
    cnpj: string;
}

// Dados unificados do usuário (pode ser vendedor ou empresa)
export interface UserProfile {
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
    // Dados específicos baseados no tipo
    dadosPessoais: DadosVendedor | DadosEmpresa;
}

// Dados completos no Firestore
export interface UserData extends UserProfile {
    uid: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

// Usuário estendido (Firebase Auth + Firestore)
export interface ExtendedUser extends FirebaseUser {
    tipo?: TipoUsuario;
    ramo?: RamoNegocio;
    dadosPessoais?: DadosVendedor | DadosEmpresa;
    createdAt?: string;
    updatedAt?: string;
}

// Dados para cadastro (formulário)
export interface CadastroData {
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
    dadosPessoais: DadosVendedor | DadosEmpresa;
    email: string;
    senha: string;
}

// Dados para login
export interface LoginData {
    email: string;
    senha: string;
}