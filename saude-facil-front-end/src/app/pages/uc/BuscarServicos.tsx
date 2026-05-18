import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, MapPin, Star, Clock, Filter, Loader2 } from "lucide-react";
import api from "../../services/api";

export function BuscarServicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("todos");
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, [filterType]);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const typeParam = filterType !== "todos" ? `type=${filterType}` : "";
      const searchParam = searchTerm ? `search=${searchTerm}` : "";
      const queryString = [typeParam, searchParam].filter(Boolean).join("&");

      const response = await api.get(`/institutions?${queryString}`);
      setInstitutions(response.data);
    } catch (error) {
      console.error("Erro ao buscar instituições:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInstitutions();
  };

  const allSpecialties = Array.from(
    new Set(institutions.flatMap((i) => i.specialties || [])),
  );

  const filteredInstitutions = institutions.filter((inst) => {
    return (
      filterSpecialty === "todos" ||
      (inst.specialties && inst.specialties.includes(filterSpecialty))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Buscar Serviços de Saúde
          </h1>
          <p className="text-gray-600 mt-1">
            Encontre clínicas, laboratórios e especialistas em Cáceres-MT
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-4 mb-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busque por clínicas, exames ou especialidades..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--brand-blue)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Buscar
            </button>
          </form>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--brand-blue)] text-sm"
            >
              <option value="todos">Todos os tipos</option>
              <option value="clinica">Clínica</option>
              <option value="laboratorio">Laboratório</option>
              <option value="hospital">Hospital</option>
            </select>

            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--brand-blue)] text-sm"
            >
              <option value="todos">Todas especialidades</option>
              {allSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            {(filterType !== "todos" ||
              filterSpecialty !== "todos" ||
              searchTerm) && (
              <button
                onClick={() => {
                  setFilterType("todos");
                  setFilterSpecialty("todos");
                  setSearchTerm("");
                  // Refetch sem filtros
                  setTimeout(() => fetchInstitutions(), 0);
                }}
                className="text-sm text-[var(--brand-blue)] hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredInstitutions.length}</span>{" "}
            resultado(s) encontrado(s)
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[var(--brand-blue)] animate-spin mb-4" />
            <p className="text-gray-500">Buscando instituições...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredInstitutions.map((institution) => {
              return (
                <div
                  key={institution.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={institution.image}
                      alt={institution.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {institution.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-1 capitalize">
                          {institution.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">
                          {institution.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {institution.description}
                    </p>

                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{institution.address}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Especialidades:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(institution.specialties || [])
                          .slice(0, 3)
                          .map((spec: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {spec}
                            </span>
                          ))}
                        {institution.specialties &&
                          institution.specialties.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{institution.specialties.length - 3}
                            </span>
                          )}
                      </div>
                    </div>

                    <Link
                      to={`/uc/instituicao/${institution.id}`}
                      className="block w-full py-3 bg-[var(--brand-blue)] text-white text-center rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Ver Detalhes e Agendar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredInstitutions.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum resultado encontrado</p>
            <p className="text-gray-400 text-sm">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
