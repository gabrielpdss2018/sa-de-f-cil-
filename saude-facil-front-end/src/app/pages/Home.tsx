import { Link } from "react-router";
import {
  Search,
  Calendar,
  Clock,
  Shield,
  Heart,
  Stethoscope,
} from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--brand-blue-light)] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Saúde Fácil
                </h1>
                <p className="text-sm text-gray-600">
                  Sua saúde, nossa prioridade
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-[var(--brand-blue)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Agende consultas e exames de forma{" "}
            <span className="text-[var(--brand-blue)]">rápida</span> e{" "}
            <span className="text-[var(--brand-green)]">simples</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Conectamos você às melhores clínicas e laboratórios de Cáceres-MT em
            uma única plataforma
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-blue)] text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
          >
            <Calendar className="w-6 h-6" />
            Começar Agora
          </Link>
        </div>

        {/* Search Preview */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Busque por clínicas, exames ou especialidades..."
              className="flex-1 bg-transparent outline-none text-gray-700"
              disabled
            />
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Faça login para começar a buscar
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Como funciona
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-[var(--brand-blue)]" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Busque</h4>
            <p className="text-gray-600">
              Encontre clínicas, laboratórios e serviços de saúde próximos a
              você
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-[var(--brand-green)]" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Agende</h4>
            <p className="text-gray-600">
              Escolha o melhor horário disponível e confirme seu agendamento
              online
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Stethoscope className="w-7 h-7 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Compareça</h4>
            <p className="text-gray-600">
              Receba lembretes e compareça no local agendado na data marcada
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher o Saúde Fácil?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[var(--brand-blue)]" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Agilidade</h5>
                <p className="text-gray-600">
                  Agende em poucos cliques, sem precisar ligar para múltiplas
                  clínicas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[var(--brand-green)]" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Segurança</h5>
                <p className="text-gray-600">
                  Seus dados protegidos e instituições verificadas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Organização</h5>
                <p className="text-gray-600">
                  Todos seus agendamentos em um só lugar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-1">Variedade</h5>
                <p className="text-gray-600">
                  Acesso às melhores clínicas e laboratórios da região
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Saúde Fácil</h1>
          </div>
          <p className="text-gray-400">
            © 2026 Saúde Fácil. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">Cáceres - MT</p>
        </div>
      </footer>
    </div>
  );
}
