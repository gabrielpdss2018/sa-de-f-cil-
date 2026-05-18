import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  User,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

export function PerfilUP() {
  const { user, updateProfile } = useAuth() as any;
  const [activeTab, setActiveTab] = useState<"pessoal" | "instituicao">(
    "pessoal",
  );
  const [loading, setLoading] = useState(true);
  const [loadingCep, setLoadingCep] = useState(false);
  const [institution, setInstitution] = useState<any>(null);
  const [newSpecialty, setNewSpecialty] = useState("");

  // Dados estruturados
  const [userForm, setUserForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cep: user?.cep || "",
    street: user?.street || "",
    number: user?.number || "",
    neighborhood: user?.neighborhood || "",
    city: user?.city || "",
    state: user?.state || "",
  });

  const [instAddress, setInstAddress] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const institutionId = user?.institutions?.[0]?.id;

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

  const handleCepLookup = async (cep: string, target: "user" | "inst") => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        );
        const data = await response.json();
        if (!data.erro) {
          const updates = {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          };
          if (target === "user") setUserForm((prev) => ({ ...prev, ...updates }));
          else setInstAddress((prev) => ({ ...prev, ...updates }));
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
    if (institutionId) {
      fetchInstitution();
    }
    if (user) {
      setUserForm({
        name: user.name || "",
        phone: user.phone || "",
        cep: user.cep || "",
        street: user.street || "",
        number: user.number || "",
        neighborhood: user.neighborhood || "",
        city: user.city || "",
        state: user.state || "",
      });
    }
  }, [institutionId, user]);

  const fetchInstitution = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/institutions/${institutionId}`);
      const data = response.data;
      setInstitution(data);
      setInstAddress({
        cep: data.cep || "",
        street: data.street || "",
        number: data.number || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
      });
    } catch (error) {
      console.error("Erro ao buscar instituição:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e: any) => {
    e.preventDefault();
    try {
      await updateProfile(userForm);
      toast.success("Dados pessoais atualizados!");
    } catch (error) {
      toast.error("Erro ao atualizar dados pessoais");
    }
  };

  const handleSaveInstitution = async (e: any) => {
    e.preventDefault();
    try {
      await api.patch(`/institutions/${institutionId}`, {
        ...institution,
        ...instAddress,
      });
      toast.success("Dados da instituição atualizados!");
      fetchInstitution();
    } catch (error) {
      toast.error("Erro ao atualizar instituição");
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      const updatedSpecs = [...(institution.specialties || []), newSpecialty];
      setInstitution({ ...institution, specialties: updatedSpecs });
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    const updatedSpecs = (institution.specialties || []).filter(
      (_: any, i: number) => i !== index,
    );
    setInstitution({ ...institution, specialties: updatedSpecs });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Sincronizando perfil da instituição...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Configurações de Perfil
        </h1>

        <div className="bg-white rounded-t-xl shadow-lg">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pessoal")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "pessoal"
                  ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab("instituicao")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "instituicao"
                  ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dados da Instituição
            </button>
          </div>
        </div>

        {activeTab === "pessoal" && (
          <form
            onSubmit={handleSaveUser}
            className="bg-white rounded-b-xl shadow-lg p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Responsável
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: maskPhone(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {/* Endereço Estruturado (Pessoal) */}
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
                      value={userForm.cep}
                      onChange={(e) => {
                        const val = maskCEP(e.target.value);
                        setUserForm({ ...userForm, cep: val });
                        if (val.length === 9) handleCepLookup(val, "user");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rua</label>
                    <input
                      type="text"
                      value={userForm.street}
                      onChange={(e) => setUserForm({ ...userForm, street: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº</label>
                    <input
                      type="text"
                      value={userForm.number}
                      onChange={(e) => setUserForm({ ...userForm, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                <Save className="w-4 h-4" />
                Salvar Dados Pessoais
              </button>
            </div>
          </form>
        )}

        {activeTab === "instituicao" && (
          <form
            onSubmit={handleSaveInstitution}
            className="bg-white rounded-b-xl shadow-lg p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Instituição
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={institution?.name}
                    onChange={(e) =>
                      setInstitution({ ...institution, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
              </div>

              {/* Endereço Estruturado (Instituição) */}
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
                      value={instAddress.cep}
                      onChange={(e) => {
                        const val = maskCEP(e.target.value);
                        setInstAddress({ ...instAddress, cep: val });
                        if (val.length === 9) handleCepLookup(val, "inst");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logradouro</label>
                    <input
                      type="text"
                      value={instAddress.street}
                      onChange={(e) => setInstAddress({ ...instAddress, street: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº</label>
                    <input
                      type="text"
                      value={instAddress.number}
                      onChange={(e) => setInstAddress({ ...instAddress, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro</label>
                    <input
                      type="text"
                      value={instAddress.neighborhood}
                      onChange={(e) => setInstAddress({ ...instAddress, neighborhood: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                    <input
                      type="text"
                      value={instAddress.city}
                      onChange={(e) => setInstAddress({ ...instAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UF</label>
                    <input
                      type="text"
                      value={instAddress.state}
                      onChange={(e) => setInstAddress({ ...instAddress, state: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={institution?.description || ""}
                  onChange={(e) =>
                    setInstitution({
                      ...institution,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Descreva sua instituição..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSpecialty())
                    }
                    placeholder="Ex: Dermatologia"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(institution?.specialties || []).map(
                    (spec: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg"
                      >
                        <span className="text-sm font-medium">{spec}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialty(idx)}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                <Save className="w-4 h-4" />
                Salvar Dados da Instituição
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
