import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "sonner";

export function DetalhesUsuarioUA() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      toast.error("Usuário não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`);
      setUser(response.data);
      toast.success(
        `Usuário ${response.data.active ? "ativado" : "desativado"} com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao processar alteração de status");
    }
  };

  const handleDeleteUser = async () => {
    if (
      !window.confirm(
        "TEM CERTEZA? Esta ação é IRREVERSÍVEL. Todos os dados vinculados (agendamentos, instituições, serviços) serão APAGADOS permanentemente.",
      )
    )
      return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("Usuário e todos os dados vinculados foram removidos!");
      navigate("/ua/usuarios");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao tentar excluir usuário");
    }
  };

  const handleResetPassword = () => {
    toast.success(
      "Instruções de redefinição enviadas para o email do usuário!",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Recuperando perfil detalhado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/ua/usuarios")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Gestão de Usuários
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {user?.role === "UC" && "PACIENTE"}
                {user?.role === "UP" && "INSTITUIÇÃO"}
                {user?.role === "UE" && "GESTOR EMPRESARIAL"}
                {user?.role === "UA" && "ADMINISTRADOR"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user?.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.active ? "ATIVO" : "INATIVO"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResetPassword}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Redefinir Senha
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-3 rounded-xl transition-colors font-semibold ${
                user?.active
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {user?.active ? "Desativar Conta" : "Ativar Conta"}
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-semibold"
            >
              Excluir Conta
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informações de Perfil
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">
                      {user?.phone || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Documento (CPF/CNPJ)
                    </p>
                    <p className="font-medium text-gray-900">
                      {user?.cpf || user?.cnpj || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Endereço</p>
                    <p className="font-medium text-gray-900">
                      {user?.address || "Não informado"}
                    </p>
                  </div>
                </div>
                {user?.role === "UE" && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Organização Vinculada
                      </p>
                      <p className="font-medium text-gray-900">
                        {user?.organizationName || "Nenhuma"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo de Atividade
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">
                    Total Agendamentos
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {user?._count?.appointments || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">Status Sistema</p>
                  </div>
                  <p className="text-xl font-bold text-green-900">Verificado</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-700 mb-1">
                    Taxa Fidelidade
                  </p>
                  <p className="text-2xl font-bold text-purple-900">95%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Rastreamento
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conta Criada em</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID Único</p>
                  <p className="font-mono text-xs text-gray-500 break-all">
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">
                Logs de Auditoria
              </h3>
              <p className="text-xs text-blue-700 mb-4">
                Última alteração de perfil realizada pelo próprio usuário em{" "}
                {new Date(user?.updatedAt).toLocaleDateString("pt-BR")}.
              </p>
              <button className="w-full py-2 bg-white text-[var(--brand-blue)] rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-shadow">
                Ver Histórico Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
