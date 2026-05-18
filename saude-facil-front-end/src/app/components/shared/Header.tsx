import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    if (user?.role === "UC") navigate("/uc/perfil");
    if (user?.role === "UP") navigate("/up/perfil");
    if (user?.role === "UE") navigate("/ue/perfil");
    if (user?.role === "UA") navigate("/ua/perfil");
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Saúde Fácil</h1>
              <p className="text-xs text-gray-500">
                {user.role === "UC" && "Paciente"}
                {user.role === "UP" && "Instituição"}
                {user.role === "UE" && "Gestor Empresarial"}
                {user.role === "UA" && "Administrador"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleProfile}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
