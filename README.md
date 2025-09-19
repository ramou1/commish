# Commish - Sistema de Gestão de Comissões

Sistema web para gestão e acompanhamento de fluxos de comissão, permitindo que vendedores e empresas organizem seus recebimentos de forma inteligente e antecipem valores com taxas transparentes.

## 🚀 Funcionalidades Principais

- **Gestão de Comissões**: Organize e acompanhe todos os fluxos de comissão em uma agenda visual
- **Antecipação Inteligente**: Antecipe recebimentos com as melhores taxas do mercado
- **Dashboard Completo**: Visualize performance e planeje crescimento
- **Autenticação Segura**: Sistema de login e cadastro com validação completa
- **Interface Intuitiva**: Design moderno e responsivo para melhor experiência

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                  # Páginas e rotas da aplicação Next.js
│   ├── (auth)/           # Páginas de autenticação (login/cadastro)
│   └── (dashboard)/      # Páginas do dashboard principal
├── components/           # Componentes reutilizáveis da UI
│   ├── modals/           # Componentes de modal (formulários)
│   └── ui/               # Componentes base (botões, inputs, etc.)
├── constants/            # Dados mockados e constantes da aplicação
├── lib/                  # Utilitários e funções auxiliares
└── types/                # Definições de interfaces
```

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
- **Lucide React** - Ícones modernos

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## 📡 APIs Necessárias

### Autenticação
- `POST /api/auth/login` - Autenticação de usuário
- `POST /api/auth/register` - Cadastro de novo usuário
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/auth/me` - Obter dados do usuário logado

### Fluxos de Comissão
- `GET /api/fluxos` - Listar fluxos do usuário
- `POST /api/fluxos` - Criar novo fluxo de comissão
- `PUT /api/fluxos/:id` - Atualizar fluxo existente
- `DELETE /api/fluxos/:id` - Excluir fluxo
- `GET /api/fluxos/:id` - Obter detalhes de um fluxo

### Antecipação
- `POST /api/antecipacao/simular` - Simular antecipação de comissão
- `POST /api/antecipacao/solicitar` - Solicitar antecipação
- `GET /api/antecipacao/historico` - Histórico de antecipações

### Relatórios
- `GET /api/relatorios/dashboard` - Dados para dashboard
- `GET /api/relatorios/performance` - Relatório de performance
- `GET /api/relatorios/exportar` - Exportar relatórios

### Configurações
- `GET /api/configuracoes/ramos` - Listar ramos de atividade
- `PUT /api/configuracoes/perfil` - Atualizar perfil do usuário
- `POST /api/upload/documento` - Upload de documentos


