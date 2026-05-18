import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-orange-600 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 break-words">
          Pronto para aumentar suas vendas?
        </h2>

        <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
          Junte-se a centenas de restaurantes que já estão crescendo com o flexfood.
          Comece gratuitamente hoje mesmo!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 flex-wrap">
          <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
            <span>Sem taxas de adesão</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
            <span>Configuração gratuita</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 whitespace-nowrap">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
            <span>Suporte incluído</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg whitespace-nowrap"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </Link>

          <Link
            href="/ajuda"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary transition-all whitespace-nowrap"
          >
            Falar com Especialista
          </Link>
        </div>

        <p className="text-white/70 text-sm mt-6">
          Mais de 10.000 pedidos processados mensalmente
        </p>
      </div>
    </section>
  );
}