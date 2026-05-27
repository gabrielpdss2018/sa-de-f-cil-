# Saude Facil - Documento Final Consolidado (V10.0)

**Projeto:** Saude Facil  
**Versao da entrega:** 10.0 (Final)  
**Status do Sistema:** Funcional, Integrado e Pronto para Deploy

---

## 1. Arquitetura Final

O sistema **Saude Facil** adota uma arquitetura cliente-servidor (Client-Server), separando o frontend e o backend para garantir escalabilidade, seguranca e manutencao facilitada.

### 1.1 Backend (API REST)
- **Plataforma:** Node.js com Express e TypeScript.
- **Banco de Dados:** PostgreSQL relacional.
- **ORM:** Prisma para modelagem, migracoes (migrations) e queries tipadas.
- **Segurança:** 
  - JWT (JSON Web Tokens) para autenticacao.
  - Middlewares de autorizacao RBAC para controle de acesso por perfil (`UC`, `UP`, `UE`, `UA`).
- **Arquitetura de Codigo:** MVC (Model-View-Controller) adaptado com Services:
  - `Routes`: Definem os endpoints.
  - `Controllers`: Interceptam requisicoes e lidam com respostas HTTP.
  - `Services`: Concentram as regras de negocio e operacoes de banco de dados.

### 1.2 Frontend (SPA)
- **Plataforma:** React.js com TypeScript e Vite.
- **Roteamento:** React Router DOM para navegacao Single Page Application.
- **Estado Global:** Context API (`AuthContext`) para gerenciar sessao e perfil do usuario logado.
- **Estilizacao:** Tailwind CSS combinado com componentes da biblioteca `shadcn/ui` para garantir responsividade e consistencia visual.
- **Comunicacao:** Axios com interceptores para injeção automatica do token JWT.

---

## 2. Modelo de Dados Final

O modelo de dados no banco PostgreSQL (via Prisma) consolida os relacionamentos entre os atores da plataforma:

1. **User (Usuario):** Centraliza autenticacao (e-mail/senha) e o nivel de acesso (`role`). Pode ser paciente (`UC`), gestor de clinica (`UP`), gestor empresarial (`UE`) ou administrador (`UA`). Contém dados como CPF, telefone e endereço completo.
2. **Organization (Organização):** Representa redes empresariais que detem multiplas unidades/instituicoes de saude. Relacionada a usuarios do perfil `UE`.
3. **Institution (Instituicao):** Representa a clinica, laboratorio ou hospital. Possui endereco proprio, avaliacoes e especialidades, e e gerenciada por um usuario `UP`.
4. **Service (Servico):** Consultas e exames atrelados a uma instituicao, definindo preco, duracao e tipo.
5. **TimeSlot & Availability:** Definem os horarios de funcionamento da instituicao e as janelas (slots) disponiveis para servicos especificos.
6. **Appointment (Agendamento):** O vinculo transacional principal. Conecta o Paciente (`User`), a Clinica (`Institution`) e o Exame/Consulta (`Service`), registrando data, hora e status (`agendado`, `concluido`, `cancelado`).

---

## 3. Descrição da API

A API REST do Saude Facil e totalmente funcional e testada (100% de passagem nos 27 testes automatizados de backend). Segue os padroes RESTful e retorna respostas em formato JSON.

### Modulos Principais
- **`/auth` (Publico):** Login (`POST /auth/login`) e Registro (`POST /auth/register`).
- **`/users` (Protegido):** Consulta e atualizacao do proprio perfil.
- **`/institutions`:** 
  - GET publico para pacientes listarem clinicas.
  - POST/PATCH protegidos para `UP` e `UA` gerenciarem suas unidades e estatisticas.
- **`/services`:** Endpoints para criacao e edicao de consultas/exames.
- **`/appointments`:** 
  - `POST /appointments` para o paciente (`UC`) agendar um servico.
  - Endpoints administrativos para atualizar status.
- **`/enterprise`:** Rotas restritas aos gestores (`UE`, `UA`) para visao de rede de clinicas.
- **`/admin`:** Rotas globais restritas aos administradores (`UA`).

---

## 4. Descrição do Admin (UA - Usuário Administrador)

O modulo de administracao garante a governanca de toda a plataforma Saude Facil. Seu acesso e rigorosamente restrito pela rota `/admin` e por middlewares que exigem o perfil `UA`.

### Funcionalidades do Admin
1. **Dashboard de Estatisticas Globais:** Visualizacao da contagem total de usuarios, clinicas ativas, volume de agendamentos agendados/concluidos e calculo consolidado da receita financeira gerada na plataforma (`GET /admin/stats`).
2. **Gestao de Usuarios:**
   - Listagem completa (`GET /admin/users`).
   - Ativacao e desativacao de contas (`PATCH /admin/users/:id/status`) permitindo banir usuarios fraudulentos sem perder o historico do banco (Soft Delete lógico).
   - Delecao fisica definitiva (`DELETE /admin/users/:id`).
3. **Gestao de Instituicoes:** Visibilidade completa e delecao de clinicas da plataforma, caso violem os termos de uso.

O frontend consome essas rotas na interface `DashboardUA.tsx` e `GestaoUsuariosUA.tsx`, permitindo acoes atraves de uma interface interativa e segura.

---

## 5. Métricas Finais

O sistema incorpora calculo analitico (BI) em tempo real, suportando metricas consolidadas:

- **Metricadas Locais (Clinicas - UP):**
  - Contagem de Agendamentos Mensais e Totais.
  - Contagem por Status (Concluido, Cancelado, Agendado).
  - Receita financeira Mensal e Anual baseada em exames concluidos.
- **Metricadas Corporativas (Empresas - UE):**
  - Soma total de receita e volume de pacientes atendidos em toda a rede de clinicas vinculadas ao mesmo CNPJ base.
- **Metricadas Globais (Admin - UA):**
  - Volume financeiro transacionado por todo o ecossistema.
  - Taxa de conversao de agendamentos agendados vs concluidos.

---

## 6. Fluxo Completo do Sistema

Para entender o ecosistema funcionando perfeitamente integrado:

1. **Abertura:** O visitante acessa a pagina inicial (Landing Page) construida em React, visualizando as clinicas e exames em destaque.
2. **Cadastro/Login:** O cidadao se cadastra na plataforma gerando um perfil de Usuário Comum (`UC`).
3. **Busca e Agendamento:** O paciente procura pela especialidade desejada, seleciona a clinica, a data e o servico (consumindo a rota publica `GET /institutions`). Ao confirmar, o frontend envia uma solicitacao autenticada para `POST /appointments`.
4. **Gestao da Clinica:** O gestor da clinica, com perfil Profissional (`UP`), realiza login e visualiza em seu Dashboard `DashboardUP.tsx` o novo agendamento. Ele pode alterar o status do agendamento para `concluido` quando o paciente for atendido.
5. **Faturamento:** Imediatamente, a API consolida o valor daquele exame nas estatisticas mensais da clinica.
6. **Administracao Global:** O Administrador (`UA`) em sua tela acessa o relatorio global e observa o crescimento nas vendas totais da plataforma, podendo gerir qualquer ator em caso de suporte.

---

## 7. Instruções de Execução e Deploy

O sistema possui uma estrutura consolidada e pode ser executado em um comando na maquina local, provando sua completa integracao Front-to-Back.

### 7.1 Requisitos
- Node.js (v18+)
- PostgreSQL rodando localmente na porta 5432 (ou atualizar o URL no `.env`)

### 7.2 Executando Localmente (Integracao Completa)
Na raiz do projeto (`/saude-facil-site`), execute:

```bash
# 1. Instalar todas as dependencias (Frontend e Backend)
npm run install:all

# 2. Configurar as Variaveis de Ambiente
# No backend (saude-facil-backend/.env)
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/saude_facil?schema=public"
JWT_SECRET="sua_chave_secreta"
PORT=3001

# 3. Rodar as Migrations e popular o banco inicial
npm run seed

# 4. Iniciar o projeto simultaneamente (API no :3001 e Front no :5173)
npm run dev
```

### 7.3 Instruções para Deploy em Produção
O projeto esta estruturado para pipelines CI/CD simples.

- **Banco de Dados:** Deploy recomendado via Railway, Supabase ou AWS RDS.
- **Backend (API):**
  - Fazer build: `cd saude-facil-backend && npm run build`
  - Iniciar script: `node dist/index.js`
  - Hospedagem recomendada: Render, Vercel ou AWS EC2.
- **Frontend (SPA):**
  - Fazer build: `cd saude-facil-front-end && npm run build`
  - Os arquivos estaticos vao para a pasta `dist`.
  - Hospedagem recomendada: Vercel, Netlify ou AWS S3+CloudFront.

---

## 8. Conclusão da Validação Integrada

O projeto cumpriu todas as etapas exigidas na validacao ponta a ponta:
- Backend totalmente coberto por testes.
- Builds executando com sucesso: `tsc` no backend e `vite build` no frontend não retornam erros.
- Os perfis de acesso funcionam com bloqueios reais usando Tokens JWT.
- A interface de usuario responde condicionalmente aos perfis.

Com isso, entregamos o documento final (V10.0), comprovando a integracao completa, o preparo para deploy, a solidez da arquitetura de software e o atendimento as regras de negocio do ecossistema de saude.
