import { UserPlus, Store, Truck, TrendingUp } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: UserPlus,
    title: "1. Cadastre-se",
    description: "Crie sua conta gratuitamente em menos de 5 minutos. Sem taxas de adesão.",
    color: "bg-blue-500"
  },
  {
    icon: Store,
    title: "2. Configure seu Restaurante",
    description: "Adicione seu cardápio, fotos e informações. Nossa equipe te ajuda na configuração.",
    color: "bg-green-500"
  },
  {
    icon: Truck,
    title: "3. Receba Pedidos",
    description: "Comece a receber pedidos imediatamente. Gerencie tudo pelo app ou painel web.",
    color: "bg-orange-500"
  },
  {
    icon: TrendingUp,
    title: "4. Cresça suas Vendas",
    description: "Use nossos relatórios e ferramentas de marketing para aumentar suas vendas.",
    color: "bg-purple-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Como funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos simples, seu restaurante estará online e recebendo pedidos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>


            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg"
          >
            Começar Agora - É Grátis
          </Link>
        </div>
      </div>
    </section>
  );
}