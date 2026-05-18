# Saúde Fácil - Sistema de Agendamento de Saúde Integrado

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/gabrielpdss2018/sa-de-f-cil)

O **Saúde Fácil** é uma plataforma completa para gestão e agendamento de serviços de saúde, conectando Cidadãos, Clínicas/Laboratórios e Empresas em um ecossistema unificado.

## 🚀 Estrutura do Projeto

O sistema é dividido em dois módulos principais:

- **`saude-facil-backend/`**: API REST robusta desenvolvida com Node.js, Express e Prisma ORM.
- **`saude-facil-front-end/`**: Interface moderna e reativa construída com React, TypeScript, Vite e TailwindCSS v4.

---

## ✨ Funcionalidades Principais

### 👤 Perfil: Cidadão (UC)
- Busca inteligente de serviços e instituições.
- Agendamento de consultas com calendário interativo.
- Histórico de atendimentos e gestão de perfil.

### 🏥 Perfil: Instituição / Clínica (UP)
- Gestão completa de agenda e serviços.
- Dashboard de faturamento e métricas de atendimento.
- Controle de pacientes e horários de funcionamento.

### 🏢 Perfil: Gestor Empresarial (UE)
- Visão consolidada de múltiplas unidades de saúde.
- Relatórios agregados de desempenho e receita.
- Gestão de equipe e unidades vinculadas.

### 🛡️ Perfil: Administrador Global (UA)
- Painel de controle macro com KPIs estratégicos.
- Auditoria de usuários e instituições em toda a plataforma.
- Monitoramento de saúde do sistema e segurança.

---

## 🛠️ Tecnologias Utilizadas

**Back-end:**
- Node.js & Express
- Prisma ORM (PostgreSQL)
- JWT (Autenticação) & Bcrypt (Criptografia)
- Zod (Validação de dados)

**Front-end:**
- React 18 & TypeScript
- Vite
- TailwindCSS v4
- Axios
- Lucide React (Ícones)
- Sonner (Notificações)

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL

### 1. Configuração do Backend
Navegue até `saude-facil-backend/`, renomeie o `.env.example` (se disponível) ou configure seu `.env`:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/saude_facil?schema=public"
JWT_SECRET="sua_chave_secreta"
```

### 2. Instalação e Preparação
Na pasta raiz do projeto, execute:
```bash
# Instalar todas as dependências (Root, Backend e Frontend)
npm run install:all

# Sincronizar banco de dados e popular com dados de teste
npm run seed
```

### 3. Execução
Na pasta raiz, inicie ambos os servidores simultaneamente:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 👥 Credenciais de Teste (Senha: 123456)
- **Admin:** `admin@saudefacil.com`
- **Empresa:** `ana@empresa.com`
- **Instituição:** `joao@clinica.com`
- **Paciente:** `maria@email.com`

---
*Desenvolvido como parte do projeto de Desenvolvimento de Sistemas Web.*
