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
│   │   ├── fluxo-new-modal.tsx        # Modal para criar novo fluxo
│   │   └── fluxo-details-modal.tsx    # Modal para exibir detalhes do fluxo
│   └── ui/               # Componentes base (botões, inputs, etc.)
├── constants/            # Dados mockados e constantes da aplicação
├── lib/                  # Utilitários e funções auxiliares
│   └── dateUtils.ts      # Utilitários para manipulação de datas com date-fns
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
- **date-fns** - Biblioteca moderna para manipulação de datas
- **Lucide React** - Ícones modernos

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


