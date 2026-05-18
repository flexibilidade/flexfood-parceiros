import Link from "next/link";
import { Store, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">flexfood</span>
            </Link>

            <p className="text-gray-400 leading-relaxed">
              A plataforma líder de delivery em Moçambique.
              Conectamos restaurantes a milhares de clientes famintos.
            </p>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <div className="space-y-3">
              <Link href="/sobre" className="block text-gray-400 hover:text-white transition-colors">
                Sobre Nós
              </Link>
              <Link href="/como-funciona" className="block text-gray-400 hover:text-white transition-colors">
                Como Funciona
              </Link>

              <Link href="/ajuda" className="block text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <div className="space-y-3">
              <Link href="/ajuda" className="block text-gray-400 hover:text-white transition-colors">
                Central de Ajuda
              </Link>
              <Link href="/termos" className="block text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="block text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>Contacto@flexibilidade.co.mz</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Cidade de Nampula, Moçambique</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Horário de Atendimento</h4>
              <p className="text-gray-400 text-sm">
                Segunda a Sexta: 8h às 18h<br />
                Sábado: 9h às 15h
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 flexfood. Todos os direitos reservados.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos
            </Link>
            <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidade
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}