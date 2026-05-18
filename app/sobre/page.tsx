import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";
import { Users, Target, Award, Heart, MapPin, TrendingUp } from "lucide-react";

export default async function SobrePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const stats = [
    { icon: Users, label: "Restaurantes Parceiros", value: "500+" },
    { icon: MapPin, label: "Cidades Atendidas", value: "15+" },
    { icon: TrendingUp, label: "Pedidos Mensais", value: "10K+" },
    { icon: Award, label: "Anos de Experiência", value: "3+" },
  ];

  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Conectar restaurantes locais com clientes, facilitando o acesso à comida de qualidade e impulsionando o crescimento dos negócios gastronômicos."
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Transparência, qualidade, inovação e compromisso com o sucesso dos nossos parceiros e satisfação dos clientes."
    },
    {
      icon: Award,
      title: "Visão",
      description: "Ser a principal plataforma de delivery em Moçambique, promovendo a cultura gastronômica local e o empreendedorismo."
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation session={session} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Sobre o flexfood
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Somos uma plataforma inovadora que conecta restaurantes e clientes,
            transformando a experiência de delivery em Moçambique.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Nossa História
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              O flexfood nasceu da necessidade de modernizar o setor gastronômico em Moçambique,
              oferecendo uma plataforma tecnológica que facilita a conexão entre restaurantes e clientes.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Fundado em 2025, o flexfood começou como uma ideia simples: facilitar o acesso à comida
              de qualidade através da tecnologia. Percebemos que muitos restaurantes locais tinham
              dificuldades para alcançar novos clientes e gerenciar pedidos de delivery de forma eficiente.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Desde então, crescemos para nos tornar uma das principais plataformas de delivery do país,
              sempre mantendo nosso foco no apoio aos negócios locais e na satisfação dos clientes.
              Nossa tecnologia permite que restaurantes de todos os tamanhos possam competir no mercado
              digital e expandir seus negócios.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Hoje, orgulhamo-nos de ser parceiros de centenas de restaurantes em todo o país,
              processando milhares de pedidos mensalmente e contribuindo para o crescimento da
              economia digital moçambicana.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600">
              Os princípios que guiam nossa jornada e definem quem somos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Nossa Equipe
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Somos uma equipe apaixonada por tecnologia e gastronomia, dedicada a criar
            soluções inovadoras que fazem a diferença na vida das pessoas.
          </p>

          <div className="bg-gradient-to-r from-primary/10 to-orange-100 rounded-2xl p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Nossa equipe multidisciplinar combina expertise em tecnologia, marketing,
              atendimento ao cliente e desenvolvimento de negócios para oferecer a melhor
              experiência possível tanto para restaurantes quanto para clientes.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}