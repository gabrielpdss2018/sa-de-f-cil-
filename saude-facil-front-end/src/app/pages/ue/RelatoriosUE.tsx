import { useState, useEffect } from "react";
import { TrendingUp, Users, Calendar, DollarSign, Loader2 } from "lucide-react";
import api from "../../services/api";

export function RelatoriosUE() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/enterprise/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas empresariais:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Consolidando métricas da rede...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Relatórios e Análises
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unidades Totais</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUnits}
                </p>
                <p className="text-xs text-blue-600 mt-1">Rede integrada</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalAppointments}
                </p>
                <p className="text-xs text-green-600 mt-1">Total da rede</p>
              </div>
              <Calendar className="w-10 h-10 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Atendimentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.completedAppointments}
                </p>
                <p className="text-xs text-purple-600 mt-1">Concluídos</p>
              </div>
              <Users className="w-10 h-10 text-purple-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.performance}%
                </p>
                <p className="text-xs text-orange-600 mt-1">Taxa de sucesso</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-100" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Visão Operacional
          </h3>
          <p className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-100 rounded-xl italic">
            Os gráficos de tendência temporal e volumetria por especialidade
            serão habilitados conforme o acúmulo de dados históricos no banco de
            dados.
          </p>
        </div>
      </div>
    </div>
  );
}
