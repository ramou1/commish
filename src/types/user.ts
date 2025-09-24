// src/types/user.ts
import { User as FirebaseUser } from 'firebase/auth';

// Tipos para ramos de negócio
export type TipoUsuario = 'vendedor' | 'empresa';
export type RamoNegocio = 'imóveis' | 'automóveis' | 'seguros' | 'planos de saúde' | 'vendedor digital' | 'outros';

// Dados básicos do usuário (sem autenticação)
export interface UserProfile {
    nome: string;
    cpf: string;
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
}

// Dados completos do usuário no Firestore
export interface UserData extends UserProfile {
    uid: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

// Usuário estendido que combina Firebase Auth + dados do Firestore
export interface ExtendedUser extends FirebaseUser {
    nome?: string;
    cpf?: string;
    tipo?: TipoUsuario;
    ramo?: RamoNegocio;
    createdAt?: string;
    updatedAt?: string;
}

// Dados para cache de usuário
export interface UserDataCache {
    uid?: string;
    email?: string;
    nome?: string;
    cpf?: string;
    tipo?: TipoUsuario;
    ramo?: RamoNegocio;
    createdAt?: string;
    updatedAt?: string;
}

// Dados para login
export interface LoginData {
    email: string;
    senha: string;
}

// Dados para cadastro
export interface CadastroData {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
}