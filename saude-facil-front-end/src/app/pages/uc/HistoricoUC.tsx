import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function HistoricoUC() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "todos" | "agendado" | "concluido" | "cancelado"
  >("todos");
  const [showReagendModal, setShowReagendModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/appointments/my");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast.error("Erro ao carregar seu histórico");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments =
    filter === "todos"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  const statusConfig = {
    agendado: {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Agendado",
    },
    concluido: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      label: "Concluído",
    },
    cancelado: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      label: "Cancelado",
    },
  };

  const handleCancel = async (
    appointmentId: string,
    institutionName: string,
  ) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status: "cancelado",
      });
      toast.success(`Agendamento em ${institutionName} cancelado com sucesso!`);
      fetchAppointments(); // Recarregar lista
    } catch (error) {
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const handleReagendRequest = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReagendModal(true);
  };

  const handleReagendConfirm = () => {
    toast.success(`Reagendamento solicitado!`, {
      description: `Em breve você receberá as opções de horários disponíveis em ${selectedAppointment?.institution?.name}`,
    });
    setShowReagendModal(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Histórico de Agendamentos
        </h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Agendados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter((a) => a.status === "agendado").length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter((a) => a.status === "concluido").length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(["todos", "agendado", "concluido", "cancelado"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === status
                      ? "bg-[var(--brand-blue)] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "todos" ? "Todos" : statusConfig[status].label}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Nenhum agendamento encontrado
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const config =
                statusConfig[appointment.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {appointment.institution?.name}
                      </h3>
                      <p className="text-gray-600">
                        {appointment.service?.name}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}
                    >
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {appointment.status === "agendado" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                      <button
                        onClick={() =>
                          handleCancel(
                            appointment.id,
                            appointment.institution?.name,
                          )
                        }
                        className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleReagendRequest(appointment)}
                        className="flex-1 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                      >
                        Reagendar
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Reagend Modal */}
        {showReagendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Reagendar Consulta
              </h3>
              <p className="text-gray-600 mb-6">
                Deseja reagendar este agendamento? Entraremos em contato com as
                opções de horários disponíveis.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReagendModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReagendConfirm}
                  className="flex-1 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
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
