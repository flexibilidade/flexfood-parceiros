'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  HelpCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Footer from '../_components/Footer';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/buyers/support', formData);

      if (response.data.success) {
        toast.success(response.data.message || 'Mensagem enviada com sucesso! Entraremos em Contacto em breve.');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
        });
      } else {
        toast.error(response.data.message || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Error sending support message:', error);

      // Handle different error types
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const faqItems = [
    {
      question: "Como faço um pedido?",
      answer: "Você pode fazer pedidos através do nosso app móvel ou website. Selecione o restaurante, adicione itens ao carrinho e finalize o pagamento."
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos pagamentos via M-Pesa. O pagamento é processado de forma segura através da nossa plataforma."
    },
    {
      question: "Quanto tempo demora a entrega?",
      answer: "O tempo de entrega varia entre 30-60 minutos, dependendo da localização e disponibilidade dos entregadores."
    },
    {
      question: "Como posso rastrear meu pedido?",
      answer: "Após fazer o pedido, você receberá atualizações em tempo real sobre o status. Também pode acompanhar na seção 'Meus Pedidos'."
    },
    {
      question: "Posso cancelar meu pedido?",
      answer: "Pedidos podem ser cancelados antes da confirmação pelo restaurante. Entre em Contacto conosco para cancelamentos."
    },
    {
      question: "Há taxa de entrega?",
      answer: "Sim, há uma taxa de entrega que varia conforme a distância. O valor é mostrado antes de finalizar o pedido."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central de Suporte</h1>
              <p className="text-gray-600 mt-2">Estamos aqui para ajudar você</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">

            {/* Contact Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-red-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">contacto@flexibilidade.co.mz</p>
                <p className="text-sm text-gray-600 mt-1">Resposta em até 24h</p>
              </CardContent>
            </Card>



            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">FlexFood Moçambique</p>
                <p className="text-sm text-gray-600 mt-1">
                  R F MAYANGA UC CENTRAL QRT 5<br />
                  Cidade de Nampula, Moçambique
                </p>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-red-600" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Segunda - Sexta</span>
                  <span className="text-sm font-medium">8h - 22h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sábado</span>
                  <span className="text-sm font-medium">9h - 22h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Domingo</span>
                  <span className="text-sm font-medium">10h - 20h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entraremos em Contacto o mais breve possível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+25884XXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pedido">Problema com Pedido</SelectItem>
                          <SelectItem value="pagamento">Problema com Pagamento</SelectItem>
                          <SelectItem value="entrega">Problema com Entrega</SelectItem>
                          <SelectItem value="conta">Problema com Conta</SelectItem>
                          <SelectItem value="restaurante">Problema com Restaurante</SelectItem>
                          <SelectItem value="sugestao">Sugestão</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Resumo do seu problema ou dúvida"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Descreva detalhadamente seu problema ou dúvida..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-red-600" />
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription>
                  Encontre respostas rápidas para as dúvidas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Emergência ou Problema Urgente?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-4">
                  Para problemas urgentes relacionados a pedidos em andamento, entre em Contacto imediatamente:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <Mail className="w-4 h-4 mr-2" />
                    Email: contacto@flexibilidade.co.mz
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Info className="w-5 h-5 mr-2" />
                  Informações Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• Mantenha sempre o número do seu pedido para facilitar o atendimento</li>
                  <li>• Para reembolsos, entre em Contacto em até 24h após o problema</li>
                  <li>• Nosso suporte está disponível em português e inglês</li>
                  <li>• Tempos de resposta podem ser maiores durante fins de semana e feriados</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}