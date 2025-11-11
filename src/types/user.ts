// src/types/user.ts
import { User as FirebaseUser } from 'firebase/auth';

// Tipos base
export type TipoUsuario = 'vendedor' | 'empresa';
export type RamoNegocio = 'imóveis' | 'automóveis' | 'seguros' | 'planos de saúde' | 'vendedor digital' | 'outros';
export type StatusUsuario = 'pendente' | 'ativo' | 'suspenso' | 'cancelado';

// Dados específicos por tipo de usuário
export interface DadosVendedor {
    nome: string;
    cpf: string;
    tel: string;
}

export interface DadosEmpresa {
    razaoSocial: string;
    cnpj: string;
    tel: string;
}

// Informações do plano
export interface PlanoUsuario {
    id: string;
    nome: string;
    preco: number;
    dataInicio: string;
    dataRenovacao: string;
}

// Informações de pagamento
export interface ComprovantePagamento {
    arquivoUrl?: string;
    nomeArquivo: string;
    dataUpload: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
}

// Dados unificados do usuário (após cadastro completo)
export interface UserProfile {
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
    // Dados específicos baseados no tipo
    dadosPessoais: DadosVendedor | DadosEmpresa;
    // Novos campos
    plano: PlanoUsuario;
    comprovante?: ComprovantePagamento;
    status: StatusUsuario;
    liberado: boolean;
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
    plano?: PlanoUsuario;
    comprovante?: ComprovantePagamento;
    status?: StatusUsuario;
    liberado?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Dados para cadastro (formulário)
export interface CadastroData {
    tipo: TipoUsuario;
    ramo: RamoNegocio | '';
    dadosPessoais: DadosVendedor | DadosEmpresa;
    planoId: string;
    planoNome: string;
    planoPreco: number;
    comprovanteFile?: File;
}

// Dados para login
export interface LoginData {
    email: string;
    senha: string;
}