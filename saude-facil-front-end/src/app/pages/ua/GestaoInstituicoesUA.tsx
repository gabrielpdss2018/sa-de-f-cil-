import { useState, useEffect } from "react";
import { MapPin, Star, Loader2, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function GestaoInstituicoesUA() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/institutions");
      setInstitutions(response.data);
    } catch (error) {
      console.error("Erro ao buscar instituições para admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Deseja realmente EXCLUIR a instituição "${name}"? Esta ação apagará todos os serviços e agendamentos vinculados a ela.`,
      )
    )
      return;

    try {
      await api.delete(`/admin/institutions/${id}`);
      setInstitutions(institutions.filter((i) => i.id !== id));
      toast.success("Instituição removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir instituição:", error);
      toast.error("Não foi possível excluir a instituição.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Mapeando rede de saúde...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestão de Instituições
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {institutions.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-40 bg-gray-200 overflow-hidden">
                <img
                  src={inst.image}
                  alt={inst.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {inst.name}
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">
                      {inst.rating}
                    </span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3 capitalize">
                  {inst.type}
                </span>
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{inst.address}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/ua/instituicoes/gerenciar/${inst.id}`)
                    }
                    className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm"
                  >
                    Gerenciar
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/ua/instituicoes/estatisticas/${inst.id}`)
                    }
                    className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                  >
                    Estatísticas
                  </button>
                  <button
                    onClick={() => handleDelete(inst.id, inst.name)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Excluir Instituição"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
