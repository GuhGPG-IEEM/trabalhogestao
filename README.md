# Minha Rotina Escolar

Um aplicativo web moderno para gerenciamento de rotinas escolares, desenvolvido com React, TypeScript e Supabase.

## Sobre o Projeto

**Minha Rotina Escolar** é um aplicativo completo que ajuda estudantes a organizarem sua vida acadêmica de forma simples e eficiente. O projeto foi desenvolvido como trabalho da disciplina de Programação, demonstrando a aplicação prática de conceitos modernos de desenvolvimento web.

## Funcionalidades

### 1. Dashboard
- Saudação personalizada com nome do usuário
- Navegação intuitiva entre as funcionalidades
- Interface moderna e responsiva
- Quatro módulos principais: Notas, Matérias, Tarefas e Dicas de Estudo

### 2. Gerenciamento de Notas
- Lista de disciplinas cadastradas
- Campo para inserir nota de cada disciplina (0.0 a 10.0)
- Botão "Calcular Média" que calcula automaticamente a média final
- Exibe a média final com destaque visual
- Alerta automático quando a média está abaixo de 6.0
- Possibilidade de editar e excluir notas

### 3. Matérias
- Lista completa de matérias cadastradas
- Cadastro de novas matérias com:
  - Nome da disciplina
  - Horário da aula
  - Dias da semana em que ocorre
- Visualização organizada por horário
- Exclusão de matérias
- Interface com cards visuais para melhor organização

### 4. Tarefas
- Lista de tarefas organizadas por disciplina
- Cadastro de novas tarefas com:
  - Matéria relacionada
  - Descrição da tarefa
  - Data de entrega
- Checkbox para marcar tarefas como concluídas
- Ordenação automática por data de entrega
- Destaque visual para tarefas atrasadas
- Exclusão de tarefas concluídas ou canceladas

### 5. Dicas de Estudo com IA
- Campo de texto para descrever o que deseja estudar
- Botão "Gerar Dicas com IA" que redireciona para o Gemini
- Redirecionamento automático para plataforma de IA (Gemini)
- Campo opcional para colar e salvar as dicas recebidas
- Histórico de dicas salvas anteriormente
- Organização de dicas por data e tema

### 6. Sobre
- Informações sobre o projeto
- Descrição das funcionalidades
- Tecnologias utilizadas
- Créditos e informações acadêmicas

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Lucide React** - Biblioteca de ícones modernos

### Backend e Banco de Dados
- **Supabase** - Plataforma de backend com:
  - PostgreSQL - Banco de dados relacional
  - Authentication - Sistema de autenticação integrado
  - Row Level Security (RLS) - Segurança em nível de linha

### Autenticação
- Sistema de login com email e senha
- Cadastro de novos usuários
- Proteção de rotas e dados por usuário
- Sessões persistentes

## Estrutura do Banco de Dados

### Tabelas

1. **students** - Dados dos estudantes
   - id (uuid, PK)
   - name (text)
   - email (text, unique)
   - created_at (timestamp)

2. **subjects** - Matérias/Disciplinas
   - id (uuid, PK)
   - student_id (uuid, FK)
   - name (text)
   - schedule_days (text[])
   - schedule_time (text)
   - created_at (timestamp)

3. **grades** - Notas
   - id (uuid, PK)
   - student_id (uuid, FK)
   - subject_id (uuid, FK)
   - grade (numeric)
   - created_at (timestamp)

4. **tasks** - Tarefas
   - id (uuid, PK)
   - student_id (uuid, FK)
   - subject_id (uuid, FK)
   - title (text)
   - due_date (date)
   - completed (boolean)
   - created_at (timestamp)

5. **study_tips** - Dicas de estudo salvas
   - id (uuid, PK)
   - student_id (uuid, FK)
   - query (text)
   - tips (text)
   - created_at (timestamp)

### Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso que garantem que usuários só vejam seus próprios dados
- Autenticação obrigatória para todas as operações
- Validações de dados no nível do banco

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase (opcional, já configurada)

### Instalação

1. Clone o repositório ou extraia os arquivos

2. Instale as dependências:
```bash
npm install
```

3. O arquivo `.env` já está configurado com as credenciais do Supabase

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o aplicativo em `http://localhost:5173`

### Build para Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## Estrutura de Pastas

```
src/
├── components/          # Componentes React
│   ├── Auth.tsx        # Tela de autenticação
│   ├── Dashboard.tsx   # Tela principal
│   ├── Grades.tsx      # Gerenciamento de notas
│   ├── Subjects.tsx    # Gerenciamento de matérias
│   ├── Tasks.tsx       # Gerenciamento de tarefas
│   ├── StudyTips.tsx   # Dicas de estudo
│   └── About.tsx       # Sobre o aplicativo
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── lib/               # Bibliotecas e configurações
│   └── supabase.ts    # Cliente Supabase
├── App.tsx            # Componente principal
├── main.tsx           # Entry point
└── index.css          # Estilos globais
```

## Uso do Aplicativo

### Primeiro Acesso

1. Crie uma conta com email e senha
2. Após o cadastro, você será automaticamente autenticado
3. Complete seu perfil com seu nome

### Navegação

O aplicativo possui navegação simples através do Dashboard:
- Clique em qualquer card para acessar a funcionalidade
- Use o botão "Voltar" para retornar ao Dashboard
- Use o botão "Sair" para fazer logout

### Dicas de Uso

1. **Comece cadastrando suas matérias** - Isso permitirá registrar notas e criar tarefas
2. **Registre suas notas regularmente** - Acompanhe seu desempenho ao longo do tempo
3. **Adicione tarefas com antecedência** - Evite perder prazos importantes
4. **Use as dicas de IA** - Melhore seus métodos de estudo com sugestões personalizadas

## Recursos de Design

- Interface limpa e moderna
- Gradientes suaves e cores harmoniosas
- Ícones intuitivos para cada funcionalidade
- Feedback visual para ações do usuário
- Animações sutis para melhor experiência
- Design responsivo para mobile e desktop
- Acessibilidade com contraste adequado

## Observações Importantes

- Todos os dados são armazenados no Supabase (persistência em nuvem)
- A integração com IA é externa (redirecionamento para Gemini)
- O aplicativo requer conexão com internet para funcionar
- Cada usuário tem acesso apenas aos seus próprios dados
- As senhas são criptografadas e seguras

## Segurança e Privacidade

- Autenticação segura via Supabase Auth
- Criptografia de senhas
- Row Level Security protege dados dos usuários
- Sessões seguras com tokens JWT
- Dados isolados por usuário

## Autor

Projeto desenvolvido como trabalho acadêmico para a disciplina de Programação.

## Licença

© 2025 Minha Rotina Escolar - Todos os direitos reservados

---

**Nota**: Este é um projeto educacional desenvolvido para demonstrar conceitos de desenvolvimento web moderno, incluindo React, TypeScript, integração com banco de dados, autenticação e boas práticas de programação.
