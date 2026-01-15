// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { FluxoFirebase } from '@/types/fluxo';
import { getStorage } from 'firebase/storage';
import { UserData } from '@/types/user';

// Configuração do Firebase
// IMPORTANTE: Substitua essas configurações pelas suas próprias do Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAB8eW5QYzglzgSFd0hlnmssKqHsITfQMo",
    authDomain: "commish-project.firebaseapp.com",
    projectId: "commish-project",
    storageBucket: "commish-project.firebasestorage.app",
    messagingSenderId: "47825943980",
    appId: "1:47825943980:web:3e501bb0a872ffbdf04e09"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Função para criar um novo fluxo no Firebase (nova estrutura com subcoleções)
export async function createFluxo(userId: string, fluxoData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    // Remover campos com valores undefined para evitar erro do Firebase
    const cleanData = Object.fromEntries(
      Object.entries(fluxoData).filter(([, value]) => value !== undefined)
    );
    
    // Criar na subcoleção do usuário
    const docRef = await addDoc(collection(db, 'users', userId, 'fluxos'), {
      ...cleanData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar fluxo:', error);
    throw error;
  }
}

// Função para buscar fluxos de um usuário específico (nova estrutura com subcoleções)
export async function getFluxosByUserId(userId: string): Promise<FluxoFirebase[]> {
  try {
    const q = query(
      collection(db, 'users', userId, 'fluxos'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const fluxos: FluxoFirebase[] = [];
    
    querySnapshot.forEach((doc) => {
      fluxos.push({
        id: doc.id,
        ...doc.data()
      } as FluxoFirebase);
    });
    
    return fluxos;
  } catch (error) {
    console.error('Erro ao buscar fluxos:', error);
    throw error;
  }
}

// Função para criar fluxo pendente de aprovação (futura funcionalidade)
export async function createFluxoPendente(userId: string, fluxoData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    const cleanData = Object.fromEntries(
      Object.entries(fluxoData).filter(([, value]) => value !== undefined)
    );
    
    // Criar na subcoleção de fluxos pendentes
    const docRef = await addDoc(collection(db, 'users', userId, 'fluxos_pendentes'), {
      ...cleanData,
      status: 'pendente',
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar fluxo pendente:', error);
    throw error;
  }
}

// Função para buscar fluxos pendentes de um usuário
export async function getFluxosPendentesByUserId(userId: string): Promise<FluxoFirebase[]> {
  try {
    const q = query(
      collection(db, 'users', userId, 'fluxos_pendentes'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const fluxos: FluxoFirebase[] = [];
    
    querySnapshot.forEach((doc) => {
      fluxos.push({
        id: doc.id,
        ...doc.data()
      } as FluxoFirebase);
    });
    
    return fluxos;
  } catch (error) {
    console.error('Erro ao buscar fluxos pendentes:', error);
    throw error;
  }
}

// Função para aprovar fluxo pendente (move de pendente para ativo)
export async function aprovarFluxo(userId: string, fluxoPendenteId: string, fluxoData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    // Criar fluxo aprovado
    const docRef = await addDoc(collection(db, 'users', userId, 'fluxos'), {
      ...fluxoData,
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
    });
    
    // Remover fluxo pendente (opcional - pode manter para histórico)
    // await deleteDoc(doc(db, 'users', userId, 'fluxos_pendentes', fluxoPendenteId));
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao aprovar fluxo:', error);
    throw error;
  }
}

// Função para excluir um fluxo
export async function deleteFluxo(userId: string, fluxoId: string): Promise<void> {
  try {
    const { deleteDoc, doc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'users', userId, 'fluxos', fluxoId));
  } catch (error) {
    console.error('Erro ao excluir fluxo:', error);
    throw error;
  }
}

// Função para atualizar o status de um fluxo
export async function updateFluxoStatus(userId: string, fluxoId: string, status: 'ativo' | 'finalizado' | 'rejeitado'): Promise<void> {
  try {
    const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
    const fluxoRef = doc(db, 'users', userId, 'fluxos', fluxoId);
    
    await updateDoc(fluxoRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar status do fluxo:', error);
    throw error;
  }
}

// Função para buscar todos os usuários (apenas para admin)
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: UserData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        ...data
      } as UserData);
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

// Função para contar fluxos de um usuário
export async function countFluxosByUserId(userId: string): Promise<number> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'fluxos'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Erro ao contar fluxos:', error);
    return 0;
  }
}

// Função para atualizar dados do usuário
export async function updateUser(userId: string, updates: Partial<UserData>): Promise<void> {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    
    // Adicionar updatedAt automaticamente
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

// Interface para mensagens de ajuda
export interface AjudaMessage {
  userId: string;
  userEmail: string;
  userName: string;
  tipo: 'sugestao' | 'duvida' | 'problema' | 'melhoria' | 'outro';
  descricao: string;
  createdAt: unknown; // Timestamp do Firebase
  status?: 'pendente' | 'respondido' | 'resolvido';
}

// Função para salvar mensagem de ajuda
export async function saveAjudaMessage(messageData: Omit<AjudaMessage, 'createdAt' | 'status'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    const docRef = await addDoc(collection(db, 'ajuda_mensagens'), {
      ...messageData,
      status: 'pendente',
      createdAt: now,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar mensagem de ajuda:', error);
    throw error;
  }
}

// Interface para solicitações de boleto
export interface BoletoRequest {
  userId: string;
  userEmail: string;
  userName: string;
  userTipo: 'vendedor' | 'empresa';
  cpfCnpj: string;
  telefone: string;
  planoId: string;
  planoNome: string;
  planoPreco: number;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: 'pendente' | 'boleto_gerado' | 'pago' | 'cancelado';
  dataPagamento?: unknown; // Timestamp do Firebase
  dataBoletoGerado?: unknown; // Timestamp do Firebase
  createdAt: unknown; // Timestamp do Firebase
  updatedAt: unknown; // Timestamp do Firebase
}

// Função para salvar solicitação de boleto
export async function saveBoletoRequest(requestData: Omit<BoletoRequest, 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    const docRef = await addDoc(collection(db, 'boleto_solicitacoes'), {
      ...requestData,
      status: 'pendente',
      createdAt: now,
      updatedAt: now,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar solicitação de boleto:', error);
    throw error;
  }
}

// Função para buscar todas as solicitações de boleto (apenas para admin)
export async function getAllBoletoRequests(): Promise<(BoletoRequest & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'boleto_solicitacoes'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests: (BoletoRequest & { id: string })[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      } as BoletoRequest & { id: string });
    });
    
    return requests;
  } catch (error) {
    console.error('Erro ao buscar solicitações de boleto:', error);
    throw error;
  }
}

// Função para atualizar status de solicitação de boleto
export async function updateBoletoRequestStatus(
  requestId: string, 
  status: 'pendente' | 'boleto_gerado' | 'pago' | 'cancelado',
  dataPagamento?: Date
): Promise<void> {
  try {
    const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
    const requestRef = doc(db, 'boleto_solicitacoes', requestId);
    
    const updateData: any = {
      status,
      updatedAt: Timestamp.now()
    };

    if (status === 'pago' && dataPagamento) {
      updateData.dataPagamento = Timestamp.fromDate(dataPagamento);
    }

    if (status === 'boleto_gerado') {
      updateData.dataBoletoGerado = Timestamp.now();
    }
    
    await updateDoc(requestRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar status da solicitação de boleto:', error);
    throw error;
  }
}

export default app;
