import Link from "next/link";
import { ArrowLeft, Store, Users, Truck, Star, CheckCircle, Clock, MapPin } from "lucide-react";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Como Funciona a flexfood
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Descubra como nossa plataforma conecta restaurantes a milhares de clientes 
              famintos em todo Moçambique de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            3 Passos Simples para Começar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em poucos minutos, seu restaurante estará online e pronto para receber pedidos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-white" />
            </div>
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cadastre seu Restaurante</h3>
            <p className="text-gray-600 leading-relaxed">
              Crie sua conta, adicione informações do seu restaurante, cardápio e fotos. 
              Nosso processo de aprovação é rápido e simples.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Receba Pedidos</h3>
            <p className="text-gray-600 leading-relaxed">
              Clientes fazem pedidos através do nosso app. Você recebe notificações 
              em tempo real e gerencia tudo pelo painel do parceiro.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Entregamos para Você</h3>
            <p className="text-gray-600 leading-relaxed">
              Nossa equipe de entregadores busca o pedido no seu restaurante e 
              entrega diretamente ao cliente. Você foca apenas na cozinha!
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que Escolher a flexfood?
            </h2>
            <p className="text-xl text-gray-600">
              Oferecemos tudo que você precisa para crescer seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sem Taxa de Adesão</h3>
                <p className="text-gray-600">Comece a vender sem custos iniciais</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Aprovação Rápida</h3>
                <p className="text-gray-600">Análise em até 24 horas úteis</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cobertura Nacional</h3>
                <p className="text-gray-600">Atendemos todo Moçambique</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Star className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sistema de Avaliações</h3>
                <p className="text-gray-600">Construa sua reputação online</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Suporte Dedicado</h3>
                <p className="text-gray-600">Equipe sempre pronta para ajudar</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Truck className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Logística Completa</h3>
                <p className="text-gray-600">Cuidamos de toda a entrega</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de restaurantes que já estão crescendo com a flexfood
          </p>
          <Link 
            href="/auth" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            <Store className="w-5 h-5" />
            Cadastrar Restaurante
          </Link>
        </div>
      </div>
    </div>
  );
}