import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Building2, User, Phone, Save, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PerfilUE() {
  const { user, updateProfile } = useAuth() as any;
  const [activeTab, setActiveTab] = useState<"pessoal" | "organizacao">(
    "pessoal",
  );
  const [loadingCep, setLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cep: user?.cep || "",
    street: user?.street || "",
    number: user?.number || "",
    neighborhood: user?.neighborhood || "",
    city: user?.city || "",
    state: user?.state || "",
  });

  // Atualizar formData quando o user carregar
  useEffect(() => {
    if (user) {
      setFormData({
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
  }, [user]);

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
          setFormData((prev) => ({
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

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Configurações Corporativas
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
              Dados do Gestor
            </button>
            <button
              onClick={() => setActiveTab("organizacao")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "organizacao"
                  ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Organização
            </button>
          </div>
        </div>

        {activeTab === "pessoal" && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-b-xl shadow-lg p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Pessoal
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {/* Endereço Estruturado */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-[var(--brand-blue)]">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-xs tracking-wider">
                    Endereço
                  </h3>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-500 mb-2">
                  <strong>Endereço Atual:</strong> {user?.street}, {user?.number} - {user?.neighborhood}, {user?.city}/{user?.state} (CEP: {user?.cep})
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => {
                        const val = maskCEP(e.target.value);
                        setFormData({ ...formData, cep: val });
                        if (val.length === 9) handleCepLookup(val);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rua</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nº</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UF</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                <Save className="w-4 h-4" />
                Salvar Dados do Gestor
              </button>
            </div>
          </form>
        )}

        {activeTab === "organizacao" && (
          <div className="bg-white rounded-b-xl shadow-lg p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Organização
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    defaultValue={user?.organizationName}
                    disabled
                    className="w-full pl-11 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  defaultValue={user?.cnpj}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Para alterar dados da organização,
                  entre em contato com o suporte administrativo global.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
