import { useState, useEffect } from "react";
import {
  Users,
  Building,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

export function DashboardUA() {
  const [stats, setStats] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, instRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/institutions"),
      ]);
      setStats(statsRes.data);
      setInstitutions(instRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados administrativos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando central de comando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Painel Administrativo
        </h1>

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
                R$ {stats?.revenue?.totalMonthly.toLocaleString("pt-BR")}
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-full">
                <Activity className="w-3 h-3" />
                Consultas + Planos
              </div>
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
                R$ {stats?.revenue?.totalAnnual.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs font-semibold text-green-600 mt-4">
                Jan {new Date().getFullYear()} - Hoje
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-purple-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building className="w-16 h-16 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Lucro de Planos
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                R$ {stats?.revenue?.plansMonthly.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs font-semibold text-purple-600 mt-4">
                UP (R$299) • UE (R$799)
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-xl border-t-4 border-orange-500 transition-transform hover:scale-105">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-16 h-16 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Média de Uso
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {stats?.averageUsage}
              </p>
              <p className="text-xs font-semibold text-orange-600 mt-4">
                Agendamentos p/ Paciente
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Composição da Base</h3>
                <p className="text-sm text-gray-500">Distribuição total de {stats?.usersCount} usuários</p>
              </div>
              <Users className="w-10 h-10 text-[var(--brand-blue)] opacity-20" />
            </div>

            <div className="space-y-6">
              {/* Barra de Proporção */}
              <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-100">
                <div 
                  style={{ width: `${(stats?.ucCount / stats?.usersCount) * 100}%` }}
                  className="bg-blue-500 h-full"
                />
                <div 
                  style={{ width: `${(stats?.upCount / stats?.usersCount) * 100}%` }}
                  className="bg-green-500 h-full"
                />
                <div 
                  style={{ width: `${(stats?.ueCount / stats?.usersCount) * 100}%` }}
                  className="bg-purple-500 h-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase">Cidadãos (UC)</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">{stats?.ucCount}</p>
                  <p className="text-[10px] text-blue-700 mt-1 font-medium">{((stats?.ucCount / stats?.usersCount) * 100).toFixed(1)}% do total</p>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                  <p className="text-xs font-bold text-green-600 uppercase">Parceiros (UP)</p>
                  <p className="text-2xl font-black text-green-900 mt-1">{stats?.upCount}</p>
                  <p className="text-[10px] text-green-700 mt-1 font-medium">{((stats?.upCount / stats?.usersCount) * 100).toFixed(1)}% do total</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <p className="text-xs font-bold text-purple-600 uppercase">Empresas (UE)</p>
                  <p className="text-2xl font-black text-purple-900 mt-1">{stats?.ueCount}</p>
                  <p className="text-[10px] text-purple-700 mt-1 font-medium">{((stats?.ueCount / stats?.usersCount) * 100).toFixed(1)}% do total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--brand-blue)] to-blue-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Saúde do Ecossistema</h3>
              <p className="text-blue-100 text-sm mb-8">Análise de engajamento global</p>

              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black">{stats?.averageUsage}</p>
                  <p className="text-blue-200 text-xs mt-1 uppercase font-bold tracking-tighter">Consultas por Cidadão</p>
                </div>
                <div className="pt-6 border-t border-blue-400/30">
                  <p className="text-4xl font-black">{stats?.appointmentsCount}</p>
                  <p className="text-blue-200 text-xs mt-1 uppercase font-bold tracking-tighter">Agendamentos Totais</p>
                </div>
              </div>
            </div>
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-10" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estado do Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900 font-medium">Banco de Dados</p>
                  <p className="text-sm text-green-600">
                    Conectado (PostgreSQL)
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900 font-medium">Servidor de API</p>
                  <p className="text-sm text-green-600">Online</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900 font-medium">Segurança JWT</p>
                  <p className="text-sm text-blue-600">Ativa</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Monitoramento Global
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-900 font-semibold">
                  Saúde do Sistema: 100%
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Todos os módulos estão operando normalmente e integrados ao
                  banco.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 font-semibold">
                  Integridade de Dados
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Prisma ORM garantindo consistência relacional.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Visão Geral das Instituições
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Instituição
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Responsável
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Serviços
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Agendamentos
                  </th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst) => (
                  <tr
                    key={inst.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{inst.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {inst.type}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 text-sm">
                      <p>{inst.manager?.name}</p>
                      <p className="text-xs opacity-70">
                        {inst.manager?.email}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700 font-medium">
                      {inst._count?.services}
                    </td>
                    <td className="py-4 px-4 text-right text-[var(--brand-blue)] font-bold">
                      {inst._count?.appointments}
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
