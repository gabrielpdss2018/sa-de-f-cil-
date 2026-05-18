import { createBrowserRouter, Navigate } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Layout } from "./components/layout/Layout";

// UC Pages
import { DashboardUC } from "./pages/uc/DashboardUC";
import { BuscarServicos } from "./pages/uc/BuscarServicos";
import { InstituicaoDetalhes } from "./pages/uc/InstituicaoDetalhes";
import { Agendamento } from "./pages/uc/Agendamento";
import { HistoricoUC } from "./pages/uc/HistoricoUC";
import { PerfilUC } from "./pages/uc/PerfilUC";

// UP Pages
import { DashboardUP } from "./pages/up/DashboardUP";
import { AgendaUP } from "./pages/up/AgendaUP";
import { ServicosUP } from "./pages/up/ServicosUP";
import { HorariosUP } from "./pages/up/HorariosUP";
import { PacientesAgendadosUP } from "./pages/up/PacientesAgendadosUP";
import { PerfilUP } from "./pages/up/PerfilUP";

// UE Pages
import { DashboardUE } from "./pages/ue/DashboardUE";
import { GestaoUsuariosUE } from "./pages/ue/GestaoUsuariosUE";
import { EditarUsuarioUE } from "./pages/ue/EditarUsuarioUE";
import { GestaoUnidadesUE } from "./pages/ue/GestaoUnidadesUE";
import { NovaUnidadeUE } from "./pages/ue/NovaUnidadeUE";
import { EditarUnidadeUE } from "./pages/ue/EditarUnidadeUE";
import { DetalhesUnidadeUE } from "./pages/ue/DetalhesUnidadeUE";
import { AgendamentosUE } from "./pages/ue/AgendamentosUE";
import { RelatoriosUE } from "./pages/ue/RelatoriosUE";
import { PerfilUE } from "./pages/ue/PerfilUE";

// UA Pages
import { DashboardUA } from "./pages/ua/DashboardUA";
import { GestaoUsuariosUA } from "./pages/ua/GestaoUsuariosUA";
import { DetalhesUsuarioUA } from "./pages/ua/DetalhesUsuarioUA";
import { GestaoInstituicoesUA } from "./pages/ua/GestaoInstituicoesUA";
import { GerenciarInstituicaoUA } from "./pages/ua/GerenciarInstituicaoUA";
import { EstatisticasInstituicaoUA } from "./pages/ua/EstatisticasInstituicaoUA";
import { ConfiguracoesUA } from "./pages/ua/ConfiguracoesUA";
import { PerfilUA } from "./pages/ua/PerfilUA";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/uc",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/uc/dashboard" replace /> },
      { path: "dashboard", element: <DashboardUC /> },
      { path: "buscar", element: <BuscarServicos /> },
      { path: "instituicao/:id", element: <InstituicaoDetalhes /> },
      { path: "agendar/:serviceId", element: <Agendamento /> },
      { path: "historico", element: <HistoricoUC /> },
      { path: "perfil", element: <PerfilUC /> },
    ],
  },
  {
    path: "/up",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/up/dashboard" replace /> },
      { path: "dashboard", element: <DashboardUP /> },
      { path: "agenda", element: <AgendaUP /> },
      { path: "servicos", element: <ServicosUP /> },
      { path: "horarios", element: <HorariosUP /> },
      { path: "pacientes", element: <PacientesAgendadosUP /> },
      { path: "perfil", element: <PerfilUP /> },
    ],
  },
  {
    path: "/ue",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/ue/dashboard" replace /> },
      { path: "dashboard", element: <DashboardUE /> },
      { path: "usuarios", element: <GestaoUsuariosUE /> },
      { path: "usuarios/editar/:userId", element: <EditarUsuarioUE /> },
      { path: "unidades", element: <GestaoUnidadesUE /> },
      { path: "unidades/nova", element: <NovaUnidadeUE /> },
      { path: "unidades/editar/:unitId", element: <EditarUnidadeUE /> },
      { path: "unidades/detalhes/:unitId", element: <DetalhesUnidadeUE /> },
      { path: "agendamentos", element: <AgendamentosUE /> },
      { path: "relatorios", element: <RelatoriosUE /> },
      { path: "perfil", element: <PerfilUE /> },
    ],
  },
  {
    path: "/ua",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/ua/dashboard" replace /> },
      { path: "dashboard", element: <DashboardUA /> },
      { path: "usuarios", element: <GestaoUsuariosUA /> },
      { path: "usuarios/detalhes/:userId", element: <DetalhesUsuarioUA /> },
      { path: "instituicoes", element: <GestaoInstituicoesUA /> },
      {
        path: "instituicoes/gerenciar/:institutionId",
        element: <GerenciarInstituicaoUA />,
      },
      {
        path: "instituicoes/estatisticas/:institutionId",
        element: <EstatisticasInstituicaoUA />,
      },
      { path: "configuracoes", element: <ConfiguracoesUA /> },
      { path: "perfil", element: <PerfilUA /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
          <a
            href="/"
            className="px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    ),
  },
]);
