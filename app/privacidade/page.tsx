import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from "lucide-react";

export default async function PrivacidadePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const dataTypes = [
        {
            icon: UserCheck,
            title: "Dados de Identificação",
            items: ["Nome completo", "Email", "Telefone", "Documento de identidade"]
        },
        {
            icon: Database,
            title: "Dados do Negócio",
            items: ["Nome do restaurante", "Endereço", "Licenças", "Informações bancárias"]
        },
        {
            icon: Eye,
            title: "Dados de Uso",
            items: ["Logs de acesso", "Preferências", "Histórico de transações", "Métricas de performance"]
        }
    ];

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navigation session={session} />

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Política de Privacidade
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                        Sua privacidade é nossa prioridade. Saiba como protegemos seus dados.
                    </p>
                    <p className="text-white/80 mt-4">
                        Última atualização: 18 de maio de 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Introduction */}
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                        <div className="flex items-start">
                            <Lock className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-semibold text-green-900 mb-2">Compromisso com a Privacidade</h3>
                                <p className="text-green-800">
                                    Estamos comprometidos em proteger sua privacidade e garantir a segurança de seus dados pessoais
                                    conforme as melhores práticas internacionais.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none">

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introdução</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Esta Política de Privacidade descreve como o flexfood coleta, usa, armazena e protege
                            suas informações pessoais quando você utiliza nossa plataforma. Aplicamos os princípios
                            de transparência, minimização de dados e segurança em todas as nossas práticas.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Dados que Coletamos</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
                        </p>

                        {/* Data Types Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8 not-prose">
                            {dataTypes.map((type, index) => {
                                const IconComponent = type.icon;
                                return (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{type.title}</h3>
                                        <ul className="space-y-2">
                                            {type.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Como Usamos Seus Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos suas informações para os seguintes propósitos:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Fornecer e manter nossos serviços</li>
                            <li>Processar transações e pagamentos</li>
                            <li>Comunicar sobre pedidos e atualizações</li>
                            <li>Melhorar a experiência do usuário</li>
                            <li>Prevenir fraudes e garantir segurança</li>
                            <li>Cumprir obrigações legais</li>
                            <li>Análises e relatórios (dados anonimizados)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Base Legal para Processamento</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Processamos seus dados com base em:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li><strong>Execução de contrato:</strong> Para fornecer nossos serviços</li>
                            <li><strong>Interesse legítimo:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
                            <li><strong>Consentimento:</strong> Para comunicações de marketing (quando aplicável)</li>
                            <li><strong>Obrigação legal:</strong> Para cumprir requisitos regulamentares</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Compartilhamento de Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Compartilhamos seus dados apenas quando necessário:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li><strong>Prestadores de serviços:</strong> Processamento de pagamentos, entrega, suporte técnico</li>
                            <li><strong>Parceiros comerciais:</strong> Informações necessárias para completar pedidos</li>
                            <li><strong>Autoridades legais:</strong> Quando exigido por lei ou ordem judicial</li>
                            <li><strong>Transferência de negócios:</strong> Em caso de fusão, aquisição ou venda</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Nunca vendemos seus dados pessoais para terceiros para fins de marketing.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Segurança dos Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Implementamos medidas de segurança robustas:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Criptografia de dados em trânsito e em repouso</li>
                            <li>Controles de acesso rigorosos</li>
                            <li>Monitoramento contínuo de segurança</li>
                            <li>Auditorias regulares de segurança</li>
                            <li>Treinamento de equipe em proteção de dados</li>
                            <li>Backup seguro e recuperação de desastres</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Retenção de Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Mantemos seus dados pelo tempo necessário para cumprir os propósitos descritos nesta política,
                            obrigações legais e resolução de disputas. Dados de transações são mantidos conforme
                            exigências fiscais e regulamentares.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Seus Direitos</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Você tem os seguintes direitos sobre seus dados:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
                            <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                            <li><strong>Exclusão:</strong> Solicitar remoção de dados (sujeito a limitações legais)</li>
                            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                            <li><strong>Oposição:</strong> Opor-se ao processamento em certas circunstâncias</li>
                            <li><strong>Limitação:</strong> Restringir o processamento de seus dados</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Cookies e Tecnologias Similares</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos cookies e tecnologias similares para:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li>Manter sua sessão ativa</li>
                            <li>Lembrar suas preferências</li>
                            <li>Analisar o uso da plataforma</li>
                            <li>Melhorar a funcionalidade</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Você pode gerenciar cookies através das configurações do seu navegador.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Transferências Internacionais</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Seus dados podem ser transferidos para servidores localizados fora de Moçambique.
                            Garantimos que tais transferências atendam aos padrões adequados de proteção de dados
                            através de salvaguardas apropriadas.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Menores de Idade</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Nossos serviços são destinados a pessoas com 18 anos ou mais. Não coletamos
                            intencionalmente dados de menores de idade. Se tomarmos conhecimento de tal coleta,
                            removeremos os dados imediatamente.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Alterações nesta Política</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças
                            significativas através da plataforma ou por email. A versão atualizada entrará
                            em vigor na data especificada.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">13. Contato e Reclamações</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-6">
                            <li><strong>Email:</strong> privacidade@flexfood.flexibilidade.co.mz</li>
                            <li><strong>Telefone:</strong> +258 21 123 456</li>
                            <li><strong>Endereço:</strong> Maputo, Moçambique</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            Você também pode apresentar reclamações à autoridade de proteção de dados competente.
                        </p>

                        {/* Warning Box */}
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 not-prose">
                            <div className="flex items-start">
                                <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Importante</h3>
                                    <p className="text-amber-800">
                                        Esta política complementa nossos Termos de Serviço. Em caso de conflito,
                                        os termos mais protetivos da privacidade prevalecerão.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                            <p className="text-sm text-gray-600">
                                <strong>Última atualização:</strong> 18 de maio de 2026<br />
                                <strong>Versão:</strong> 3.0<br />
                                <strong>Idioma:</strong> Português<br />
                                <strong>Jurisdição:</strong> Moçambique
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}