import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Calendar, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface TimeSlot {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  interval: number;
  maxAppointments: number;
}

export function HorariosUP() {
  const { user } = useAuth() as any;
  const institutionId = user?.institutions?.[0]?.id;

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "segunda",
    startTime: "08:00",
    endTime: "12:00",
    interval: 30,
    maxAppointments: 10,
  });

  const daysOfWeek = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  useEffect(() => {
    if (institutionId) {
      fetchAvailability();
    }
  }, [institutionId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/institutions/${institutionId}/availability`,
      );
      setTimeSlots(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const slot: TimeSlot = {
      ...newSlot,
    };

    setTimeSlots([...timeSlots, slot]);
    toast.success("Horário adicionado à grade!");

    // Reset form
    setNewSlot({
      dayOfWeek: "segunda",
      startTime: "08:00",
      endTime: "12:00",
      interval: 30,
      maxAppointments: 10,
    });
  };

  const handleDeleteSlot = (idx: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== idx));
    toast.success("Horário removido da grade local");
  };

  const handleSaveSchedule = async () => {
    try {
      await api.post(`/institutions/${institutionId}/availability`, timeSlots);
      toast.success("Grade de horários salva permanentemente!", {
        description: "Os novos períodos já estão ativos no sistema.",
      });
      fetchAvailability();
    } catch (error) {
      toast.error("Erro ao salvar grade de horários");
    }
  };

  const getDayLabel = (day: string) => {
    return daysOfWeek.find((d) => d.value === day)?.label || day;
  };

  // Agrupa horários por dia
  const groupedSlots = timeSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = [];
      }
      acc[slot.dayOfWeek].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Configurando sua agenda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Horários da Agenda
          </h1>
          <p className="text-gray-600 mt-1">
            Defina seus turnos e intervalos para agendamento automático
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form para adicionar horário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[var(--brand-blue)]" />
                Adicionar Período
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dia da Semana
                  </label>
                  <select
                    value={newSlot.dayOfWeek}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, dayOfWeek: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Início
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) =>
                        setNewSlot({ ...newSlot, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fim
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) =>
                        setNewSlot({ ...newSlot, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo (minutos)
                  </label>
                  <select
                    value={newSlot.interval}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        interval: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite de Pacientes/Turno
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newSlot.maxAppointments}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        maxAppointments: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>

                <button
                  onClick={handleAddSlot}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Incluir na Grade
                </button>
              </div>
            </div>
          </div>

          {/* Lista de horários configurados */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--brand-blue)]" />
                  Grade de Atendimento Real
                </h3>
                <button
                  onClick={handleSaveSchedule}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Salvar Todas Alterações
                </button>
              </div>

              {Object.keys(groupedSlots).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                  <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nenhum horário configurado ainda
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Defina seus períodos de trabalho ao lado
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {daysOfWeek.map((day) => {
                    const daySlots = groupedSlots[day.value];
                    if (!daySlots || daySlots.length === 0) return null;

                    return (
                      <div
                        key={day.value}
                        className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors"
                      >
                        <h4 className="font-bold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-2">
                          {day.label}
                        </h4>
                        <div className="space-y-3">
                          {daySlots.map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <span className="font-bold text-gray-900">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                                <div className="hidden sm:block text-sm text-gray-600">
                                  Intervalo:{" "}
                                  <span className="font-semibold">
                                    {slot.interval}min
                                  </span>
                                </div>
                                <div className="hidden sm:block text-sm text-gray-600">
                                  Capacidade:{" "}
                                  <span className="font-semibold">
                                    {slot.maxAppointments}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  handleDeleteSlot(timeSlots.indexOf(slot))
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mt-6 shadow-sm">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Automatização de Agenda
              </h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>
                  • O sistema usa estes períodos para gerar horários de
                  agendamento automáticos.
                </li>
                <li>
                  • Intervalos menores (ex: 15min) aumentam a oferta de vagas,
                  mas reduzem o tempo de consulta.
                </li>
                <li>
                  • Você pode pausar atendimentos removendo os períodos da
                  grade.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
