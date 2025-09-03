import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Stethoscope, ShieldCheck, BarChart3, Users, Calendar, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: 'Gestión de Citas Inteligente',
      description: 'Organiza, programa y gestiona todas tus citas en un calendario intuitivo y fácil de usar.',
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Historiales Clínicos Completos',
      description: 'Accede al historial completo de tus pacientes, desde tratamientos hasta notas personales, en un solo lugar.',
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-blue-600" />,
      title: 'Administración de Doctores',
      description: 'Gestiona los perfiles, horarios y disponibilidad de tu equipo médico de forma centralizada.',
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Reportes y Analíticas',
      description: 'Toma decisiones informadas con reportes detallados sobre el rendimiento de tu clínica.',
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DentalCRM</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Características</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Planes</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>
              Empezar Gratis
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Sección Hero */}
        <section className="pt-32 pb-20 bg-gray-50 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Optimiza la gestión de tu clínica dental
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              DentalCRM es la plataforma todo-en-uno que simplifica la administración de pacientes, citas y tratamientos, permitiéndote enfocarte en lo que más importa: la salud de tus pacientes.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>
                Prueba 14 días gratis
              </Button>
              <Button size="lg" variant="outline">
                Ver Demo
              </Button>
            </div>
             <div className="mt-16">
                             </div>
          </div>
        </section>

        {/* Sección de Características */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800">Todo lo que necesitas</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Una solución completa para tu clínica</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                Desde la primera consulta hasta el seguimiento post-tratamiento, tenemos todas las herramientas que necesitas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Precios */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Planes simples y transparentes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                Elige el plan que mejor se adapte al tamaño y las necesidades de tu clínica. Sin contratos ni costos ocultos.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-center">Básico</CardTitle>
                  <p className="text-center text-4xl font-bold">$2.500 <span className="text-lg font-normal text-gray-500">/mes</span></p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Hasta 3 Doctores</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 500 Pacientes</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Gestión de Citas</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Soporte por Email</li>
                  </ul>
                  <Button className="w-full" variant="outline">Elegir Plan</Button>
                </CardContent>
              </Card>
              <Card className="w-full max-w-sm border-2 border-blue-600 relative">
                 <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">Más Popular</Badge>
                <CardHeader>
                  <CardTitle className="text-center">Profesional</CardTitle>
                  <p className="text-center text-4xl font-bold">$5.000 <span className="text-lg font-normal text-gray-500">/mes</span></p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Hasta 10 Doctores</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Pacientes Ilimitados</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Reportes Avanzados</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Soporte Prioritario</li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Elegir Plan</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} DentalCRM. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
