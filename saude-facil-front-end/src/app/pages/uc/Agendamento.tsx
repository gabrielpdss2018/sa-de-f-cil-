import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function Agendamento() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      toast.error("Erro ao carregar detalhes do serviço");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando formulário de agendamento...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Serviço não encontrado</p>
      </div>
    );
  }

  const institution = service.institution;
  const availableSlots = service.timeSlots || [];

  // Agrupar datas únicas
  const dates = Array.from(
    new Set(availableSlots.map((s: any) => s.date.split("T")[0])),
  );

  const timesForDate = selectedDate
    ? availableSlots
        .filter((s: any) => s.date.split("T")[0] === selectedDate)
        .map((s: any) => s.time)
    : [];

  const handleConfirm = async () => {
    if (!user || !service || !institution || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      await api.post("/appointments", {
        institutionId: institution.id,
        serviceId: service.id,
        date: selectedDate,
        time: selectedTime,
      });

      toast.success("Agendamento realizado com sucesso!");
      setConfirmed(true);
      setTimeout(() => {
        navigate("/uc/historico");
      }, 2500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Erro ao realizar agendamento",
      );
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Você receberá uma confirmação por email e SMS
          </p>
          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
            <div>
              <p className="text-sm text-gray-500">Instituição</p>
              <p className="font-bold text-gray-900">{institution.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Serviço</p>
              <p className="font-bold text-gray-900">{service.name}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-bold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Horário</p>
                <p className="font-bold text-gray-900">{selectedTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/uc/instituicao/${institution.id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agendar Serviço
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Service Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Resumo</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Instituição</p>
                  <p className="font-semibold text-gray-900">
                    {institution.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serviço</p>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duração</p>
                  <p className="font-semibold text-gray-900">
                    {service.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="text-2xl font-bold text-[var(--brand-blue)]">
                    R$ {service.price.toFixed(2)}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{institution.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Escolha a Data
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {dates.map((date: any) => (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedDate === date
                            ? "border-[var(--brand-blue)] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">
                          {new Date(date + "T12:00:00").toLocaleDateString(
                            "pt-BR",
                            { day: "2-digit", month: "short" },
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(date + "T12:00:00").toLocaleDateString(
                            "pt-BR",
                            { weekday: "short" },
                          )}
                        </p>
                      </button>
                    ))}
                  </div>
                  {dates.length === 0 && (
                    <p className="text-sm text-red-500">
                      Não há datas disponíveis para este serviço no momento.
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Escolha o Horário
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timesForDate.map((time: any) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                            selectedTime === time
                              ? "border-[var(--brand-blue)] bg-blue-50 text-[var(--brand-blue)]"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient Info */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Dados do Paciente
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-semibold text-gray-900">
                        {user?.name}
                      </span>
                    </div>
                    {user?.cpf && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPF:</span>
                        <span className="font-semibold text-gray-900">
                          {user?.cpf}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-semibold text-gray-900">
                        {user?.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedDate && selectedTime
                      ? "bg-[var(--brand-green)] text-white hover:opacity-90 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
