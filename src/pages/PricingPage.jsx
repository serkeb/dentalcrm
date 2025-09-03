import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PricingPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const plans = [
    {
      name: "Plan Inicial",
      price: "$2,500",
      period: "/mes",
      description: "Perfecto para consultorios independientes que están comenzando con la digitalización.",
      features: [
        "Hasta 3 doctores activos",
        "500 pacientes registrados",
        "Gestión básica de citas",
        "Historiales médicos simples",
        "Recordatorios automáticos por SMS",
        "Soporte por email"
      ],
      buttonText: "Empezar",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Plan Profesional", 
      price: "$5,000",
      period: "/mes",
      description: "Ideal para clínicas establecidas con equipo médico completo y alto flujo de pacientes.",
      features: [
        "Hasta 10 doctores activos",
        "Pacientes ilimitados",
        "Agenda inteligente con IA",
        "Historiales completos + imágenes radiográficas",
        "Reportes financieros y de productividad",
        "Integración con equipos dentales",
        "Soporte telefónico 24/7"
      ],
      buttonText: "Empezar",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Plan Enterprise",
      price: "$8,900",
      period: "/mes", 
      description: "Solución integral para cadenas dentales y grandes clínicas con múltiples especialidades.",
      features: [
        "Doctores y personal ilimitados",
        "Gestión de múltiples sucursales",
        "API personalizada y webhooks",
        "Dashboard ejecutivo en tiempo real",
        "Integración con sistemas contables",
        "Account Manager dedicado",
        "Capacitación y onboarding personalizado",
        "Cumplimiento HIPAA garantizado"
      ],
      buttonText: "Empezar",
      buttonVariant: "outline",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "¿Qué es DentalCRM?",
      answer: "DentalCRM es una plataforma completa de gestión para clínicas dentales que permite administrar pacientes, citas, historiales clínicos, tratamientos y facturación en un solo lugar, diseñada específicamente para profesionales de la odontología."
    },
    {
      question: "¿Cómo funciona DentalCRM?",
      answer: "Nuestro sistema basado en la nube te permite gestionar toda tu clínica desde cualquier dispositivo. Registras pacientes, agendas citas, mantienes historiales digitales, generas reportes automáticamente y puedes acceder a toda la información desde tu computadora, tablet o móvil."
    },
    {
      question: "¿Es seguro DentalCRM?",
      answer: "Absolutamente. Cumplimos con todas las normativas internacionales de protección de datos médicos (HIPAA) y utilizamos encriptación de nivel bancario. Todos los datos se almacenan en servidores seguros con backups automáticos diarios."
    },
    {
      question: "¿Puede DentalCRM integrarse con otros software?",
      answer: "Sí, ofrecemos integraciones nativas con los principales sistemas de contabilidad (QuickBooks, Xero), equipos dentales digitales (rayos X, escáneres intraorales), y plataformas de pago. También disponemos de API para integraciones personalizadas."
    },
    {
      question: "¿Qué métodos de pago acepta para pacientes?",
      answer: "DentalCRM procesa pagos con tarjetas de crédito/débito, transferencias bancarias, efectivo, cheques, y planes de financiamiento. También permite pagos parciales y recordatorios automáticos de cobros pendientes."
    },
    {
      question: "¿Para qué tamaño de clínica es adecuado?",
      answer: "Tenemos soluciones escalables desde consultorios individuales hasta grandes cadenas dentales. Nuestro Plan Inicial es perfecto para 1-3 doctores, el Profesional para clínicas medianas, y Enterprise para organizaciones con múltiples ubicaciones."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DentalCRM</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Inicio</a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Características</a>
            <a href="#pricing" className="text-blue-600 font-semibold">Precios</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contacto</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              onClick={handleLogin}
            >
              Prueba Gratis
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/30 rounded-3xl rotate-12"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-2xl -rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-6 py-20 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Precios Simples y Transparentes
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Elige un plan que se adapte a las necesidades de tu clínica y presupuesto. Sin tarifas ocultas, sin sorpresas—solo precios transparentes para una gestión dental poderosa.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <Button 
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold"
                onClick={handleLogin}
              >
                Mensual
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-blue-300 text-blue-100 hover:bg-blue-100 hover:text-blue-800 px-8 py-3 rounded-lg font-semibold"
              >
                Anual
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Más Popular
                      </div>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 ml-1">{plan.period}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <Check className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full py-3 font-semibold rounded-lg transition-all ${
                        plan.buttonVariant === 'default' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600' 
                          : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                      }`}
                      onClick={handleLogin}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                Preguntas <span className="text-blue-600">Frecuentes</span>
              </h2>
              
              <div className="space-y-4 mt-12">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                        {openFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de clínicas que ya transformaron su gestión con DentalCRM
            </p>
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg"
              onClick={handleLogin}
            >
              Comenzar Prueba Gratuita
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DentalCRM</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma de gestión dental más completa y fácil de usar del mercado.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Empleos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reportar Problema</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} DentalCRM. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
