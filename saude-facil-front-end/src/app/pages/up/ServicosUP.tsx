import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "sonner";

export function ServicosUP() {
  const { user } = useAuth() as any;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "consulta",
    price: 0,
    duration: "",
  });

  const institutionId = user?.institutions?.[0]?.id;

  useEffect(() => {
    if (institutionId) {
      fetchServices();
    }
  }, [institutionId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/services/institution/${institutionId}`);
      setServices(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      price: service.price,
      duration: service.duration,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.patch(`/services/${editingService.id}`, formData);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await api.post("/services", { ...formData, institutionId });
        toast.success("Serviço cadastrado com sucesso!");
      }
      setShowForm(false);
      setEditingService(null);
      setFormData({ name: "", type: "consulta", price: 0, duration: "" });
      fetchServices();
    } catch (error) {
      toast.error("Erro ao salvar serviço");
    }
  };

  const handleDelete = async (id: string, serviceName: string) => {
    if (!confirm(`Deseja realmente excluir o serviço "${serviceName}"?`))
      return;

    try {
      await api.delete(`/services/${id}`);
      toast.success(`Serviço "${serviceName}" excluído!`);
      fetchServices();
    } catch (error) {
      toast.error("Erro ao excluir serviço");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Serviços Cadastrados
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie os serviços oferecidos pela sua instituição
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setEditingService(null);
                setFormData({
                  name: "",
                  type: "consulta",
                  price: 0,
                  duration: "",
                });
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingService ? "Editar Serviço" : "Cadastrar Novo Serviço"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Serviço
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Consulta Cardiológica"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="exame">Exame</option>
                    <option value="procedimento">Procedimento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0.00"
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="Ex: 30 min"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  {editingService ? "Salvar Alterações" : "Salvar Serviço"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {service.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4 capitalize">
                {service.type}
              </span>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Valor</span>
                  </div>
                  <span className="text-xl font-bold text-[var(--brand-blue)]">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duração</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {service.duration}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 text-xs text-gray-500">
                  Total de agendamentos: {service._count?.appointments || 0}
                </div>
              </div>
            </div>
          ))}

          {services.length === 0 && !showForm && (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum serviço cadastrado ainda.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-[var(--brand-blue)] font-semibold hover:underline"
              >
                Cadastrar o primeiro serviço
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
