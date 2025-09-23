// src/types/user.ts
export interface User {
    id: string;
    nome: string;
    cpf: string;
    email?: string;
    tipo: 'vendedor' | 'empresa';
    ramo: 'imóveis' | 'automóveis' | 'seguros' | 'planos de saúde' | 'vendedor digital' | 'outros';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LoginData {
    email: string;
    senha: string;
}

export interface CadastroData {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    tipo: string;
    ramo: string;
}

export interface UserData {
    nome: string;
    cpf: string;
    tipo: string;
    ramo: string;
}