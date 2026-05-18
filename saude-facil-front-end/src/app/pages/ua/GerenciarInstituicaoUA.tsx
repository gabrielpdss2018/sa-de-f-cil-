import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
  Star,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../services/api";

export function GerenciarInstituicaoUA() {
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingCep, setLoadingCep] = useState(false);
  const [institution, setInstitution] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    phone: "",
    email: "",
    description: "",
    status: "ativo",
    verified: true,
    maxAppointmentsPerDay: 50,
    averageWaitTime: 15,
  });

  // Endereço granular
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // Máscaras
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const handleCepLookup = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
          toast.success("Endereço localizado!");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  useEffect(() => {
    fetchInstitutionData();
  }, [institutionId]);

  const fetchInstitutionData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/institutions/${institutionId}`);
      const data = response.data;
      setInstitution(data);
      setForm({
        name: data.name,
        type: data.type,
        phone: data.phone,
        email: data.manager?.email || "",
        description: data.description || "",
        status: "ativo",
        verified: true,
        maxAppointmentsPerDay: 50,
        averageWaitTime: 15,
      });
      setAddress({
        cep: data.cep || "",
        street: data.street || "",
        number: data.number || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados da instituição:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/institutions/${institutionId}`, {
        ...form,
        ...address,
      });
      toast.success("Configurações da instituição atualizadas com sucesso!");
      fetchInstitutionData();
    } catch (error) {
      toast.error("Erro ao salvar alterações");
    }
  };

  const handleToggleVerification = () => {
    setForm((prev) => ({ ...prev, verified: !prev.verified }));
    toast.success(
      form.verified
        ? "Verificação removida"
        : "Instituição verificada com sucesso!",
    );
  };

  const handleToggleStatus = () => {
    const newStatus = form.status === "ativo" ? "inativo" : "ativo";
    setForm((prev) => ({ ...prev, status: newStatus }));
    toast.success(
      `Instituição ${newStatus === "ativo" ? "ativada" : "desativada"} com sucesso!`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">
          Carregando configurações da instituição...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/ua/instituicoes")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Gestão de Instituições
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciar Instituição
            </h1>
            <p className="text-gray-600 mt-1">
              Configure as informações e permissões da instituição
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleToggleVerification}
              className={`px-6 py-3 rounded-xl transition-colors font-semibold ${
                form.verified
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {form.verified ? "✓ Verificada" : "Marcar como Verificada"}
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-3 rounded-xl transition-colors font-semibold ${
                form.status === "ativo"
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {form.status === "ativo" ? "Desativar" : "Ativar"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Informações Básicas
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Instituição
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Instituição
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                      required
                    >
                      <option value="clinica">Clínica</option>
                      <option value="laboratorio">Laboratório</option>
                      <option value="hospital">Hospital</option>
                    </select>
                  </div>

                  {/* Endereço Estruturado */}
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-[var(--brand-blue)]">
                      <MapPin className="w-5 h-5" />
                      <h3 className="font-bold uppercase text-xs tracking-wider">
                        Endereço
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                        <input
                          type="text"
                          value={address.cep}
                          onChange={(e) => {
                            const val = maskCEP(e.target.value);
                            setAddress({ ...address, cep: val });
                            if (val.length === 9) handleCepLookup(val);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logradouro</label>
                        <input
                          type="text"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº</label>
                        <input
                          type="text"
                          value={address.number}
                          onChange={(e) => setAddress({ ...address, number: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro</label>
                        <input
                          type="text"
                          value={address.neighborhood}
                          onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UF</label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              phone: maskPhone(e.target.value),
                            }))
                          }
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Responsável
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={form.email}
                          className="w-full pl-11 pr-4 py-3 border border-gray-100 bg-gray-50 text-gray-500 rounded-lg outline-none"
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/ua/instituicoes")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Status da Conta
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      form.status === "ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {form.status === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Verificação
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      form.verified
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {form.verified ? "✓ Verificada" : "Não Verificada"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Avaliação
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {institution?.rating}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Baseado em avaliações de pacientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
