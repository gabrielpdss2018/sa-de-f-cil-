import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function RelatoriosUP() {
  const { user } = useAuth() as any;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const institutionId = user?.institutions?.[0]?.id;

  useEffect(() => {
    if (institutionId) {
      fetchReportData();
    }
  }, [institutionId]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [appRes, srvRes] = await Promise.all([
        api.get(`/appointments/institution/${institutionId}`),
        api.get(`/services/institution/${institutionId}`),
      ]);
      setAppointments(appRes.data);
      setServices(srvRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do relatório:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = appointments
    .filter((apt) => apt.status === "concluido")
    .reduce((acc, apt) => acc + (apt.service?.price || 0), 0);

  const totalPatients = new Set(appointments.map((a) => a.patientId)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Gerando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">
              Acompanhe o desempenho da sua instituição
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg">
            <Download className="w-5 h-5" />
            Exportar PDF
          </button>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Receita (Concluídos)</p>
                <p className="text-2xl font-bold text-gray-900">
                  R${" "}
                  {totalRevenue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-green-600 mt-1">Total acumulado</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agendamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
                <p className="text-xs text-blue-600 mt-1">Total geral</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter((a) => a.status === "concluido").length}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Atendimentos realizados
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pacientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPatients}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Base de pacientes
                </p>
              </div>
              <Users className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Services Performance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Desempenho por Serviço
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Serviço
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Agendamentos
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Receita Bruta
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Preço Un.
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const serviceAppointments = appointments.filter(
                    (apt) => apt.serviceId === service.id,
                  );
                  const revenue =
                    serviceAppointments.filter((a) => a.status === "concluido")
                      .length * service.price;
                  return (
                    <tr
                      key={service.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700">
                        {serviceAppointments.length}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700">
                        R$ {revenue.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700">
                        R$ {service.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Resumo Operacional
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-sm text-blue-700 mb-2">Serviços Ativos</p>
              <p className="text-3xl font-bold text-blue-900">
                {services.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Disponíveis para agendamento
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-sm text-green-700 mb-2">Taxa de Conclusão</p>
              <p className="text-3xl font-bold text-green-900">
                {appointments.length > 0
                  ? (
                      (appointments.filter((a) => a.status === "concluido")
                        .length /
                        appointments.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-green-600 mt-1">
                Dos agendamentos foram realizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
