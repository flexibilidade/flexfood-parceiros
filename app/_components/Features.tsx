import { 
  Smartphone, 
  BarChart3, 
  Clock, 
  CreditCard, 
  Users, 
  MapPin,
  Bell,
  Shield,
  Headphones
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "App Mobile Completo",
    description: "Gerencie seu restaurante de qualquer lugar com nosso app intuitivo e rápido."
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Acompanhe vendas, produtos mais pedidos e performance em tempo real."
  },
  {
    icon: Clock,
    title: "Gestão de Tempo",
    description: "Controle tempo de preparo e entrega para melhorar a experiência do cliente."
  },
  {
    icon: CreditCard,
    title: "Pagamentos Integrados",
    description: "Aceite M-Pesa, E-mola e outros métodos de pagamento populares em Moçambique."
  },
  {
    icon: Users,
    title: "Base de Clientes",
    description: "Acesse milhares de clientes famintos na sua região prontos para pedir."
  },
  {
    icon: MapPin,
    title: "Entrega Rastreada",
    description: "Sistema de rastreamento em tempo real para você e seus clientes."
  },
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description: "Receba alertas instantâneos de novos pedidos e atualizações importantes."
  },
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Seus dados e pagamentos protegidos com criptografia de nível bancário."
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Equipe de suporte dedicada em português para ajudar quando precisar."
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para crescer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma oferece todas as ferramentas necessárias para transformar 
            seu restaurante em um negócio digital de sucesso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}