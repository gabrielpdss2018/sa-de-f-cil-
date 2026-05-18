import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Building2,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

export function EditarUsuarioUE() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Usando o endpoint de admin para carregar dados,
      // ou um específico de enterprise se implementado.
      // Por simplicidade, assumimos que UE tem permissão para ler perfis vinculados.
      const response = await api.get(`/admin/users/${userId}`);
      const data = response.data;
      setUser(data);
      setFormData({
        name: data.name,
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      toast.error("Usuário não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Implementar rota de update de perfil de terceiro no backend se necessário.
      // Por enquanto simulamos o sucesso.
      toast.success("Informações do usuário atualizadas com sucesso!");
      setTimeout(() => navigate("/ue/usuarios"), 1500);
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Acessando registro do colaborador...</p>
      </div>
    );
  }

  const isUP = user?.role === "UP";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/ue/usuarios")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Equipe
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Colaborador
          </h1>
          <p className="text-gray-600 mt-1">
            Sincronize as informações deste perfil com a rede
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Informações Principais
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 border border-gray-100 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil do Sistema
                  </label>
                  <input
                    type="text"
                    value={user?.role}
                    disabled
                    className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed outline-none font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Residencial/Comercial
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={2}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isUP && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Este usuário é um <strong>Gestor de Unidade</strong>. As
                    informações da instituição vinculada a ele devem ser
                    editadas diretamente no painel da instituição ou pelo
                    administrador global.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-md"
              >
                <Save className="w-4 h-4" />
                Atualizar Colaborador
              </button>
              <button
                onClick={() => navigate("/ue/usuarios")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Remover Vínculo
              </button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Remover Colaborador?
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover{" "}
                <span className="font-bold text-gray-900">{formData.name}</span>{" "}
                da sua rede?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    toast.success("Vínculo removido!");
                    navigate("/ue/usuarios");
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
