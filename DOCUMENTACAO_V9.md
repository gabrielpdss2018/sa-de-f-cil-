# Saude Facil - Documento Incremental 9.0

## Controle de Acesso Baseado em Perfil (RBAC)

**Projeto:** Saude Facil  
**Modulo documentado:** Backend / Segurança / Autorização  
**Versao da entrega:** 9.0  

---

## 1. Objetivo

Implementar e documentar o controle de acesso baseado em perfil (**RBAC - Role-Based Access Control**) no sistema **Saude Facil**. O objetivo é garantir que cada tipo de usuário acesse apenas as funcionalidades permitidas para o seu nível de privilégio, assegurando a integridade e a segurança dos dados.

Esta entrega contempla:
- Estratégia de autenticação (JWT).
- Middleware de autorização por perfil.
- Regras de permissão detalhadas para UC, UP, UE e UA.
- Evidências de funcionamento.

---

## 2. Estratégia de Autenticação

A autenticação é realizada através de **JSON Web Tokens (JWT)**. 

1. **Login:** O usuário fornece credenciais (e-mail e senha).
2. **Geração de Token:** O servidor valida as credenciais e gera um token JWT contendo o `userId` e o `role` (perfil) do usuário.
3. **Persistência:** O token é retornado ao cliente, que deve armazená-lo e enviá-lo em todas as requisições subsequentes para rotas protegidas.
4. **Headers:** O token deve ser enviado no cabeçalho `Authorization` seguindo o padrão Bearer:
   ```http
   Authorization: Bearer <token_jwt>
   ```

---

## 3. Middleware de Autorização

O sistema utiliza dois middlewares principais localizados em `src/middlewares/auth.ts`:

### 3.1 `authMiddleware`
Responsável por interceptar a requisição, validar a assinatura do token JWT e extrair os dados do usuário. Se o token for inválido ou estiver ausente, a requisição é bloqueada com status `401 Unauthorized`.

### 3.2 `roleMiddleware`
Responsável por verificar se o perfil do usuário autenticado (extraído pelo `authMiddleware`) possui permissão para acessar a rota específica. Se o perfil não estiver na lista de perfis permitidos, a requisição é bloqueada com status `403 Forbidden`.

**Exemplo de uso nas rotas:**
```typescript
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["UP", "UA"]), // Apenas Profissionais e Administradores
  InstitutionController.create
);
```

---

## 4. Regras de Permissão por Perfil

O sistema define quatro perfis principais:

### 4.1 UC - Usuário Comum (Paciente)
Destinado aos cidadãos que buscam serviços de saúde.
- **Permissões:**
    - Visualizar instituições e serviços públicos.
    - Gerenciar seu próprio perfil.
    - Criar agendamentos (`POST /appointments`).
    - Visualizar seus próprios agendamentos (`GET /appointments/my`).
    - Cancelar seus próprios agendamentos (`PATCH /appointments/:id/status`).

### 4.2 UP - Usuário Profissional (Clínica/Laboratório)
Destinado a gestores de unidades de saúde e profissionais independentes.
- **Permissões:**
    - Tudo o que o UC acessa (exceto agendamentos de outros pacientes).
    - Gerenciar sua própria instituição (`POST/PATCH /institutions`).
    - Gerenciar seus serviços (`POST/PATCH/DELETE /services`).
    - Configurar disponibilidade e horários (`POST /institutions/:id/availability`).
    - Visualizar agendamentos da sua instituição.
    - Alterar status de agendamentos (confirmar/concluir).
    - Acessar estatísticas da sua unidade.

### 4.3 UE - Usuário Empresa (Gestor de Organização)
Destinado a gestores de redes de clínicas ou órgãos públicos que gerenciam múltiplas unidades.
- **Permissões:**
    - Visualizar lista de unidades vinculadas à sua organização.
    - Visualizar agendamentos consolidados de todas as suas unidades.
    - Acessar dashboards e relatórios consolidados de produtividade e receita.
    - Gerenciar usuários vinculados à sua organização.

### 4.4 UA - Administrador
Perfil com acesso total ao sistema para manutenção e suporte.
- **Permissões:**
    - Acesso irrestrito a todos os endpoints.
    - Gestão global de usuários (ativar/desativar/excluir).
    - Gestão global de instituições.
    - Visualização de estatísticas globais da plataforma (faturamento total, crescimento).

---

## 5. Matriz de Permissões (Resumo)

| Recurso | Endpoint | UC | UP | UE | UA |
| --- | --- | :---: | :---: | :---: | :---: |
| Perfil Próprio | `/users/profile` | ✅ | ✅ | ✅ | ✅ |
| Lista Instituições | `/institutions` (GET) | ✅ | ✅ | ✅ | ✅ |
| Criar Instituição | `/institutions` (POST) | ❌ | ✅ | ❌ | ✅ |
| Gerenciar Serviços | `/services` | ❌ | ✅ | ❌ | ✅ |
| Criar Agendamento | `/appointments` (POST) | ✅ | ❌ | ❌ | ✅ |
| Meus Agendamentos | `/appointments/my` | ✅ | ❌ | ❌ | ✅ |
| Agenda da Unidade | `/appointments/institution/:id` | ❌ | ✅ | ✅ | ✅ |
| Stats da Unidade | `/institutions/:id/stats` | ❌ | ✅ | ✅ | ✅ |
| Dashboard Empresa | `/enterprise/*` | ❌ | ❌ | ✅ | ✅ |
| Gestão de Usuários | `/admin/*` | ❌ | ❌ | ❌ | ✅ |

---

## 6. Evidência de Funcionamento

O sistema de segurança foi validado através de testes automatizados e manuais.

### 6.1 Testes Unitários e de Integração
Foram executados **27 testes** cobrindo as regras de negócio e a camada de segurança.

**Resultado da execução:**
```text
✔ authMiddleware rejeita requisicao sem token
✔ authMiddleware aceita token valido e popula req.user
✔ roleMiddleware libera perfil permitido
✔ roleMiddleware bloqueia perfil nao autorizado
✔ AuthService.login retorna usuario sem senha e token JWT valido
✔ AuthService.login rejeita conta desativada

ℹ tests 27
ℹ pass 27
ℹ fail 0
```

### 6.2 Comprovação de Bloqueio (403 Forbidden)
Ao tentar acessar uma rota administrativa com um perfil de Usuário Comum (UC), o sistema retorna corretamente o erro de permissão:

**Request:**
```http
GET /admin/users
Authorization: Bearer <TOKEN_PACIENTE_UC>
```

**Response:**
```json
{
  "error": "Acesso negado"
}
```

---

## 7. Conclusão

A implementação do controle de acesso baseado em perfil (RBAC) na versão 9.0 garante que o **Saude Facil** opere de forma segura e organizada. A separação clara de responsabilidades entre pacientes (UC), profissionais (UP), gestores (UE) e administradores (UA) permite que a plataforma escale mantendo a privacidade dos dados e o controle operacional necessário para cada nível de usuário.

A evidência dos testes demonstra que a camada de segurança é resiliente e as regras de negócio estão sendo aplicadas corretamente em todos os módulos do sistema.
