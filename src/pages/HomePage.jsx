import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Stethoscope, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Calendar, 
  CheckCircle, 
  Package,
  Star,
  ArrowRight,
  Smile,
  Clock,
  FileText,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const handleLogin = () => {
    // Navegar a página de login
    window.location.href = '/login';
  };

  const handleSignup = () => {
    // Navegar a página de login (mismo destino para registro)
    window.location.href = '/login';
  };

  const handleDemo = () => {
    // Mostrar demo
    console.log('Opening demo...');
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: 'Gestión de Citas Inteligente',
      description: 'Organiza y programa todas tus citas en un calendario intuitivo.'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: 'Historiales Completos',
      description: 'Accede al historial completo de tus pacientes en un solo lugar.'
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
      title: 'Administración Médica',
      description: 'Gestiona perfiles, horarios y disponibilidad de tu equipo.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: 'Reportes Avanzados',
      description: 'Toma decisiones informadas con analíticas detalladas.'
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Registra tu clínica",
      description: "Crea tu cuenta y configura los datos básicos de tu clínica dental."
    },
    {
      number: "2", 
      title: "Invita a tu equipo",
      description: "Añade doctores, asistentes y personal administrativo a la plataforma."
    },
    {
      number: "3",
      title: "Comienza a gestionar",
      description: "Agenda citas, gestiona pacientes y optimiza tu flujo de trabajo."
    }
  ];

  const testimonials = [
    {
      name: "Dr. María González",
      role: "Odontóloga General",
      avatar: "MG",
      rating: 5,
      comment: "DentalCRM transformó completamente la gestión de mi clínica. Ahora puedo enfocarme más en mis pacientes."
    },
    {
      name: "Dr. Carlos Medina", 
      role: "Ortodoncista",
      avatar: "CM",
      rating: 5,
      comment: "La mejor inversión que he hecho para mi práctica. El sistema es intuitivo y muy completo."
    },
    {
      name: "Dra. Ana Ruiz",
      role: "Directora Clínica",
      avatar: "AR", 
      rating: 5,
      comment: "Gestionar 5 doctores y cientos de pacientes nunca había sido tan fácil. Excelente plataforma."
    }
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DentalCRM</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Características</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Cómo Funciona</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonios</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contacto</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={handleLogin} className="font-medium">
              Iniciar Sesión
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" onClick={handleSignup}>
              Empezar Gratis
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                ✨ Sistema de gestión #1 para clínicas dentales
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Mejor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sistema de Gestión</span> para Clínicas Dentales Modernas
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Una plataforma todo-en-uno para gestionar pacientes, citas y tratamientos. 
                Diseñada específicamente para profesionales dentales que buscan excelencia.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl px-8 py-6 text-lg font-semibold" 
                  onClick={handleSignup}
                >
                  Comenzar Prueba Gratuita <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-2" onClick={handleDemo}>
                  Ver Demo en Vivo
                </Button>
              </div>

              {/* Stats & Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-center">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                      <div key={index} className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                        {testimonial.avatar}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-900">5.0</span>
                    </div>
                    <p className="text-sm text-gray-600">+1,200 clínicas satisfechas</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">500k+</p>
                  <p className="text-sm text-gray-600">Pacientes gestionados</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-sm text-gray-600">Tiempo activo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by section */}
        <section className="py-12 bg-gray-50 border-y">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500 font-medium mb-8">Confiado por las mejores clínicas dentales</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="flex items-center space-x-2">
                <Smile className="w-8 h-8 text-gray-400" />
                <span className="font-bold text-gray-600">SmileCare</span>
              </div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-8 h-8 text-gray-400" />
                <span className="font-bold text-gray-600">DentalPlus</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-8 h-8 text-gray-400" />
                <span className="font-bold text-gray-600">HealthDental</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-gray-400" />
                <span className="font-bold text-gray-600">CliniFam</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-800 mb-4">¿Cómo funciona?</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Gestiona tu clínica en <span className="text-blue-600">3 pasos simples</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Todo lo que necesitas para una clínica dental exitosa en una plataforma fácil de usar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-24 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" onClick={handleSignup}>
                Comenzar Ahora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-800 mb-4">Características Principales</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Todo lo que necesitas para tu clínica dental
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Herramientas potentes diseñadas específicamente para profesionales de la salud dental
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardContent className="p-8 text-center">
                    <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-800 mb-4">Testimonios</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Aumenta tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Eficiencia</span> Globalmente
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Únete a más de 1,200 clínicas que ya optimizaron sus procesos con DentalCRM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para transformar tu clínica dental?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Únete a miles de profesionales que ya mejoraron su gestión clínica. 
                Prueba gratis por 14 días, sin compromisos.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl px-8 py-6 text-lg font-semibold"
                  onClick={handleSignup}
                >
                  Comenzar Prueba Gratuita <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold" onClick={() => console.log('Contact sales')}>
                  Hablar con Ventas
                </Button>
              </div>
              
              <div className="flex justify-center items-center space-x-8 mt-12 text-blue-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>14 días gratis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Sin tarjeta requerida</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cancela cuando quieras</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DentalCRM</span>
              </div>
              <p className="text-gray-400">
                La plataforma de gestión dental más completa y fácil de usar del mercado.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reportar Bug</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} DentalCRM. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
