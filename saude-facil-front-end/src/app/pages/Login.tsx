import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router";
import { Heart, Lock, Mail, AlertCircle } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // O redirecionamento será tratado pelo componente ou aqui
      // Vamos pegar o usuário do localStorage ou esperar o estado atualizar
      const storedUser = JSON.parse(
        localStorage.getItem("@SaudeFacil:user") || "{}",
      );

      const dashboardRoutes = {
        UC: "/uc/dashboard",
        UP: "/up/dashboard",
        UE: "/ue/dashboard",
        UA: "/ua/dashboard",
      };

      navigate(
        dashboardRoutes[storedUser.role as keyof typeof dashboardRoutes] || "/",
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Email ou senha incorretos");
    }
  };

  const demoUsers = [
    { email: "maria@email.com", role: "Paciente (UC)", pass: "qualquer" },
    { email: "joao@clinica.com", role: "Clínica (UP)", pass: "qualquer" },
    { email: "ana@empresa.com", role: "Gestor (UE)", pass: "qualquer" },
    { email: "admin@saudefacil.com", role: "Admin (UA)", pass: "qualquer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-blue-light)] via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Saúde Fácil</h1>
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="text-[var(--brand-blue)] hover:underline font-semibold"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            Usuários de demonstração:
          </p>
          <div className="space-y-1.5 text-xs text-blue-800">
            {demoUsers.map((user, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-medium">{user.role}:</span>
                <button
                  onClick={() => setEmail(user.email)}
                  className="text-[var(--brand-blue)] hover:underline"
                >
                  {user.email}
                </button>
              </div>
            ))}
            <p className="text-blue-600 mt-2 italic">
              * Qualquer senha funciona para teste
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
