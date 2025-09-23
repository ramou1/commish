// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export default app;
