import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { User, Search, Calendar, Clock, Loader2 } from "lucide-react";

export function PacientesAgendadosUP() {
  const { user } = useAuth() as any;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const institutionId = user?.institutions?.[0]?.id;

  useEffect(() => {
    if (institutionId) {
      fetchAppointments();
    }
  }, [institutionId]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/appointments/institution/${institutionId}`,
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPatients = new Set(appointments.map((a) => a.patientId)).size;
  const activeCount = appointments.filter(
    (a) => a.status === "agendado",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "concluido",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando lista de pacientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pacientes Agendados
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie todos os pacientes com agendamentos
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do paciente ou serviço..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPatients}
                </p>
              </div>
              <User className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agendamentos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCount}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
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
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Lista de Agendamentos
          </h3>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-[var(--brand-blue)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {apt.patient?.name}
                        </h4>
                        <p className="text-gray-600">{apt.service?.name}</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(apt.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{apt.time}</span>
                    </div>
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
