import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Building2, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export function NovaUnidadeUE() {
  const navigate = useNavigate();
  const { user } = useAuth() as any;
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    type: "clinica",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      await api.post("/institutions", {
        ...formData,
        organizationId: user?.organizationId,
      });

      toast.success("Unidade cadastrada com sucesso!");
      setTimeout(() => navigate("/ue/unidades"), 1500);
    } catch (error) {
      toast.error("Erro ao cadastrar unidade");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/ue/unidades")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Unidades
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Cadastrar Nova Unidade
          </h1>
          <p className="text-gray-600 mt-1">
            Adicione uma nova unidade à sua organização
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Unidade *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  placeholder="Ex: Unidade Centro"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                  placeholder="Rua, número, bairro, cidade, estado"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  placeholder="(00) 0000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                placeholder="Informações adicionais sobre a unidade..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                <Save className="w-4 h-4" />
                Cadastrar Unidade
              </button>
              <button
                onClick={() => navigate("/ue/unidades")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h4 className="font-bold text-blue-900 mb-3">💡 Dica</h4>
          <p className="text-blue-800 text-sm">
            Após cadastrar a unidade, você poderá vincular usuários (UC e UP) a
            ela na página de Gestão de Usuários.
          </p>
        </div>
      </div>
    </div>
  );
}
