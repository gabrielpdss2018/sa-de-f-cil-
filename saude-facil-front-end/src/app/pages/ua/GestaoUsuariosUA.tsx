import { useState, useEffect } from "react";
import { Search, UserCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../services/api";

export function GestaoUsuariosUA() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const roleParam = roleFilter !== "todos" ? `role=${roleFilter}` : "";
      const searchParam = searchTerm ? `search=${searchTerm}` : "";
      const queryString = [roleParam, searchParam].filter(Boolean).join("&");

      const response = await api.get(`/admin/users?${queryString}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestão Global de Usuários
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou email..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
            >
              <option value="todos">Todos os perfis</option>
              <option value="UC">Cidadão (UC)</option>
              <option value="UP">Instituição (UP)</option>
              <option value="UE">Empresarial (UE)</option>
              <option value="UA">Administrador (UA)</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Filtrar
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
            <p className="text-gray-500">Buscando base de usuários...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Usuário
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Perfil
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Cadastro
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-sm">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === "UA"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "UE"
                                ? "bg-orange-100 text-orange-700"
                                : user.role === "UP"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() =>
                            navigate(`/ua/usuarios/detalhes/${user.id}`)
                          }
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-gray-500"
                      >
                        Nenhum usuário encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
