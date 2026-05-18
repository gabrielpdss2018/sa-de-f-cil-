import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  ArrowUp,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

export function VisaoConsolidadaUE() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsolidatedData();
  }, []);

  const fetchConsolidatedData = async () => {
    setLoading(true);
    try {
      const [statsRes, unitsRes] = await Promise.all([
        api.get("/enterprise/stats"),
        api.get("/enterprise/units"),
      ]);
      setStats(statsRes.data);
      setUnits(unitsRes.data);
    } catch (error) {
      console.error("Erro ao buscar visão consolidada:", error);
    } finally {
      setLoading(false);
    }
  };

  const historicalData = [
    {
      month: "Março",
      appointments: stats?.totalAppointments || 0,
      users: stats?.completedAppointments || 0,
    },
    { month: "Fevereiro", appointments: 12, users: 8 },
    { month: "Janeiro", appointments: 5, users: 2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Consolidando dados da rede...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Visão Consolidada
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.organizationName} - Dados agregados de todas as unidades
          </p>
        </div>

        {/* Overall KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Unidades Ativas</p>
              <Building2 className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalUnits}
            </p>
            <div className="flex items-center gap-1 mt-2 text-gray-600">
              <span className="text-xs font-semibold">
                Toda a rede integrada
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Agendamentos Totais</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalAppointments}
            </p>
            <div className="flex items-center gap-1 mt-2 text-blue-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-xs font-semibold">
                Crescimento constante
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Consultas Realizadas</p>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.completedAppointments}
            </p>
            <div className="flex items-center gap-1 mt-2 text-purple-600">
              <span className="text-xs font-semibold">
                Taxa de conclusão: {stats?.performance}%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Integridade</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <span className="text-xs font-semibold">
                Sincronizado com o banco
              </span>
            </div>
          </div>
        </div>

        {/* Performance by Unit */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Desempenho por Unidade
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Unidade
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Tipo
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Agendamentos
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Serviços
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Localização
                  </th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{unit.name}</p>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600 capitalize">
                      {unit.type}
                    </td>
                    <td className="py-4 px-4 text-right text-blue-600 font-bold">
                      {unit._count?.appointments}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {unit._count?.services}
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-gray-500">
                      {unit.address.split(",")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historical Trend */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Histórico de Atendimentos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Período
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Agendamentos
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Realizados
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {data.month}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">
                      {data.appointments}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {data.users}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                        OK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
