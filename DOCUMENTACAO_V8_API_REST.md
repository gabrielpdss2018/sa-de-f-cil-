# Saude Facil - Documento Incremental 8.0

## API REST Estruturada e Documentada

**Projeto:** Saude Facil  
**Modulo documentado:** Backend / API REST  
**Versao da entrega:** 8.0  
**Base URL local:** `http://localhost:3001`  
**Formato de dados:** JSON  

---

## 1. Objetivo

Implementar e documentar a API REST do sistema **Saude Facil**, apresentando os endpoints disponiveis, os padroes HTTP utilizados, exemplos de request/response, evidencias de uso no Postman/Swagger e a comprovacao de que a API esta funcional.

Esta entrega contempla:

- Lista de endpoints.
- Padroes HTTP utilizados.
- Prints do Swagger/Postman.
- Exemplos de request/response.
- API funcional.

---

## 2. Visao Geral da API

A API do Saude Facil foi desenvolvida em **Node.js**, utilizando **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**.

Ela segue uma organizacao por dominios, separando as responsabilidades em rotas, controllers, services e acesso a dados.

### 2.1 Principais Modulos

| Modulo | Prefixo | Responsabilidade |
| --- | --- | --- |
| Autenticacao | `/auth` | Cadastro, login e recuperacao de senha |
| Usuarios | `/users` | Perfil do usuario autenticado |
| Instituicoes | `/institutions` | Busca, cadastro, edicao, disponibilidade e metricas de instituicoes |
| Servicos | `/services` | Cadastro, consulta, edicao e exclusao de servicos |
| Agendamentos | `/appointments` | Criacao, consulta e alteracao de status de agendamentos |
| Administracao | `/admin` | Gestao global de usuarios, instituicoes e metricas |
| Empresas | `/enterprise` | Visao consolidada de unidades, usuarios, agendamentos e estatisticas |

---

## 3. Padroes HTTP Utilizados

### 3.1 Metodos HTTP

| Metodo | Uso na API | Exemplo |
| --- | --- | --- |
| `GET` | Consulta de dados | `GET /institutions` |
| `POST` | Criacao de recurso ou execucao de acao | `POST /auth/login` |
| `PATCH` | Atualizacao parcial de recurso | `PATCH /users/profile` |
| `DELETE` | Exclusao de recurso | `DELETE /services/:id` |

### 3.2 Codigos de Status

| Status | Significado | Uso na API |
| --- | --- | --- |
| `200 OK` | Requisicao executada com sucesso | Login, consultas e atualizacoes |
| `201 Created` | Recurso criado com sucesso | Cadastro, criacao de instituicao, servico ou agendamento |
| `204 No Content` | Exclusao sem corpo de resposta | Exclusao de servico |
| `400 Bad Request` | Dados invalidos ou erro de regra de negocio | Cadastro, atualizacao e recuperacao de senha |
| `401 Unauthorized` | Usuario nao autenticado ou token invalido | Rotas protegidas sem token |
| `403 Forbidden` | Usuario autenticado sem permissao | Acesso por perfil incorreto |
| `404 Not Found` | Recurso nao encontrado | Usuario, instituicao ou servico inexistente |
| `500 Internal Server Error` | Erro interno no servidor | Falhas inesperadas |

### 3.3 Padrao de Autenticacao

As rotas protegidas utilizam token JWT no cabecalho `Authorization`.

Formato:

```http
Authorization: Bearer <token>
```

Exemplo:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.4 Padrao de Resposta de Erro

As respostas de erro seguem o padrao:

```json
{
  "error": "Mensagem de erro"
}
```

Exemplo:

```json
{
  "error": "Token invalido"
}
```

---

## 4. Organizacao do Codigo da API

A API esta organizada em camadas:

```text
saude-facil-backend/
  src/
    controllers/
    middlewares/
    routes/
    services/
    utils/
```

### 4.1 Routes

Os arquivos de rotas definem os endpoints e aplicam middlewares de autenticacao/autorizacao.

Exemplos:

- `src/routes/auth.routes.ts`
- `src/routes/appointment.routes.ts`
- `src/routes/admin.routes.ts`
- `src/routes/service.routes.ts`

### 4.2 Controllers

Os controllers recebem a requisicao HTTP, chamam os services e retornam a resposta adequada.

Exemplos:

- `src/controllers/AuthController.ts`
- `src/controllers/AppointmentController.ts`
- `src/controllers/AdminController.ts`

### 4.3 Services

Os services concentram as regras de negocio.

Exemplos:

- `src/services/AuthService.ts`
- `src/services/AppointmentService.ts`
- `src/services/ServiceService.ts`

### 4.4 Middlewares

Os middlewares protegem rotas e controlam permissoes.

Arquivo principal:

- `src/middlewares/auth.ts`

Responsabilidades:

- Validar token JWT.
- Popular `req.user`.
- Bloquear usuarios sem permissao de perfil.

---

## 5. Lista de Endpoints

### 5.1 Health Check

| Metodo | Endpoint | Autenticacao | Descricao |
| --- | --- | --- | --- |
| `GET` | `/` | Nao | Verifica se a API esta em execucao |

### 5.2 Autenticacao

| Metodo | Endpoint | Autenticacao | Descricao |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Nao | Cadastra um novo usuario |
| `POST` | `/auth/login` | Nao | Autentica usuario e retorna token JWT |
| `POST` | `/auth/forgot-password` | Nao | Solicita recuperacao de senha |
| `POST` | `/auth/reset-password` | Nao | Redefine senha usando token |

### 5.3 Usuarios

| Metodo | Endpoint | Autenticacao | Descricao |
| --- | --- | --- | --- |
| `GET` | `/users/profile` | Sim | Retorna perfil do usuario autenticado |
| `PATCH` | `/users/profile` | Sim | Atualiza perfil do usuario autenticado |

### 5.4 Instituicoes

| Metodo | Endpoint | Autenticacao | Perfil | Descricao |
| --- | --- | --- | --- | --- |
| `GET` | `/institutions` | Nao | Publico | Lista instituicoes |
| `GET` | `/institutions/:id` | Nao | Publico | Busca instituicao por ID |
| `POST` | `/institutions` | Sim | `UP`, `UA` | Cria instituicao |
| `PATCH` | `/institutions/:id` | Sim | `UP`, `UA` | Atualiza instituicao |
| `GET` | `/institutions/:id/stats` | Sim | `UP`, `UE`, `UA` | Retorna estatisticas da instituicao |
| `GET` | `/institutions/:id/availability` | Sim | `UP`, `UA` | Consulta disponibilidade |
| `POST` | `/institutions/:id/availability` | Sim | `UP`, `UA` | Salva disponibilidade |

### 5.5 Servicos

| Metodo | Endpoint | Autenticacao | Perfil | Descricao |
| --- | --- | --- | --- | --- |
| `GET` | `/services/:id` | Nao | Publico | Busca servico por ID |
| `GET` | `/services/institution/:institutionId` | Nao | Publico | Lista servicos de uma instituicao |
| `POST` | `/services` | Sim | `UP`, `UA` | Cria servico |
| `PATCH` | `/services/:id` | Sim | `UP`, `UA` | Atualiza servico |
| `DELETE` | `/services/:id` | Sim | `UP`, `UA` | Remove servico |

### 5.6 Agendamentos

| Metodo | Endpoint | Autenticacao | Perfil | Descricao |
| --- | --- | --- | --- | --- |
| `POST` | `/appointments` | Sim | `UC` | Cria agendamento |
| `GET` | `/appointments/my` | Sim | `UC` | Lista agendamentos do paciente autenticado |
| `GET` | `/appointments/institution/:institutionId` | Sim | `UP`, `UE`, `UA` | Lista agendamentos de uma instituicao |
| `PATCH` | `/appointments/:id/status` | Sim | `UC`, `UP`, `UA` | Atualiza status do agendamento |

### 5.7 Administracao

Todas as rotas administrativas exigem token JWT e perfil `UA`.

| Metodo | Endpoint | Autenticacao | Perfil | Descricao |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/users` | Sim | `UA` | Lista usuarios |
| `GET` | `/admin/users/:id` | Sim | `UA` | Busca usuario por ID |
| `PATCH` | `/admin/users/:id/status` | Sim | `UA` | Ativa ou desativa usuario |
| `DELETE` | `/admin/users/:id` | Sim | `UA` | Exclui usuario |
| `GET` | `/admin/institutions` | Sim | `UA` | Lista instituicoes |
| `DELETE` | `/admin/institutions/:id` | Sim | `UA` | Exclui instituicao |
| `GET` | `/admin/stats` | Sim | `UA` | Retorna estatisticas globais |

### 5.8 Empresas

Todas as rotas empresariais exigem token JWT e perfil `UE`.

| Metodo | Endpoint | Autenticacao | Perfil | Descricao |
| --- | --- | --- | --- | --- |
| `GET` | `/enterprise/units` | Sim | `UE` | Lista unidades vinculadas a organizacao |
| `GET` | `/enterprise/appointments` | Sim | `UE` | Lista agendamentos consolidados |
| `GET` | `/enterprise/users` | Sim | `UE` | Lista usuarios vinculados |
| `GET` | `/enterprise/stats` | Sim | `UE` | Retorna estatisticas consolidadas |

---

## 6. Exemplos de Request e Response

### 6.1 Health Check

**Request**

```http
GET / HTTP/1.1
Host: localhost:3001
```

**Response 200**

```text
Saude Facil API is running!
```

### 6.2 Cadastro de Usuario

**Endpoint**

```http
POST /auth/register
```

**Request**

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456",
  "role": "UC",
  "cpf": "12345678900",
  "phone": "(65) 99999-0000",
  "cep": "78000-000",
  "street": "Rua A",
  "number": "100",
  "neighborhood": "Centro",
  "city": "Cuiaba",
  "state": "MT"
}
```

**Response 201**

```json
{
  "id": "user-1",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "role": "UC",
  "active": true
}
```

### 6.3 Login

**Endpoint**

```http
POST /auth/login
```

**Request**

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

**Response 200**

```json
{
  "user": {
    "id": "user-1",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "UC",
    "active": true
  },
  "token": "jwt.token.exemplo"
}
```

### 6.4 Consultar Perfil

**Endpoint**

```http
GET /users/profile
```

**Headers**

```http
Authorization: Bearer jwt.token.exemplo
```

**Response 200**

```json
{
  "id": "user-1",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "role": "UC",
  "phone": "(65) 99999-0000"
}
```

### 6.5 Atualizar Perfil

**Endpoint**

```http
PATCH /users/profile
```

**Headers**

```http
Authorization: Bearer jwt.token.exemplo
```

**Request**

```json
{
  "name": "Maria Souza",
  "phone": "(65) 98888-0000"
}
```

**Response 200**

```json
{
  "id": "user-1",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "role": "UC",
  "phone": "(65) 98888-0000"
}
```

### 6.6 Listar Instituicoes

**Endpoint**

```http
GET /institutions
```

**Response 200**

```json
[
  {
    "id": "institution-1",
    "name": "Clinica Vida",
    "type": "clinica",
    "city": "Cuiaba",
    "state": "MT",
    "phone": "(65) 3333-0000"
  }
]
```

### 6.7 Criar Instituicao

**Endpoint**

```http
POST /institutions
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UP.ou.UA
```

**Request**

```json
{
  "name": "Clinica Vida",
  "cnpj": "12345678000199",
  "type": "clinica",
  "cep": "78000-000",
  "street": "Avenida Central",
  "number": "500",
  "neighborhood": "Centro",
  "city": "Cuiaba",
  "state": "MT",
  "phone": "(65) 3333-0000"
}
```

**Response 201**

```json
{
  "id": "institution-1",
  "name": "Clinica Vida",
  "cnpj": "12345678000199",
  "type": "clinica",
  "city": "Cuiaba",
  "state": "MT"
}
```

### 6.8 Criar Servico

**Endpoint**

```http
POST /services
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UP.ou.UA
```

**Request**

```json
{
  "name": "Consulta Clinica",
  "description": "Consulta medica geral",
  "price": 120,
  "duration": 30,
  "specialty": "Clinico Geral",
  "institutionId": "institution-1"
}
```

**Response 201**

```json
{
  "id": "service-1",
  "name": "Consulta Clinica",
  "price": 120,
  "duration": 30,
  "institutionId": "institution-1"
}
```

### 6.9 Listar Servicos de uma Instituicao

**Endpoint**

```http
GET /services/institution/institution-1
```

**Response 200**

```json
[
  {
    "id": "service-1",
    "name": "Consulta Clinica",
    "price": 120,
    "duration": 30,
    "_count": {
      "appointments": 4
    }
  }
]
```

### 6.10 Criar Agendamento

**Endpoint**

```http
POST /appointments
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UC
```

**Request**

```json
{
  "date": "2026-05-20",
  "time": "08:30",
  "institutionId": "institution-1",
  "serviceId": "service-1"
}
```

**Response 201**

```json
{
  "id": "appointment-1",
  "date": "2026-05-20T00:00:00.000Z",
  "time": "08:30",
  "status": "agendado",
  "patientId": "user-1",
  "institutionId": "institution-1",
  "serviceId": "service-1"
}
```

### 6.11 Listar Meus Agendamentos

**Endpoint**

```http
GET /appointments/my
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UC
```

**Response 200**

```json
[
  {
    "id": "appointment-1",
    "date": "2026-05-20T00:00:00.000Z",
    "time": "08:30",
    "status": "agendado",
    "institution": {
      "id": "institution-1",
      "name": "Clinica Vida"
    },
    "service": {
      "id": "service-1",
      "name": "Consulta Clinica"
    }
  }
]
```

### 6.12 Atualizar Status de Agendamento

**Endpoint**

```http
PATCH /appointments/appointment-1/status
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UC.UP.ou.UA
```

**Request**

```json
{
  "status": "concluido"
}
```

**Response 200**

```json
{
  "id": "appointment-1",
  "status": "concluido"
}
```

### 6.13 Listar Usuarios - Admin

**Endpoint**

```http
GET /admin/users
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UA
```

**Response 200**

```json
[
  {
    "id": "user-1",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "UC",
    "createdAt": "2026-05-18T00:00:00.000Z"
  }
]
```

### 6.14 Alternar Status do Usuario - Admin

**Endpoint**

```http
PATCH /admin/users/user-1/status
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UA
```

**Response 200**

```json
{
  "id": "user-1",
  "active": false
}
```

### 6.15 Estatisticas Globais - Admin

**Endpoint**

```http
GET /admin/stats
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UA
```

**Response 200**

```json
{
  "usersCount": 40,
  "institutionsCount": 8,
  "appointmentsCount": 120,
  "completedCount": 90,
  "revenue": {
    "monthly": 3500,
    "annual": 42000,
    "plansMonthly": 2196,
    "plansAnnual": 10980,
    "totalMonthly": 5696,
    "totalAnnual": 52980
  },
  "growthRate": 15
}
```

### 6.16 Dashboard Empresarial

**Endpoint**

```http
GET /enterprise/stats
```

**Headers**

```http
Authorization: Bearer jwt.token.perfil.UE
```

**Response 200**

```json
{
  "unitsCount": 3,
  "appointmentsCount": 50,
  "completedCount": 35,
  "monthlyRevenue": 6000
}
```

---

## 7. Evidencias com Postman ou Swagger

> Instrucao para o documento em Word/PDF: inserir os prints abaixo apos executar as requisicoes no Postman ou Swagger.

### 7.1 Print 1 - Health Check da API

**Requisicao:** `GET http://localhost:3001/`  
**Resultado esperado:** mensagem indicando que a API esta em execucao.

**Espaco para print:**

```text
[INSERIR PRINT DO POSTMAN/SWAGGER - GET /]
```

### 7.2 Print 2 - Login com Retorno de Token

**Requisicao:** `POST http://localhost:3001/auth/login`  
**Resultado esperado:** retorno do usuario autenticado e token JWT.

**Espaco para print:**

```text
[INSERIR PRINT DO POSTMAN/SWAGGER - POST /auth/login]
```

### 7.3 Print 3 - Rota Protegida com Bearer Token

**Requisicao:** `GET http://localhost:3001/users/profile`  
**Header:** `Authorization: Bearer <token>`  
**Resultado esperado:** retorno dos dados do usuario autenticado.

**Espaco para print:**

```text
[INSERIR PRINT DO POSTMAN/SWAGGER - GET /users/profile]
```

### 7.4 Print 4 - Criacao de Agendamento

**Requisicao:** `POST http://localhost:3001/appointments`  
**Header:** `Authorization: Bearer <token UC>`  
**Resultado esperado:** agendamento criado com status `agendado`.

**Espaco para print:**

```text
[INSERIR PRINT DO POSTMAN/SWAGGER - POST /appointments]
```

### 7.5 Print 5 - Listagem Administrativa

**Requisicao:** `GET http://localhost:3001/admin/users`  
**Header:** `Authorization: Bearer <token UA>`  
**Resultado esperado:** lista de usuarios cadastrados.

**Espaco para print:**

```text
[INSERIR PRINT DO POSTMAN/SWAGGER - GET /admin/users]
```

---

## 8. Como Executar a API

### 8.1 Instalar Dependencias

Na raiz do projeto:

```bash
npm install
npm run install:all
```

### 8.2 Configurar Variaveis de Ambiente

No backend, configurar o arquivo `.env` com:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/saude_facil?schema=public"
JWT_SECRET="sua_chave_secreta"
PORT=3001
```

### 8.3 Preparar Banco de Dados

Dentro da pasta `saude-facil-backend`:

```bash
npm.cmd run seed
```

### 8.4 Iniciar a API

Na raiz do projeto:

```bash
npm.cmd run dev
```

Ou somente o backend:

```bash
cd saude-facil-backend
npm.cmd run dev
```

API local:

```text
http://localhost:3001
```

---

## 9. API Funcional

A API pode ser validada com os seguintes passos:

1. Executar o backend localmente.
2. Acessar `GET http://localhost:3001/`.
3. Realizar login em `POST /auth/login`.
4. Copiar o token retornado.
5. Enviar o token no header `Authorization`.
6. Testar rotas protegidas como `/users/profile`, `/appointments/my` ou `/admin/users`.

### 9.1 Checklist Funcional

| Item | Status |
| --- | --- |
| API Express configurada | Implementado |
| Rotas separadas por dominio | Implementado |
| Controllers separados por responsabilidade | Implementado |
| Services com regras de negocio | Implementado |
| Autenticacao JWT | Implementado |
| Autorizacao por perfil | Implementado |
| Endpoints publicos e protegidos | Implementado |
| Respostas JSON | Implementado |
| Codigos HTTP adequados | Implementado |

---

## 10. Analise do Padrao REST

A API utiliza recursos nomeados no plural e separa operacoes por metodo HTTP.

Exemplos de padrao REST correto:

| Acao | Endpoint | Metodo |
| --- | --- | --- |
| Listar instituicoes | `/institutions` | `GET` |
| Criar instituicao | `/institutions` | `POST` |
| Buscar instituicao por ID | `/institutions/:id` | `GET` |
| Atualizar instituicao | `/institutions/:id` | `PATCH` |
| Listar agendamentos | `/appointments/my` | `GET` |
| Criar agendamento | `/appointments` | `POST` |
| Atualizar status | `/appointments/:id/status` | `PATCH` |
| Excluir servico | `/services/:id` | `DELETE` |

Tambem ha separacao de responsabilidades por perfil:

| Perfil | Permissoes principais |
| --- | --- |
| `UC` | Criar e consultar seus agendamentos |
| `UP` | Gerenciar instituicoes, servicos, agenda e disponibilidade |
| `UE` | Consultar visao consolidada empresarial |
| `UA` | Administrar usuarios, instituicoes e estatisticas globais |

---

## 11. Atendimento aos Criterios de Avaliacao

| Criterio | Evidencia no documento | Pontuacao esperada |
| --- | --- | --- |
| Padrao REST correto | Uso de `GET`, `POST`, `PATCH`, `DELETE`, recursos no plural e status HTTP adequados | 4,0 |
| Documentacao clara | Lista de endpoints, exemplos de request/response, autenticacao e erros documentados | 3,0 |
| Organizacao do codigo | Rotas, controllers, services e middlewares separados por responsabilidade | 3,0 |

---

## 12. Conclusao

A versao 8.0 documenta a API REST do Saude Facil de forma incremental, organizada e adequada para avaliacao.

Foram descritos:

- Endpoints disponiveis.
- Padroes HTTP utilizados.
- Autenticacao por JWT.
- Controle de acesso por perfil.
- Exemplos de request e response.
- Estrutura de codigo da API.
- Orientacao para prints no Postman/Swagger.
- Evidencia de API funcional.

Com isso, a entrega atende ao objetivo de implementar e documentar uma API REST estruturada para o fechamento da avaliacao.
