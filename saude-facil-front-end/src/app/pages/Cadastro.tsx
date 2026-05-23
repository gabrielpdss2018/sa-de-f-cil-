import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router";
import {
  Heart,
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

type ProfileType = "UC" | "UP" | "UE";

export function Cadastro() {
  const { register, login } = useAuth();
  const [profileType, setProfileType] = useState<ProfileType>("UC");
  const [formData, setFormData] = useState({
    // Campos comuns
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
    // Endereço separado
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    // Campos específicos UP e UE
    cnpj: "",
    institutionName: "",
    organizationName: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const navigate = useNavigate();

  // Máscaras
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

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
          toast.success("Endereço preenchido automaticamente!");
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      // Criar novo usuário
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: profileType,
        phone: formData.phone,
        cpf: formData.cpf,
        // Endereço estruturado
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        ...(profileType === "UP" && {
          cnpj: formData.cnpj,
          institutionName: formData.institutionName,
        }),
        ...(profileType === "UE" && {
          cnpj: formData.cnpj,
          organizationName: formData.organizationName,
        }),
      });

      toast.success("Conta criada com sucesso! Acessando painel...");
      
      // Fazer login automático imediatamente
      await login(formData.email, formData.password);
      
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao criar conta. Tente novamente.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
        <div className="bg-[var(--brand-blue)] p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="font-bold tracking-wider text-sm">
                SAÚDE FÁCIL
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
            <p className="text-blue-100 opacity-90">
              Escolha seu perfil e comece a usar a plataforma
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-8">
          {/* Perfil Selection */}
          <div className="flex gap-4 mb-10">
            {[
              { id: "UC", label: "Cidadão", icon: User },
              { id: "UP", label: "Clínica", icon: Building2 },
              { id: "UE", label: "Empresa", icon: Briefcase },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setProfileType(type.id as ProfileType)}
                className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  profileType === type.id
                    ? "border-[var(--brand-blue)] bg-blue-50 text-[var(--brand-blue)] scale-105"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                <type.icon
                  className={`w-6 h-6 ${profileType === type.id ? "text-[var(--brand-blue)]" : "text-gray-400"}`}
                />
                <span className="font-bold text-sm">{type.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Informações Gerais */}
            <div className="md:col-span-2 space-y-4">
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                    placeholder="exemplo@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                      placeholder="••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                      placeholder="••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Telefone */}
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
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* Documento baseada no perfil */}
                {profileType === "UC" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: maskCPF(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                      placeholder="000.000.000-00"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cnpj: maskCNPJ(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                )}
              </div>

              {/* Campos específicos UP */}
              {profileType === "UP" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Instituição *
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        institutionName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                    placeholder="Ex: Clínica Saúde Total"
                    required
                  />
                </div>
              )}

              {/* Campos específicos UE */}
              {profileType === "UE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Organização *
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                    placeholder="Ex: Grupo Médico Nacional"
                    required
                  />
                </div>
              )}

              {/* Endereço Estruturado */}
              <div className="md:col-span-2 space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-[var(--brand-blue)]">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-xs tracking-wider">
                    Endereço
                  </h3>
                </div>

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
              </div>
            </div>

            {error && (
              <div className="md:col-span-2 flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="md:col-span-2 w-full py-4 bg-[var(--brand-blue)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-200 mt-4"
            >
              Criar minha conta
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-[var(--brand-blue)] font-bold hover:underline"
            >
              Acesse aqui
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
