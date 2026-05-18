import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin, Phone, Star, Clock, ArrowLeft, Loader2 } from "lucide-react";
import api from "../../services/api";

export function InstituicaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitution();
  }, [id]);

  const fetchInstitution = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/institutions/${id}`);
      setInstitution(response.data);
    } catch (error) {
      console.error("Erro ao buscar instituição:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Instituição não encontrada</p>
          <button
            onClick={() => navigate("/uc/buscar")}
            className="text-[var(--brand-blue)] hover:underline"
          >
            Voltar para busca
          </button>
        </div>
      </div>
    );
  }

  const institutionServices = institution.services || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/uc/buscar")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para busca
        </button>

        {/* Header Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-80 bg-gray-200 overflow-hidden">
            <img
              src={institution.image}
              alt={institution.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {institution.name}
                </h1>
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  {institution.type}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {institution.rating}
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-6">
              {institution.description}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-gray-900 font-medium">
                    {institution.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-gray-900 font-medium">
                    {institution.phone}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-3">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {(institution.specialties || []).map(
                  (spec: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                    >
                      {spec}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Serviços Disponíveis
          </h2>

          {institutionServices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum serviço cadastrado no momento
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {institutionServices.map((service: any) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-[var(--brand-blue)] hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--brand-blue)]">
                      R$ {service.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/uc/agendar/${service.id}`)}
                    className="w-full py-3 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Agendar Agora
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
