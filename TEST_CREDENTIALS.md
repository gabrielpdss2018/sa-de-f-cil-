# 🔑 Credenciais de Teste - Saúde Fácil

Este documento contém os usuários pré-cadastrados no sistema para facilitar a homologação e testes das funcionalidades integradas.

## 🔓 Informações Gerais
- **Senha Padrão para todos:** `123456`
- **URL do Frontend:** `http://localhost:5173`
- **URL da API:** `http://localhost:3001`

---

## 👤 1. Perfil: Cidadão (UC)
*Utilizado para buscar clínicas, exames e realizar agendamentos.*
- **E-mail:** `maria@email.com`
- **Funcionalidades principais:** Busca por especialidade, agendamento de consultas, visualização de histórico e edição de perfil.

## 🏥 2. Perfil: Instituição / Clínica (UP)
*Utilizado por clínicas e laboratórios para gerenciar sua agenda.*
- **E-mail:** `joao@clinica.com`
- **Funcionalidades principais:** Gerenciamento de serviços (preços/duração), visualização da agenda diária, confirmação de atendimentos e relatórios de receita.

## 🏢 3. Perfil: Gestor Empresarial (UE)
*Utilizado por donos de redes de saúde para gerenciar múltiplas unidades.*
- **E-mail:** `ana@empresa.com`
- **Funcionalidades principais:** Dashboard consolidado da rede, gestão de unidades vinculadas, gestão de equipe corporativa e relatórios agregados.

## 🛡️ 4. Perfil: Administrador Global (UA)
*Utilizado para controle total e monitoramento da plataforma.*
- **E-mail:** `admin@saudefacil.com`
- **Funcionalidades principais:** Monitoramento de saúde do sistema, visão geral de todas as instituições, gestão global de usuários e métricas de crescimento.

---

## 🚀 Como Preparar o Ambiente
Se você acabou de baixar o projeto, siga estes comandos na raiz:

1. **Instalar dependências:** `npm run install:all`
2. **Configurar Banco:** No backend, rode `npx prisma migrate dev`
3. **Popular Dados:** No backend, rode `npm run seed`
4. **Rodar Sistema:** Na raiz, rode `npm run dev`

---
*© 2026 Saúde Fácil - Sistema de Agendamento Integrado*
