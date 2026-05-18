import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Calendar,
  Loader2,
} from "lucide-react";
import api from "../../services/api";
import { toast } from "sonner";

export function PerfilUC() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCep, setLoadingCep] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    // Campos de endereço estruturado
    cep: user?.cep || "",
    street: user?.street || "",
    number: user?.number || "",
    neighborhood: user?.neighborhood || "",
    city: user?.city || "",
    state: user?.state || "",
  });

  // Atualizar formData quando o user carregar (ex: após login ou refresh)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/appointments/my");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeAppointments = appointments.filter(
    (apt) => apt.status === "agendado",
  );

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {user?.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">Paciente</p>
              <div className="pt-4 border-t border-gray-200 text-left space-y-2">
                <div>
                  <p className="text-xs text-gray-500">CPF</p>
                  <p className="font-semibold text-gray-900">{user?.cpf}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ID</p>
                  <p className="font-mono text-sm text-gray-700">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h4 className="font-bold text-gray-900 mb-4">Estatísticas</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Agendamentos Ativos</span>
                  <span className="font-bold text-blue-600">
                    {activeAppointments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Consultas</span>
                  <span className="font-bold text-gray-900">
                    {appointments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Informações Pessoais
                </h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-[var(--brand-blue)] border border-[var(--brand-blue)] rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          cep: user?.cep || "",
                          street: user?.street || "",
                          number: user?.number || "",
                          neighborhood: user?.neighborhood || "",
                          city: user?.city || "",
                          state: user?.state || "",
                        });
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none ${
                        editing
                          ? "focus:ring-2 focus:ring-[var(--brand-blue)]"
                          : "bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none ${
                        editing
                          ? "focus:ring-2 focus:ring-[var(--brand-blue)]"
                          : "bg-gray-50"
                      }`}
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
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: maskPhone(e.target.value),
                        })
                      }
                      disabled={!editing}
                      className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg outline-none ${
                        editing
                          ? "focus:ring-2 focus:ring-[var(--brand-blue)]"
                          : "bg-gray-50"
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* Endereço Estruturado */}
                <div
                  className={`space-y-4 rounded-2xl border border-gray-100 ${editing ? "bg-gray-50 p-6" : "p-0 border-none"}`}
                >
                  <div className="flex items-center gap-2 mb-2 text-[var(--brand-blue)]">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-wider">
                      Endereço
                    </h3>
                  </div>

                  {!editing ? (
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">
                      {user?.street}, {user?.number} - {user?.neighborhood},{" "}
                      {user?.city}/{user?.state} (CEP: {user?.cep})
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.cep}
                          onChange={(e) => {
                            const val = maskCEP(e.target.value);
                            setFormData({ ...formData, cep: val });
                            if (val.length === 9) handleCepLookup(val);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Logradouro
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="Rua, Avenida..."
                          disabled={loadingCep}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Nº
                        </label>
                        <input
                          type="text"
                          value={formData.number}
                          onChange={(e) =>
                            setFormData({ ...formData, number: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="123"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              neighborhood: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="Bairro"
                          disabled={loadingCep}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="Cidade"
                          disabled={loadingCep}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          UF
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              state: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] outline-none text-sm"
                          placeholder="MT"
                          maxLength={2}
                          disabled={loadingCep}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Segurança</h4>
                <button className="flex items-center gap-2 text-[var(--brand-blue)] hover:underline">
                  <Lock className="w-4 h-4" />
                  Alterar Senha
                </button>
              </div>
            </div>

            {/* Next Appointments */}
            {activeAppointments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximos Agendamentos
                </h3>
                <div className="space-y-3">
                  {activeAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {apt.institution?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {apt.service?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {new Date(apt.date).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
