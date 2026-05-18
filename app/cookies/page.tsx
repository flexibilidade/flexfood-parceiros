import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";
import { Cookie, Settings, Eye, BarChart3 } from "lucide-react";

export default async function CookiesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const cookieTypes = [
        {
            icon: Settings,
            title: "Cookies Essenciais",
            description: "Necessários para o funcionamento básico da plataforma",
            examples: ["Sessão de login", "Preferências de idioma", "Carrinho de compras"],
            required: true
        },
        {
            icon: BarChart3,
            title: "Cookies de Análise",
            description: "Ajudam-nos a entender como você usa nossa plataforma",
            examples: ["Google Analytics", "Métricas de performance", "Relatórios de uso"],
            required: false
        },
        {
            icon: Eye,
            title: "Cookies de Funcionalidade",
            description: "Melhoram sua experiência com recursos personalizados",
            examples: ["Lembrar preferências", "Configurações de interface", "Histórico de navegação"],
            required: false
        }
    ];

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navigation session={session} />

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                        <Cookie className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Política de Cookies
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                        Entenda como usamos cookies para melhorar sua experiência
                    </p>
                    <p className="text-white/80 mt-4">
                        Última atualização: 18 de maio de 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="prose prose-lg max-w-none">

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">O que são Cookies?</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
                            nosso site. Eles nos ajudam a fornecer uma experiência melhor, mais rápida e mais segura,
                            lembrando suas preferências e melhorando a funcionalidade da plataforma.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Usamos Cookies</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            Utilizamos diferentes tipos de cookies para diversos propósitos:
                        </p>

                        {/* Cookie Types */}
                        <div className="grid gap-6 mb-8 not-prose">
                            {cookieTypes.map((type, index) => {
                                const IconComponent = type.icon;
                                return (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                                                <IconComponent className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                                                    {type.required && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                                            Obrigatório
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-3">{type.description}</p>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-700">Exemplos:</p>
                                                    <ul className="text-sm text-gray-600">
                                                        {type.examples.map((example, exampleIndex) => (
                                                            <li key={exampleIndex} className="flex items-center">
                                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                                                                {example}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies de Terceiros</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Também utilizamos cookies de terceiros para:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento do usuário</li>
                            <li><strong>Processadores de Pagamento:</strong> Para transações seguras</li>
                            <li><strong>Mapas:</strong> Para funcionalidades de localização</li>
                            <li><strong>Redes Sociais:</strong> Para integração com plataformas sociais</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Cookies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Você pode controlar e gerenciar cookies de várias maneiras:
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Configurações do Navegador</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Bloquear todos os cookies</li>
                            <li>Aceitar apenas cookies de primeira parte</li>
                            <li>Excluir cookies existentes</li>
                            <li>Receber notificações antes de aceitar cookies</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Instruções por Navegador</h3>
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <ul className="space-y-2 text-gray-700">
                                <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                                <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                                <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                                <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
                            </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Impacto da Desativação</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Desativar cookies pode afetar sua experiência:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Necessidade de fazer login repetidamente</li>
                            <li>Perda de preferências e configurações</li>
                            <li>Funcionalidades limitadas da plataforma</li>
                            <li>Experiência menos personalizada</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies Essenciais</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Alguns cookies são estritamente necessários para o funcionamento da plataforma e
                            não podem ser desativados. Estes incluem cookies de segurança, autenticação e
                            funcionalidades básicas do site.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Atualizações desta Política</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Podemos atualizar esta política de cookies periodicamente para refletir mudanças
                            em nossas práticas ou por outros motivos operacionais, legais ou regulamentares.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contato</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Se você tiver dúvidas sobre nossa política de cookies, entre em contato:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-8">
                            <li>Email: privacidade@flexfood.flexibilidade.co.mz</li>
                        </ul>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                            <p className="text-sm text-gray-600">
                                <strong>Última atualização:</strong> 18 de maio de 2026<br />
                                <strong>Versão:</strong> 1.0<br />
                                <strong>Idioma:</strong> Português
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}