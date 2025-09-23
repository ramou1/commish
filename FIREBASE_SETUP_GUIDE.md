# Guia de Configuração do Firebase para o Projeto Commish

## 📋 Passo a Passo para Configurar o Firebase

### 1. Criar um Projeto no Firebase Console

1. **Acesse o Firebase Console**: https://console.firebase.google.com/
2. **Clique em "Adicionar projeto"** ou "Criar um projeto"
3. **Digite o nome do projeto**: `commish` (ou o nome que preferir)
4. **Desabilite o Google Analytics** (não é necessário para este projeto)
5. **Clique em "Criar projeto"**

### 2. Configurar Authentication

1. **No menu lateral**, clique em **"Authentication"**
2. **Clique na aba "Sign-in method"**
3. **Habilite os seguintes métodos de login**:
   - ✅ **Email/Password**: Clique em "Email/Password" → Ative "Email/Password" → Salve
   - ✅ **Google**: Clique em "Google" → Ative → Configure o nome do projeto → Salve

### 3. Configurar Firestore Database

1. **No menu lateral**, clique em **"Firestore Database"**
2. **Clique em "Criar banco de dados"**
3. **Escolha o modo**: Selecione **"Modo de teste"** (para desenvolvimento)
4. **Escolha a localização**: Selecione uma região próxima (ex: `southamerica-east1`)
5. **Clique em "Próximo"** e depois **"Habilitar"**

### 4. Obter as Configurações do Projeto

1. **No menu lateral**, clique no ícone de **engrenagem** (Configurações do projeto)
2. **Clique em "Configurações do projeto"**
3. **Role para baixo** até a seção **"Seus aplicativos"**
4. **Clique no ícone da Web** (`</>`) para adicionar um app web
5. **Digite um nome para o app**: `commish-web`
6. **Marque a opção**: "Também configure o Firebase Hosting para este app" (opcional)
7. **Clique em "Registrar app"**

### 5. Copiar as Configurações

Após registrar o app, você verá um objeto de configuração similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "commish-xxxxx.firebaseapp.com",
  projectId: "commish-xxxxx",
  storageBucket: "commish-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 6. Atualizar o Arquivo de Configuração

1. **Abra o arquivo**: `src/lib/firebase.ts`
2. **Substitua o objeto `firebaseConfig`** pelas suas configurações reais
3. **Salve o arquivo**

### 7. Configurar Regras do Firestore (Opcional)

1. **Vá para Firestore Database** → **Regras**
2. **Substitua as regras** por estas (para desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir leitura/escrita para todos os usuários autenticados (desenvolvimento)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. **Clique em "Publicar"**

### 8. Testar a Configuração

1. **Execute o projeto**: `npm run dev`
2. **Acesse**: http://localhost:3000/cadastro
3. **Teste o cadastro** com um email e senha
4. **Teste o login** com as mesmas credenciais
5. **Teste o login com Google**

### 9. Verificar no Firebase Console

1. **Authentication** → **Usuários**: Deve aparecer os usuários cadastrados
2. **Firestore Database** → **Dados**: Deve aparecer a coleção `users` com os dados dos usuários

## 🔧 Estrutura de Dados no Firestore

### Coleção: `users`
Cada documento representa um usuário e contém:

```javascript
{
  uid: "firebase-user-id",
  email: "usuario@email.com",
  nome: "Nome do Usuário",
  cpf: "000.000.000-00",
  tipo: "vendedor" | "empresa",
  ramo: "imoveis" | "automoveis" | "seguros" | "planos-saude" | "vendedor-digital" | "outros",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🚨 Importante

- **Nunca commite** as configurações reais do Firebase no Git
- **Use variáveis de ambiente** em produção
- **Configure as regras do Firestore** adequadamente para produção
- **Teste todos os fluxos** antes de fazer deploy