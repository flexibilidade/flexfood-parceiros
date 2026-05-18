import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Users, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              Plataforma #1 em Moçambique
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforme seu
                <span className="text-primary block">restaurante</span>
                em um negócio digital
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Aumente suas vendas em até <strong className="text-primary">300%</strong> com nossa plataforma completa de delivery. 
                Gerencie pedidos, cardápio e clientes em um só lugar.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "Configuração em menos de 10 minutos",
                "Sem taxas de adesão ou mensalidade",
                "Suporte 24/7 em português",
                "Painel de controle intuitivo"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/como-funciona"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-primary hover:text-primary transition-all"
              >
                Ver Como Funciona
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Restaurantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Pedidos/mês</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Restaurante Sabor</h3>
                    <p className="text-sm text-gray-500">Online • 23 pedidos hoje</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>

              {/* Mock Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">MT 2.450</div>
                  <div className="text-sm text-green-700">Vendas Hoje</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-blue-700">Pedidos</div>
                </div>
              </div>

              {/* Mock Recent Orders */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Pedidos Recentes</h4>
                {[
                  { id: "#1234", customer: "João Silva", value: "MT 45,00", status: "Preparando" },
                  { id: "#1235", customer: "Maria Santos", value: "MT 32,50", status: "Entregue" },
                  { id: "#1236", customer: "Pedro Costa", value: "MT 67,80", status: "A caminho" }
                ].map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-600">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{order.value}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                        order.status === 'Preparando' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-primary text-white p-3 rounded-lg shadow-lg">
              <div className="text-sm font-medium">Novo Pedido!</div>
              <div className="text-xs opacity-90">MT 45,00</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
              <div className="text-sm font-medium">+300% vendas</div>
              <div className="text-xs opacity-90">vs. mês anterior</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
