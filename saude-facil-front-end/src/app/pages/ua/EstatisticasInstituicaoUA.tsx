import { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Activity,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import api from "../../services/api";

export function EstatisticasInstituicaoUA() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const [institution, setInstitution] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [institutionId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [instRes, statsRes] = await Promise.all([
        api.get(`/institutions/${institutionId}`),
        api.get(`/institutions/${institutionId}/stats`),
      ]);
      setInstitution(instRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Compilando métricas de desempenho...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/ua/instituicoes")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Gestão de Instituições
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {institution?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Estatísticas e métricas de desempenho reais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Agendamentos</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalAppointments}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Serviços Oferecidos</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.servicesCount}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Avaliação Média</p>
            <p className="text-3xl font-bold text-gray-900">
              {institution?.rating}
            </p>
            <div className="flex gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(institution?.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Taxa de Conclusão</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalAppointments > 0
                ? (
                    (stats.completedAppointments / stats.totalAppointments) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${stats?.totalAppointments > 0 ? (stats.completedAppointments / stats.totalAppointments) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resumo Operacional
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700">Agendamentos Ativos</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats?.scheduledAppointments}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-700">
                    Atendimentos Finalizados
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats?.completedAppointments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Métricas de Serviços
              </h2>
              <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                Os dados de volume por serviço serão processados assim que
                houver mais agendamentos no sistema.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Integridade
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Dados Sincronizados
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Conexão com Banco
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Responsável</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {institution?.manager?.name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {institution?.manager?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {institution?.manager?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
