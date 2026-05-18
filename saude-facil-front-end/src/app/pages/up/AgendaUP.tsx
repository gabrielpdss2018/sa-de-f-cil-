import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Calendar, Clock, User, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AgendaUP() {
  const { user } = useAuth() as any;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const institution = user?.institutions?.[0];
  const institutionId = institution?.id;

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
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const dateAppointments = appointments.filter(
    (apt) => apt.date.split("T")[0] === selectedDate,
  );

  // Gerar próximas 5 datas
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const handleConfirmAttendance = async (
    appointmentId: string,
    patientName: string,
    serviceName: string,
  ) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status: "concluido",
      });
      toast.success(`Atendimento confirmado!`, {
        description: `${patientName} - ${serviceName} foi marcado como concluído`,
      });
      fetchAppointments(); // Recarregar lista
    } catch (error) {
      toast.error("Erro ao confirmar atendimento");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agenda de Atendimentos
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Calendar Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Selecione a Data</h3>
              <div className="space-y-2">
                {dates.map((date) => {
                  const count = appointments.filter(
                    (apt) => apt.date.split("T")[0] === date,
                  ).length;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedDate === date
                          ? "bg-[var(--brand-blue)] text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <p className="font-semibold">
                        {new Date(date + "T12:00:00").toLocaleDateString(
                          "pt-BR",
                          { day: "2-digit", month: "short" },
                        )}
                      </p>
                      <p className="text-xs opacity-80">
                        {count} agendamento(s)
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                    "pt-BR",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    },
                  )}
                </h3>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {dateAppointments.length} atendimento(s)
                </span>
              </div>

              {dateAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nenhum agendamento para esta data
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dateAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-[var(--brand-blue)] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-7 h-7 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {apt.patient?.name}
                            </h4>
                            <p className="text-gray-600">{apt.service?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-900 font-bold mb-1">
                            <Clock className="w-5 h-5" />
                            {apt.time}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
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

                      {apt.status === "agendado" && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() =>
                              handleConfirmAttendance(
                                apt.id,
                                apt.patient?.name,
                                apt.service?.name,
                              )
                            }
                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmar Atendimento
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                            Detalhes
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
