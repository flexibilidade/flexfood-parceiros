import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Carlos Manjate",
    restaurant: "Restaurante Sabor Moçambicano",
    location: "Maputo",
    rating: 5,
    text: "Desde que comecei a usar o flexfood, minhas vendas aumentaram 250%. O app é muito fácil de usar e o suporte é excelente.",
    avatar: "/images/testimonials/carlos.jpg"
  },
  {
    name: "Maria Fernandes",
    restaurant: "Cantina da Maria",
    location: "Nampula",
    rating: 5,
    text: "Melhor decisão que tomei para meu negócio. Agora recebo pedidos o dia todo e consigo gerenciar tudo pelo celular.",
    avatar: "/images/testimonials/maria.jpg"
  },
  {
    name: "João Macamo",
    restaurant: "Churrasqueira do João",
    location: "Beira",
    rating: 5,
    text: "O flexfood me ajudou a digitalizar meu restaurante. Agora tenho controle total das vendas e os clientes adoram a praticidade.",
    avatar: "/images/testimonials/joao.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O que nossos parceiros dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mais de 500 restaurantes já transformaram seus negócios com o flexfood.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.restaurant}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              <strong className="text-gray-900">500+</strong> restaurantes confiam no flexfood
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}