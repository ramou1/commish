// src/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  ExtendedUser,
  CadastroData,
  TipoUsuario,
  DadosVendedor,
  PlanoUsuario,
  StatusUsuario
} from '@/types/user';

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: CadastroData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...user, ...userData } as ExtendedUser);
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(getAuthErrorMessage(firebaseError.code));
    }
  }, []);

// Função signUp atualizado para remover o upload do comprovante temporariamente
const signUp = useCallback(async (email: string, password: string, userData: CadastroData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // REMOVER: Upload do comprovante (comentado temporariamente)
    // let comprovanteData: ComprovantePagamento | undefined;
    
    // if (userData.comprovanteFile) {
    //   const comprovanteRef = ref(storage, `comprovantes/${user.uid}/${userData.comprovanteFile.name}`);
    //   const snapshot = await uploadBytes(comprovanteRef, userData.comprovanteFile);
    //   const downloadURL = await getDownloadURL(snapshot.ref);
      
    //   comprovanteData = {
    //     arquivoUrl: downloadURL,
    //     nomeArquivo: userData.comprovanteFile.name,
    //     dataUpload: new Date().toISOString(),
    //     status: 'pendente' as const
    //   };
    // }
    
    // Configurar dados do plano
    const planoData: PlanoUsuario = {
      id: userData.planoId,
      nome: userData.planoNome,
      preco: userData.planoPreco,
      dataInicio: new Date().toISOString(),
      dataRenovacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
    };
    
    // Salvar dados adicionais no Firestore (sem comprovante)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      tipo: userData.tipo,
      ramo: userData.ramo,
      dadosPessoais: userData.dadosPessoais,
      plano: planoData,
      // comprovante: comprovanteData, // REMOVIDO TEMPORARIAMENTE
      status: 'ativo' as StatusUsuario, // MUDAR PARA 'ativo' DIRETAMENTE
      liberado: true, // LIBERAR ACESSO DIRETAMENTE
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error: unknown) {
    const firebaseError = error as { code: string };
    throw new Error(getAuthErrorMessage(firebaseError.code));
  }
}, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar se é um novo usuário e salvar dados no Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          tipo: 'vendedor' as TipoUsuario, // Padrão
          ramo: '',
          dadosPessoais: {
            nome: user.displayName || '',
            cpf: '',
            tel: ''
          } as DadosVendedor,
          plano: {
            id: 'standart',
            nome: 'Standart',
            preco: 19.90,
            dataInicio: new Date().toISOString(),
            dataRenovacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          status: 'pendente' as StatusUsuario,
          liberado: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(getAuthErrorMessage(firebaseError.code));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(getAuthErrorMessage(firebaseError.code));
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword
  }), [user, loading, signIn, signUp, signInWithGoogle, logout, resetPassword]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Função para traduzir mensagens de erro do Firebase
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/wrong-password':
      return 'Senha incorreta';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-disabled':
      return 'Esta conta foi desabilitada';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet';
    case 'auth/popup-closed-by-user':
      return 'Login cancelado pelo usuário';
    case 'auth/popup-blocked':
      return 'Popup bloqueado pelo navegador';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-not-found':
      return 'Nenhuma conta encontrada com este email';
    default:
      return 'Erro ao acessar a conta. Confira as informações inseridas';
  }
}