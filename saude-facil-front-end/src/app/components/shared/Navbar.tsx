import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router";
import {
  Home,
  Calendar,
  Search,
  History,
  User,
  Building2,
  Users,
  BarChart3,
  Settings,
  ClipboardList,
  Building,
  UserCircle,
  Clock,
} from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItems = {
    UC: [
      { path: "/uc/dashboard", icon: Home, label: "Início" },
      { path: "/uc/buscar", icon: Search, label: "Buscar" },
      { path: "/uc/historico", icon: History, label: "Histórico" },
      { path: "/uc/perfil", icon: User, label: "Perfil" },
    ],
    UP: [
      { path: "/up/dashboard", icon: Home, label: "Dashboard" },
      { path: "/up/agenda", icon: Calendar, label: "Agenda" },
      { path: "/up/servicos", icon: ClipboardList, label: "Serviços" },
      { path: "/up/horarios", icon: Clock, label: "Horários" },
      { path: "/up/pacientes", icon: UserCircle, label: "Pacientes" },
      { path: "/up/perfil", icon: User, label: "Perfil" },
    ],
    UE: [
      { path: "/ue/dashboard", icon: Home, label: "Dashboard" },
      { path: "/ue/usuarios", icon: Users, label: "Usuários" },
      { path: "/ue/unidades", icon: Building2, label: "Unidades" },
      { path: "/ue/agendamentos", icon: Calendar, label: "Agendamentos" },
      { path: "/ue/relatorios", icon: BarChart3, label: "Relatórios" },
      { path: "/ue/perfil", icon: User, label: "Perfil" },
    ],
    UA: [
      { path: "/ua/dashboard", icon: Home, label: "Dashboard" },
      { path: "/ua/usuarios", icon: Users, label: "Usuários" },
      { path: "/ua/instituicoes", icon: Building, label: "Instituições" },
      { path: "/ua/configuracoes", icon: Settings, label: "Configurações" },
      { path: "/ua/perfil", icon: User, label: "Perfil" },
    ],
  };

  const items = navItems[user.role] || [];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  active
                    ? "bg-[var(--brand-blue)] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
