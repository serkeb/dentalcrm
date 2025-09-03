import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  ChevronRight,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  UserCheck,
  Clock
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { 
    appointments, 
    patients, 
    doctors, 
    stats, 
    deleteAppointment, 
    loading 
  } = useApp()
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState('Mes')

  // Estadísticas calculadas
  const dashboardStats = [
    {
      title: "Citas",
      value: stats.totalAppointments.toString(),
      change: `+${stats.appointmentChange}%`,
      subtitle: `${stats.todayAppointments} citas hoy`,
      icon: Calendar,
      color: "text-blue-600",
      trend: [40, 45, 35, 50, 49, 60, 70, 91, 125, 150, 200, 180]
    },
    {
      title: "Pacientes",
      value: stats.totalPatients.toString(),
      change: "+3%",
      subtitle: `${patients.length} pacientes activos`,
      icon: Users,
      color: "text-green-600",
      trend: [20, 25, 30, 35, 40, 38, 45, 50, 55, 60, 65, 70]
    },
    {
      title: "Doctores",
      value: doctors.length.toString(),
      change: "+0%",
      subtitle: `${doctors.filter(d => d.status === 'available' || d.status === 'online').length} disponibles`,
      icon: Activity,
      color: "text-purple-600",
      trend: [5, 8, 12, 15, 18, 20, 22, 24, 24, 24, 24, 24]
    }
  ]

  // Citas recientes (últimas 5)
  const recentAppointments = appointments.slice(0, 5)

  // Doctores con mejor estado para el sidebar
  const activeDoctors = doctors.filter(d => d.status === 'online' || d.status === 'available')

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      await deleteAppointment(id)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'programada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'en_proceso': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getDoctorStatusColor = (status) => {
    const colors = {
      'online': 'bg-green-500',
      'available': 'bg-blue-500',
      'busy': 'bg-yellow-500',
      'offline': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getDoctorStatusText = (status) => {
    const texts = {
      'online': 'En línea',
      'available': 'Disponible',
      'busy': 'Ocupado',
      'offline': 'Ausente'
    }
    return texts[status] || 'Desconocido'
  }

  const generateChartData = () => {
    // Simular datos basados en el período seleccionado
    const baseData = [40, 20, 60, 45, 55, 70, 65]
    if (selectedPeriod === 'Semana') {
      return [30, 15, 50, 35, 45, 60, 55]
    } else if (selectedPeriod === 'Año') {
      return [50, 30, 70, 55, 65, 80, 75]
    }
    return baseData
  }

  const getUserName = () => {
    return user?.user_metadata?.name?.split(' ')[0] || 'Usuario'
  }

  return (
    <div className="space-y-6">
      {/* Sección de bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido de vuelta, {getUserName()}!
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu clínica dental hoy.
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna principal (3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardStats.map((stat, index) => (
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
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de barras */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Citas por Período</CardTitle>
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
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-600">Completadas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-600">Programadas</span>
                  </div>
                </div>
                <div className="flex items-end space-x-2 h-32">
                  {generateChartData().map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer">
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                        style={{height: `${height}%`}}
                      />
                      <div 
                        className="w-full bg-gray-200 rounded-b hover:bg-gray-300 transition-colors"
                        style={{height: `${100-height}%`}}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico circular */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Estado de Citas</CardTitle>
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
                      strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                      className="hover:stroke-blue-700 transition-colors"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</span>
                    <span className="text-sm text-green-600 font-medium">75%</span>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Completadas</span>
                    <span className="font-medium">{Math.floor(stats.totalAppointments * 0.75)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Pendientes</span>
                    <span className="font-medium">{Math.ceil(stats.totalAppointments * 0.25)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabla de citas recientes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Citas Recientes</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="hover:bg-gray-100">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/appointments')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recentAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Hora</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {appointment.patient?.name?.charAt(0) || 'P'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">{appointment.patient?.name || 'Paciente'}</span>
                                <p className="text-xs text-gray-500">{appointment.patient?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {appointment.doctor?.name || 'Doctor'}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-gray-600">{appointment.time}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(appointment.status)}>
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
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay citas recientes
                  <div className="mt-4">
                    <Button onClick={() => navigate('/appointments')}>
                      Crear primera cita
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar derecho (1/4) */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Estado de doctores */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Doctores</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/doctors')}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Ver más <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeDoctors.length > 0 ? (
                  <div className="space-y-3">
                    {activeDoctors.slice(0, 4).map((doctor) => (
                      <div 
                        key={doctor.id} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${getDoctorStatusColor(doctor.status)}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${
                          doctor.status === 'online' ? 'bg-green-100 text-green-800' : 
                          doctor.status === 'available' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getDoctorStatusText(doctor.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay doctores disponibles</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/doctors')}
                    >
                      Gestionar doctores
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Citas de hoy */}
            <Card>
              <CardHeader>
                <CardTitle>Citas de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.todayAppointments > 0 ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</div>
                      <p className="text-sm text-gray-600">citas programadas</p>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/calendar')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Ver calendario
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500 mb-3">No hay citas para hoy</p>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/appointments')}
                    >
                      Programar cita
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard