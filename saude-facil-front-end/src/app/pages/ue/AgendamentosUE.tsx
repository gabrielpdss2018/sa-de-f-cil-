import { useState, useEffect } from "react";
import api from "../../services/api";
import { Calendar, Clock, User, Search, Loader2 } from "lucide-react";

export function AgendamentosUE() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "todos" | "agendado" | "concluido" | "cancelado"
  >("todos");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/enterprise/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.institution?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    agendado: appointments.filter((a) => a.status === "agendado").length,
    concluido: appointments.filter((a) => a.status === "concluido").length,
    cancelado: appointments.filter((a) => a.status === "cancelado").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Consolidando agendamentos da rede...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agendamentos Consolidados
        </h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-sm text-gray-500 mb-1">Agendados</p>
            <p className="text-3xl font-bold text-blue-600">{stats.agendado}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-sm text-gray-500 mb-1">Concluídos</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.concluido}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-sm text-gray-500 mb-1">Cancelados</p>
            <p className="text-3xl font-bold text-red-600">{stats.cancelado}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por paciente, instituição ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
            >
              <option value="todos">Todos os Status</option>
              <option value="agendado">Agendado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Paciente
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Instituição
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Serviço
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Data
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Horário
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {apt.patient?.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {apt.institution?.name}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {apt.service?.name}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.date).toLocaleDateString("pt-BR")}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-900">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            apt.status === "agendado"
                              ? "bg-blue-100 text-blue-700"
                              : apt.status === "concluido"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
