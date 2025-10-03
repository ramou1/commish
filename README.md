# Commish - Sistema de Gestão de Comissões

Sistema web para gestão e acompanhamento de fluxos de comissão, permitindo que vendedores e empresas organizem seus recebimentos de forma inteligente e antecipem valores com taxas transparentes.

## 🚀 Funcionalidades Principais

- **Gestão de Comissões**: Organize e acompanhe todos os fluxos de comissão em uma agenda visual
- **Antecipação Inteligente**: Antecipe recebimentos com as melhores taxas do mercado
- **Dashboard Completo**: Visualize performance e planeje crescimento
- **Autenticação Segura**: Sistema de login e cadastro com validação completa
- **Interface Intuitiva**: Design moderno e responsivo para melhor experiência
- **Gestão por Parcelas**: Criação de fluxos recorrentes com cálculo automático de parcelas
- **Sistema de Aprovação**: Estrutura preparada para aprovação de fluxos entre empresas e vendedores (em desenvolvimento)

## 🏗️ Arquitetura do Projeto

### **Frontend (Next.js)**
```
src/
├── app/                  # Páginas e rotas da aplicação Next.js
│   ├── (auth)/           # Páginas de autenticação (login/cadastro)
│   └── (dashboard)/      # Páginas do dashboard principal
├── components/           # Componentes reutilizáveis da UI
│   ├── modals/           # Componentes de modal (formulários)
│   │   ├── fluxo-new-modal.tsx        # Modal para criar novo fluxo
│   │   ├── fluxo-details-modal.tsx    # Modal para exibir detalhes do fluxo
│   │   └── fluxo-empresa-modal.tsx    # Modal para empresas
│   └── ui/               # Componentes base (botões, inputs, etc.)
├── constants/            # Dados mockados e constantes da aplicação
├── lib/                  # Utilitários e funções auxiliares
│   ├── dateUtils.ts      # Utilitários para manipulação de datas com date-fns
│   ├── firebase.ts       # Configuração e inicialização do Firebase
│   └── fluxoUtils.ts     # Utilitários para conversão de dados de fluxos
├── contexts/             # Contextos React para gerenciamento de estado
│   ├── AuthContext.tsx   # Contexto de autenticação com Firebase
│   └── ProfileContext.tsx # Contexto para gerenciamento de perfis
├── views/                # Visualizações específicas por tipo de usuário
│   ├── usuario/          # Visualização para vendedores
│   ├── empresa/          # Visualização para empresas
│   └── admin/            # Visualização para administradores
└── types/                # Definições de interfaces
    ├── fluxo.ts          # Interfaces relacionadas aos fluxos
    ├── user.ts           # Interfaces relacionadas ao usuário
    └── profile.ts        # Interfaces de perfil
```

### **Backend (Firebase)**
```
Firebase Firestore
├── users/{userId}/fluxos/{fluxoId}           # Fluxos aprovados por usuário
├── users/{userId}/fluxos_pendentes/{fluxoId} # Fluxos pendentes de aprovação
└── empresas/{empresaId}/propostas/{propostaId} # Propostas de fluxos (futuro)
```

### **Arquitetura de Dados**

O sistema utiliza uma **estrutura de subcoleções** no Firebase Firestore para otimizar performance e organização:

- **`users/{userId}/fluxos/`**: Fluxos ativos do usuário (criados diretamente ou aprovados)
- **`users/{userId}/fluxos_pendentes/`**: Fluxos pendentes de aprovação do usuário
- **Isolamento por usuário**: Cada usuário só acessa seus próprios dados
- **Performance otimizada**: Queries em coleções menores (~50 fluxos por usuário)
- **Escalabilidade**: Estrutura cresce linearmente com o número de usuários

### **Tipos de Usuário**

1. **Vendedor**: Cria e gerencia seus próprios fluxos de comissão
2. **Empresa**: Cria fluxos para seus vendedores (com sistema de aprovação futuro)
3. **Admin**: Acesso completo ao sistema (em desenvolvimento)

## 📱 Páginas Principais

- **Landing Page** (`/`) - Página inicial com apresentação do sistema
- **Login** (`/login`) - Autenticação de usuários existentes
- **Cadastro** (`/cadastro`) - Registro de novos usuários
- **Agenda** (`/agenda`) - Visualização e gestão de fluxos de comissão
- **Orçamento** (`/orcamento`) - Cálculos e simulações (em desenvolvimento)
- **Clientes** (`/clientes`) - Gestão de clientes (em desenvolvimento)
- **Contratos** (`/contratos`) - Gestão de contratos (em desenvolvimento)
- **Cadastros** (`/cadastros`) - Configurações gerais (em desenvolvimento)

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior robustez
- **Tailwind CSS** - Estilização utilitária e responsiva
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **date-fns** - Biblioteca moderna para manipulação de datas
- **Lucide React** - Ícones modernos
- **Firebase (Backend-as-a-Service)** - Autenticação e banco de dados em tempo real

## 🧩 Componentes Principais

### **Modais de Fluxo**

#### **fluxo-new-modal.tsx**
Modal para criação de novos fluxos de comissão com:
- **Formulário completo**: CNPJ, razão social, valor, recorrência, datas
- **Validação em tempo real**: Campos obrigatórios e formatos corretos
- **Cálculo automático**: Data final e valor por parcela
- **Upload de documentos**: Anexos opcionais (PDF, JPG, PNG, DOC, DOCX)
- **Seleção de cores**: Identificação visual dos fluxos
- **Resumo prévia**: Confirmação antes da criação

#### **fluxo-details-modal.tsx**
Modal para visualização detalhada de fluxos existentes com:
- **Informações completas**: Todos os dados do fluxo
- **Histórico de pagamentos**: Cronologia de recebimentos
- **Ações disponíveis**: Editar, excluir, marcar como pago
- **Documentos anexos**: Visualização de arquivos enviados

### **Utilitários de Data**

#### **lib/dateUtils.ts**
Biblioteca centralizada para manipulação de datas com date-fns:
- **`criarDataLocal()`**: Criação de datas sem problemas de timezone
- **`formatarDataBrasil()`**: Formatação no padrão brasileiro (dd/MM/yyyy)
- **`formatarMesAno()`**: Formatação de meses em português
- **`calcularDataFinal()`**: Cálculo de datas finais para recorrências
- **`gerarDatasPagamento()`**: Geração automática de datas de pagamento
- **`agruparFluxosPorMes()`**: Agrupamento de fluxos por período
- **`obterMesesComFluxos()`**: Identificação de meses com atividade

## 📅 Funcionalidades de Data

O projeto utiliza o **date-fns** para funcionalidades avançadas de manipulação de datas:

- **Criação automática de cards**: Para fluxos semanais/mensais, o sistema gera automaticamente todos os cards necessários
- **Cálculo inteligente de recorrência**: Adição automática de semanas/meses baseado na data de início
- **Formatação brasileira**: Suporte completo ao português brasileiro para datas e meses
- **Resolução de problemas de UTC**: Tratamento correto de fuso horário para evitar "dia anterior"
- **Agrupamento por período**: Organização automática de fluxos por semana/mês

### Exemplos de uso:
- **Fluxo semanal (4 parcelas)**: Sistema cria 4 cards (uma para cada semana)
- **Fluxo mensal (3 parcelas)**: Sistema cria 3 cards (uma para cada mês)
- **Formatação**: Datas exibidas como "26/09/2025" e meses como "setembro 2025"

## 🔐 Sistema de Autenticação (Firebase)

O projeto utiliza **Firebase Authentication** e **Firestore** para gerenciamento completo de usuários:

### **src/lib/firebase.ts**
Configuração centralizada do Firebase:
- **Inicialização**: Setup do app Firebase com configurações do projeto
- **Autenticação**: Configuração do serviço de autenticação
- **Firestore**: Configuração do banco de dados em tempo real
- **Exportações**: Disponibilização dos serviços para toda a aplicação

### **src/contexts/AuthContext.tsx**
Contexto React para gerenciamento de autenticação:
- **Estados**: `user`, `loading` para controle de sessão
- **Métodos de login**: Email/senha e Google OAuth
- **Cadastro**: Criação de usuários com dados adicionais no Firestore
- **Logout**: Encerramento seguro de sessão
- **Persistência**: Manutenção automática do estado de login
- **Otimizações**: useCallback e useMemo para performance

### **Funcionalidades de Autenticação**
- ✅ **Login com email/senha**: Autenticação tradicional
- ✅ **Login com Google**: OAuth integrado
- ✅ **Cadastro completo**: Dados pessoais + tipo de usuário + ramo
- ✅ **Validação de formulários**: Campos obrigatórios e formatos
- ✅ **Mensagens de erro**: Feedback em português brasileiro
- ✅ **Redirecionamento automático**: Baseado no estado de autenticação
- ✅ **Proteção de rotas**: Dashboard protegido para usuários logados

### **Configuração Inicial**
Para configurar o Firebase no projeto:
1. **Consulte o arquivo**: `FIREBASE_SETUP_GUIDE.md`
2. **Siga o passo a passo** para criar projeto no Firebase Console
3. **Atualize as configurações** em `src/lib/firebase.ts`
4. **Configure Authentication** e **Firestore Database**
5. **Teste os fluxos** de login e cadastro

## 🚀 Como Executar

### **Pré-requisitos**
1. **Node.js** (versão 18 ou superior)
2. **Conta no Firebase** (Google)
3. **Git** (para clonar o repositório)

### **Configuração Inicial**

```bash
# 1. Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd commish

# 2. Instalar dependências
npm install

# 3. Configurar Firebase (OBRIGATÓRIO)
# - Consulte FIREBASE_SETUP_GUIDE.md
# - Configure src/lib/firebase.ts com suas credenciais
```

### **Executar o Projeto**

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start

# Limpar cache (se necessário)
npm run clean

# Executar com limpeza automática
npm run dev:clean
```

**Acesse**: [http://localhost:3000](http://localhost:3000)

### **Scripts Disponíveis**
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Executar build de produção
- `npm run lint` - Verificar código com ESLint
- `npm run clean` - Limpar cache e arquivos temporários
- `npm run dev:clean` - Limpar cache e executar em desenvolvimento
- `npm run kill` - Matar processos Node.js travados

## 🔧 Integração com Firebase

### **Serviços Utilizados**
- **Firebase Authentication**: Gerenciamento de usuários e sessões
- **Cloud Firestore**: Banco de dados em tempo real
- **Google OAuth**: Login social integrado

### **Estrutura de Dados**

#### **Coleção: users**
```typescript
// Documento por usuário (ID = uid do Firebase Auth)
{
  uid: string;
  email: string;
  nome: string;
  cpf: string;
  tipo: 'vendedor' | 'empresa';
  ramo: string;
  createdAt: string;
  updatedAt: string;
}
```

#### **Coleção: fluxos** 
```typescript
// Documentos de fluxos de comissão
{
  id: string;
  userId: string;
  cnpj: string;
  razaoSocial: string;
  valor: number;
  recorrencia: 'semanal' | 'mensal';
  parcelas: number;
  dataInicio: string;
  dataFim: string;
  cor: string;
  documentos: string[];
  createdAt: string;
  updatedAt: string;
}
```

### **Funcionalidades Implementadas**
- ✅ **Autenticação completa** com Firebase Auth
- ✅ **Cadastro de usuários** com dados adicionais
- ✅ **Login social** com Google OAuth
- ✅ **Persistência de sessão** automática
- ✅ **Validação de rotas** protegidas
- ✅ **Mensagens de erro** em português
- ✅ **Gestão de fluxos** de comissão

### **Funcionalidades Futuras**
- 🔄 **Upload de documentos** para Cloud Storage
- 🔄 **Notificações** com Firebase Cloud Messaging
- 🔄 **Analytics** com Firebase Analytics


