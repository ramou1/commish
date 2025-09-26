// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { FluxoFirebase } from '@/types/fluxo';

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

// Função para criar um novo fluxo no Firebase
export async function createFluxo(fluxoData: Omit<FluxoFirebase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now();
    
    // Remover campos com valores undefined para evitar erro do Firebase
    const cleanData = Object.fromEntries(
      Object.entries(fluxoData).filter(([_, value]) => value !== undefined)
    );
    
    const docRef = await addDoc(collection(db, 'fluxos'), {
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

// Função para buscar fluxos de um usuário específico
export async function getFluxosByUserId(userId: string): Promise<FluxoFirebase[]> {
  try {
    const q = query(
      collection(db, 'fluxos'),
      where('userId', '==', userId),
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

export default app;
