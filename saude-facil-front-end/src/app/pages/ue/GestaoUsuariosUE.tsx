import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import api from "../../services/api";

export function GestaoUsuariosUE() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [searchType, setSearchType] = useState<"cadastrar" | "vincular">(
    "cadastrar",
  );
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    userId: string;
    userName: string;
  } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkedUsers();
  }, []);

  const fetchLinkedUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/enterprise/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários vinculados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteModal({ show: true, userId, userName });
  };

  const confirmDelete = async () => {
    if (deleteModal) {
      try {
        // Simulação de desvínculo
        setUsers((prev) =>
          prev.filter((user) => user.id !== deleteModal.userId),
        );
        toast.success(`Usuário ${deleteModal.userName} removido com sucesso!`);
        setDeleteModal(null);
      } catch (error) {
        toast.error("Erro ao remover usuário");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Sincronizando equipe corporativa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestão de Equipe
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie os colaboradores da sua rede de saúde
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Adicionar Usuário
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-blue-50">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchType("cadastrar")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  searchType === "cadastrar"
                    ? "bg-[var(--brand-blue)] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cadastrar Novo
              </button>
              <button
                onClick={() => setSearchType("vincular")}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  searchType === "vincular"
                    ? "bg-[var(--brand-blue)] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vincular Existente
              </button>
            </div>

            {searchType === "cadastrar" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Cadastrar Novo Usuário
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Usuário
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none">
                      <option>UP - Gestor de Unidade</option>
                      <option>UE - Gestor Empresarial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do usuário"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      toast.success("Usuário cadastrado na organização!");
                      setShowForm(false);
                    }}
                    className="px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-md"
                  >
                    Salvar Usuário
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Vincular Conta Existente
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por Email ou CPF..."
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                  <button
                    onClick={() =>
                      toast.info(
                        "Função de busca disponível em ambiente de produção",
                      )
                    }
                    className="px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Buscar
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Vincule profissionais de saúde ou gestores à sua rede de forma
                  rápida.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Usuários da Organização
          </h3>
          {users.length === 0 ? (
            <p className="text-center py-12 text-gray-500">
              Nenhum colaborador vinculado à sua rede.
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "UE"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role === "UE" ? "Empresarial" : "Instituição"}
                    </span>
                    <button
                      onClick={() => navigate(`/ue/usuarios/editar/${user.id}`)}
                      className="p-2 text-gray-400 hover:text-[var(--brand-blue)] transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal?.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-center">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Remover Usuário?
              </h3>
              <p className="text-gray-600 mb-6">
                Você está prestes a remover{" "}
                <span className="font-bold text-gray-900">
                  {deleteModal.userName}
                </span>{" "}
                da sua rede. Esta ação retirará os privilégios corporativos
                deste usuário.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold"
                >
                  Manter
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-lg"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
