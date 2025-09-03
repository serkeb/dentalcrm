import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  Search,
  Bell,
  Settings,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Stethoscope,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('Mes')
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "John Don",
      doctor: "Dr. Jacob Ryan",
      date: "12/05/2025",
      time: "10:00 AM",
      status: "Fiebre",
      statusColor: "bg-red-100 text-red-800",
      phone: "+1234567890",
      email: "john.don@email.com"
    },
    {
      id: 2,
      patient: "Dr. Sophia Patel",
      doctor: "Dr. Ryan Bennett",
      date: "12/05/2025",
      time: "2:30 PM",
      status: "Cólera",
      statusColor: "bg-green-100 text-green-800",
      phone: "+0987654321",
      email: "sophia.patel@email.com"
    },
    {
      id: 3,
      patient: "Maria Rodriguez",
      doctor: "Dr. Isabelle Cooper",
      date: "13/05/2025",
      time: "9:15 AM",
      status: "Consulta",
      statusColor: "bg-blue-100 text-blue-800",
      phone: "+1122334455",
      email: "maria.rodriguez@email.com"
    },
    {
      id: 4,
      patient: "Carlos Mendez",
      doctor: "Dr. Michael Chang",
      date: "13/05/2025",
      time: "11:45 AM",
      status: "Seguimiento",
      statusColor: "bg-yellow-100 text-yellow-800",
      phone: "+5566778899",
      email: "carlos.mendez@email.com"
    }
  ])

  const [stats, setStats] = useState([
    {
      title: "Citas",
      value: "650",
      change: "+5%",
      subtitle: "Visitas de pacientes 32% en 7 días",
      icon: Calendar,
      color: "text-blue-600",
      trend: [40, 45, 35, 50, 49, 60, 70, 91, 125, 150, 200, 180]
    },
    {
      title: "Pacientes",
      value: "129",
      change: "+3%",
      subtitle: "Visitas de pacientes 15% la semana pasada",
      icon: Users,
      color: "text-green-600",
      trend: [20, 25, 30, 35, 40, 38, 45, 50, 55, 60, 65, 70]
    },
    {
      title: "Operaciones",
      value: "24",
      change: "+0%",
      subtitle: "Hay 8 operaciones programadas hoy",
      icon: Activity,
      color: "text-purple-600",
      trend: [5, 8, 12, 15, 18, 20, 22, 24, 24, 24, 24, 24]
    }
  ])

  const doctors = [
    {
      id: 1,
      name: "Dr. Isabelle Cooper",
      specialty: "Dermatólogo",
      image: "/api/placeholder/64/64",
      status: "online",
      description: "Dr. Isabelle Cooper es un dermatólogo dedicado especializado en cuidado avanzado de la piel, tratamientos y estética para una piel saludable y radiante.",
      experience: "8 años",
      patients: "450+",
      rating: 4.9,
      nextAvailable: "Hoy 2:00 PM"
    },
    {
      id: 2,
      name: "Dr. Jaxson Jordan",
      specialty: "Doctor de Cuidado de la Piel",
      image: "/api/placeholder/64/64",
      status: "available",
      description: "Especialista en tratamientos dermatológicos avanzados y cuidado preventivo de la piel.",
      experience: "6 años",
      patients: "320+",
      rating: 4.7,
      nextAvailable: "Mañana 9:00 AM"
    },
    {
      id: 3,
      name: "Dr. Michael Chang",
      specialty: "Médico Estético",
      image: "/api/placeholder/64/64",
      status: "available",
      description: "Experto en medicina estética y procedimientos cosméticos no invasivos.",
      experience: "10 años",
      patients: "600+",
      rating: 4.8,
      nextAvailable: "Hoy 4:30 PM"
    },
    {
      id: 4,
      name: "Dr. Emily Sanchez",
      specialty: "Endocrinólogo",
      image: "/api/placeholder/64/64",
      status: "absent",
      description: "Especialista en trastornos hormonales y metabólicos.",
      experience: "12 años",
      patients: "800+",
      rating: 4.9,
      nextAvailable: "Lunes 10:00 AM"
    },
    {
      id: 5,
      name: "Dr. Sarah Lewis",
      specialty: "Psiquiatra",
      image: "/api/placeholder/64/64",
      status: "available",
      description: "Especialista en salud mental y bienestar psicológico.",
      experience: "7 años",
      patients: "280+",
      rating: 4.6,
      nextAvailable: "Mañana 11:00 AM"
    }
  ]

  // Filtrar citas basado en el término de búsqueda
  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para manejar la eliminación de citas
  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id))
  }

  // Función para mostrar detalles del doctor
  const handleShowDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDoctorModal(true)
  }

  // Generar datos del gráfico basado en el período seleccionado
  const generateChartData = () => {
    const baseData = [40, 20, 60, 45, 55, 70, 65]
    if (selectedPeriod === 'Semana') {
      return [30, 15, 50, 35, 45, 60, 55]
    } else if (selectedPeriod === 'Año') {
      return [50, 30, 70, 55, 65, 80, 75]
    }
    return baseData
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DentalCRM</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 ml-8">
              <a href="#" className="text-gray-900 font-medium border-b-2 border-blue-600 pb-1">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Citas</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Doctores</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Personal</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Pacientes</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input 
                type="text" 
                placeholder="Buscar cualquier cosa en DentalCRM"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <AvatarFallback className="bg-blue-600 text-white">W</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido de vuelta, Willian!
            </h1>
            <p className="text-gray-600">Aquí tienes un resumen de tu clínica dental hoy.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <stat.icon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-500">{stat.title}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-6 h-6 text-gray-400" />
                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                    <Badge variant="secondary" className={`${
                      stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{stat.subtitle}</p>
                  
                  {/* Mini trend chart */}
                  <div className="flex items-end space-x-1 h-8">
                    {stat.trend.slice(-7).map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-500 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                        style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hospital Survey Chart */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Encuesta Hospitalaria</CardTitle>
                  <select 
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option>Mes</option>
                    <option>Semana</option>
                    <option>Año</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pacientes Nuevos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pacientes Antiguos</span>
                  </div>
                </div>
                <div className="flex items-end space-x-2 h-32">
                  {generateChartData().map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer">
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                        style={{height: `${height}%`}}
                      ></div>
                      <div 
                        className="w-full bg-gray-200 rounded-b hover:bg-gray-300 transition-colors"
                        style={{height: `${100-height}%`}}
                      ></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Total Appointments */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Total de Citas</CardTitle>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.28} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                      className="hover:stroke-blue-700 transition-colors"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">128</span>
                    <span className="text-sm text-green-600 font-medium">28%</span>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Completadas</span>
                    <span className="font-medium">55</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Próximas</span>
                    <span className="font-medium">73</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Appointments Table */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Citas {searchTerm && `(${filteredAppointments.length} resultados)`}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="hover:bg-gray-100">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Nombre del Paciente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor Asignado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Hora</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{appointment.patient.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{appointment.patient}</span>
                              <p className="text-xs text-gray-500">{appointment.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{appointment.doctor}</td>
                        <td className="py-4 px-4 text-gray-600">{appointment.date}</td>
                        <td className="py-4 px-4 text-gray-600">{appointment.time}</td>
                        <td className="py-4 px-4">
                          <Badge className={appointment.statusColor}>
                            {appointment.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-green-100 hover:text-green-600">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-yellow-100 hover:text-yellow-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron citas que coincidan con tu búsqueda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado del Doctor</h3>
              <Button variant="ghost" className="text-blue-600 text-sm hover:bg-blue-50">
                Ver más <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {/* Featured Doctor */}
            <Card className="mb-4 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback>IC</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Isabelle Cooper</h4>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Dermatólogo</Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium text-gray-900 mb-2">Acerca de Dr. Isabelle Cooper</h5>
                  <p className="text-sm text-gray-600">
                    Dr. Isabelle Cooper es un dermatólogo dedicado especializado en cuidado avanzado de la piel, tratamientos y estética para una piel saludable y radiante.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-blue-600 text-sm p-0 mt-2 hover:text-blue-800"
                    onClick={() => handleShowDoctorDetails(doctors[0])}
                  >
                    Ver más
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Doctors */}
            <div className="space-y-3">
              {doctors.slice(1).map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleShowDoctorDetails(doctor)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={doctor.image} />
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                        doctor.status === 'available' ? 'bg-green-500' : 
                        doctor.status === 'online' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      doctor.status === 'available' ? 'bg-green-100 text-green-800' : 
                      doctor.status === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doctor.status === 'available' ? 'Disponible' : 
                     doctor.status === 'online' ? 'En línea' : 'Ausente'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Doctor Details Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalles del Doctor</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowDoctorModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarImage src={selectedDoctor.image} />
                <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h4 className="text-xl font-semibold text-gray-900">{selectedDoctor.name}</h4>
              <Badge className="bg-blue-100 text-blue-800">{selectedDoctor.specialty}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Descripción</h5>
                <p className="text-sm text-gray-600">{selectedDoctor.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Experiencia</h5>
                  <p className="text-sm text-gray-600">{selectedDoctor.experience}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Pacientes</h5>
                  <p className="text-sm text-gray-600">{selectedDoctor.patients}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Calificación</h5>
                  <p className="text-sm text-gray-600">⭐ {selectedDoctor.rating}/5.0</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Próximo disponible</h5>
                  <p className="text-sm text-gray-600">{selectedDoctor.nextAvailable}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

