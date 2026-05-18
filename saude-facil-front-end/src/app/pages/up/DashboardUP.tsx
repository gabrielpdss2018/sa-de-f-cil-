import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

export function DashboardUP() {
  const { user } = useAuth() as any;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const institution = user?.institutions?.[0];
  const institutionId = institution?.id;

  useEffect(() => {
    if (institutionId) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [institutionId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appRes, statsRes] = await Promise.all([
        api.get(`/appointments/institution/${institutionId}`),
        api.get(`/institutions/${institutionId}/stats`),
      ]);
      setAppointments(appRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.date.split("T")[0] === today,
  );

  // Pacientes únicos
  const patientsCount = new Set(appointments.map((a) => a.patientId)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando painel...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quase pronto!</h2>
          <p className="text-gray-600 mb-6">Estamos finalizando a configuração do seu painel. Tente atualizar a página em alguns instantes.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[var(--brand-blue)] text-white rounded-xl font-bold hover:opacity-90"
          >
            Atualizar Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {institution?.name}
          </h1>
          <p className="text-gray-600 mt-1">Painel de Controle</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-16 h-16 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Receita Mês
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                R$ {stats?.monthlyRevenue?.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs font-semibold text-blue-600 mt-4 bg-blue-50 w-fit px-2 py-1 rounded-full">
                Finalizadas
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Receita Ano
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                R$ {stats?.annualRevenue?.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs font-semibold text-green-600 mt-4">
                Jan {new Date().getFullYear()} - Hoje
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-purple-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-16 h-16 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Pacientes
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {patientsCount}
              </p>
              <p className="text-xs font-semibold text-purple-600 mt-4">
                Total Únicos
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="w-16 h-16 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Agendamentos
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {todayAppointments.length}
              </p>
              <p className="text-xs font-semibold text-orange-600 mt-4">
                Para Hoje
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/up/servicos"
            className="bg-gradient-to-br from-[var(--brand-blue)] to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Gerenciar Serviços</h3>
                <p className="text-blue-100">Cadastre e edite seus serviços</p>
              </div>
              <Plus className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/up/agenda"
            className="bg-gradient-to-br from-[var(--brand-green)] to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ver Agenda</h3>
                <p className="text-green-100">Acompanhe seus agendamentos</p>
              </div>
              <Calendar className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Agendamentos de Hoje
          </h3>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum agendamento para hoje
            </p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {apt.patient?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apt.service?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{apt.time}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "agendado"
                          ? "bg-blue-100 text-blue-700"
                          : apt.status === "concluido"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
