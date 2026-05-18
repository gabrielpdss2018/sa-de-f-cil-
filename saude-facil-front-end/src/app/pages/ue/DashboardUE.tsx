import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import {
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import api from "../../services/api";

export function DashboardUE() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnterpriseData();
  }, []);

  const fetchEnterpriseData = async () => {
    setLoading(true);
    try {
      const [statsRes, unitsRes] = await Promise.all([
        api.get("/enterprise/stats"),
        api.get("/enterprise/units"),
      ]);
      setStats(statsRes.data);
      setUnits(unitsRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados empresariais:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando visão corporativa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.organizationName}
          </h1>
          <p className="text-gray-600 mt-1">Painel de Gestão Empresarial</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-16 h-16 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Faturamento Mês
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                R$ {stats?.monthlyRevenue?.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs font-semibold text-blue-600 mt-4 bg-blue-50 w-fit px-2 py-1 rounded-full">
                Consolidado
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Faturamento Ano
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
              <Building2 className="w-16 h-16 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Unidades Ativas
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {stats?.totalUnits}
              </p>
              <p className="text-xs font-semibold text-purple-600 mt-4">
                Gestão Total
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="w-16 h-16 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Performance
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {stats?.performance}%
              </p>
              <p className="text-xs font-semibold text-orange-600 mt-4">
                Taxa de Conclusão
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/ue/usuarios"
            className="bg-gradient-to-br from-[var(--brand-blue)] to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Gestão de Usuários</h3>
                <p className="text-blue-100">Cadastre e vincule usuários</p>
              </div>
              <Users className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ue/unidades"
            className="bg-gradient-to-br from-[var(--brand-green)] to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Gestão de Unidades</h3>
                <p className="text-green-100">Gerencie suas unidades</p>
              </div>
              <Building2 className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Desempenho por Unidade
              </h3>
              <div className="space-y-4">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={unit.image}
                        alt={unit.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{unit.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {unit.type} • {unit.address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--brand-blue)]">
                        {unit._count?.appointments} agendamentos
                      </p>
                      <p className="text-xs text-gray-500">
                        {unit._count?.services} serviços
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h3 className="font-bold text-gray-900 mb-4">
              Relatório Consolidado
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Acesse métricas detalhadas de todas as unidades em um só lugar.
            </p>
            <Link
              to="/ue/consolidado"
              className="block w-full py-3 bg-[var(--brand-blue)] text-white text-center rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Visualizar Métricas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
