import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import { Search, Calendar, Clock, MapPin, Heart, Loader2 } from "lucide-react";
import api from "../../services/api";

export function DashboardUC() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/appointments/my");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextAppointment = appointments
    .filter((apt) => apt.status === "agendado")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const scheduledCount = appointments.filter(
    (a) => a.status === "agendado",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "concluido",
  ).length;

  // Contar instituições únicas
  const institutionsCount = new Set(appointments.map((a) => a.institutionId))
    .size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando seu dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta ao Saúde Fácil
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/uc/buscar"
            className="bg-gradient-to-br from-[var(--brand-blue)] to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Buscar Serviços</h3>
                <p className="text-blue-100">
                  Encontre clínicas e laboratórios
                </p>
              </div>
              <Search className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/uc/historico"
            className="bg-gradient-to-br from-[var(--brand-green)] to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Meus Agendamentos</h3>
                <p className="text-green-100">Visualize seu histórico</p>
              </div>
              <Calendar className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-[var(--brand-blue)]">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--brand-blue)]" />
              Próximo Agendamento
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Instituição</p>
                <p className="font-semibold text-gray-900">
                  {nextAppointment.institution?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serviço</p>
                <p className="font-semibold text-gray-900">
                  {nextAppointment.service?.name}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(nextAppointment.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-semibold text-gray-900">
                    {nextAppointment.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agendados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledCount}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount}
                </p>
              </div>
              <Heart className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Instituições</p>
                <p className="text-2xl font-bold text-gray-900">
                  {institutionsCount || 0}
                </p>
              </div>
              <MapPin className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">💡 Dica</h3>
          <p className="text-blue-800 text-sm">
            Use os filtros na busca para encontrar rapidamente o serviço que
            você precisa. Você pode filtrar por tipo de instituição,
            especialidade e localização.
          </p>
        </div>
      </div>
    </div>
  );
}
