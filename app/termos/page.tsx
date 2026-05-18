import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";
import { FileText, Shield, Users, AlertCircle } from "lucide-react";

export default async function TermosPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navigation session={session} />

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Termos de Serviço
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                        Conheça os termos e condições para uso da plataforma flexfood
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

                        {/* Introduction */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                            <div className="flex items-start">
                                <AlertCircle className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Importante</h3>
                                    <p className="text-blue-800">
                                        Ao utilizar a plataforma flexfood, você concorda com estes termos de serviço.
                                        Leia atentamente antes de prosseguir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Aceitação dos Termos</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Ao acessar e usar a plataforma flexfood, você concorda em cumprir e estar vinculado a estes
                            Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve usar
                            nossos serviços.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Descrição do Serviço</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            O flexfood é uma plataforma digital que conecta restaurantes parceiros com clientes,
                            facilitando pedidos de comida online. Nossos serviços incluem:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Plataforma de gestão para restaurantes parceiros</li>
                            <li>Sistema de pedidos online</li>
                            <li>Processamento de pagamentos</li>
                            <li>Coordenação de entregas</li>
                            <li>Suporte ao cliente</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Elegibilidade e Registro</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Para usar nossos serviços como parceiro, você deve:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Ter pelo menos 18 anos de idade</li>
                            <li>Possuir um estabelecimento comercial válido</li>
                            <li>Fornecer informações precisas e atualizadas</li>
                            <li>Cumprir todas as leis e regulamentações locais</li>
                            <li>Manter licenças e autorizações necessárias</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Obrigações do Parceiro</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Como parceiro da plataforma, você se compromete a:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Manter a qualidade dos produtos e serviços</li>
                            <li>Cumprir os prazos de preparo informados</li>
                            <li>Manter informações de menu atualizadas</li>
                            <li>Responder prontamente aos pedidos</li>
                            <li>Seguir as normas de higiene e segurança alimentar</li>
                            <li>Tratar clientes com respeito e profissionalismo</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Taxas e Pagamentos</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Nossa estrutura de taxas inclui:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Taxa de comissão sobre vendas realizadas</li>
                            <li>Taxas de processamento de pagamento</li>
                            <li>Possíveis taxas adicionais por serviços especiais</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Os pagamentos são processados conforme o cronograma estabelecido,
                            descontadas as taxas aplicáveis.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Propriedade Intelectual</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Todos os direitos de propriedade intelectual da plataforma flexfood, incluindo
                            marca, logotipo, design e tecnologia, pertencem à nossa empresa. Você mantém
                            os direitos sobre seu conteúdo, mas nos concede licença para uso na plataforma.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Privacidade e Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            O tratamento de dados pessoais é regido por nossa Política de Privacidade,
                            que faz parte integrante destes termos. Comprometemo-nos a proteger suas
                            informações conforme as melhores práticas de segurança.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Suspensão e Encerramento</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Podemos suspender ou encerrar sua conta em caso de:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Violação destes termos</li>
                            <li>Atividade fraudulenta ou suspeita</li>
                            <li>Não cumprimento de obrigações</li>
                            <li>Solicitação do próprio parceiro</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Limitação de Responsabilidade</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Nossa responsabilidade é limitada ao valor das transações processadas.
                            Não nos responsabilizamos por danos indiretos, lucros cessantes ou
                            outras perdas consequenciais.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Modificações dos Termos</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Reservamo-nos o direito de modificar estes termos a qualquer momento.
                            As alterações serão comunicadas com antecedência e entrarão em vigor
                            na data especificada.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Lei Aplicável</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Estes termos são regidos pelas leis de Moçambique. Qualquer disputa
                            será resolvida nos tribunais competentes de Maputo.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Contato</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Para dúvidas sobre estes termos, entre em contato conosco através de:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-8">
                            <li>Email: legal@flexfood.flexibilidade.co.mz</li>
                            <li>Endereço: Maputo, Moçambique</li>
                        </ul>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                            <p className="text-sm text-gray-600">
                                <strong>Última atualização:</strong> 18 de maio de 2026<br />
                                <strong>Versão:</strong> 2.1<br />
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