import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Users,
  Calendar,
  TrendingUp,
  Edit2,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

export function DetalhesUnidadeUE() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnitData();
  }, [unitId]);

  const fetchUnitData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/institutions/${unitId}`);
      setUnit(response.data);
    } catch (error) {
      console.error("Erro ao buscar unidade:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando detalhes da unidade...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Unidade não encontrada</p>
          <button
            onClick={() => navigate("/ue/unidades")}
            className="px-6 py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para Unidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/ue/unidades")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Unidades
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {unit.name}
            </h1>
            <p className="text-gray-600">Informações detalhadas da unidade</p>
          </div>
          <button
            onClick={() => navigate(`/ue/unidades/editar/${unitId}`)}
            className="flex items-center gap-2 px-4 py-2 text-[var(--brand-blue)] border border-[var(--brand-blue)] rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informações da Unidade
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {unit.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {unit.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {unit.phone}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">ID da Unidade</p>
                  <p className="font-mono text-gray-900 font-semibold">
                    {unit.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Desempenho */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumo da Unidade
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50 rounded-xl">
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-blue-700 mb-1">Status</p>
                  <p className="text-2xl font-bold text-blue-900 capitalize">
                    {unit.type}
                  </p>
                </div>

                <div className="p-5 bg-green-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-green-700 mb-1">
                    Serviços Oferecidos
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {unit.services?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--brand-blue)]" />
                Destaque
              </h3>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-[var(--brand-blue)] mb-2">
                  {unit.rating}
                </p>
                <p className="text-gray-600">Nota Média</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full py-2.5 text-left px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                  Relatório da Unidade
                </button>
                <button className="w-full py-2.5 text-left px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-semibold">
                  Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
