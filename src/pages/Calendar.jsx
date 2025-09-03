import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { useApp } from '../contexts/AppContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
         isSameMonth, isSameDay, addMonths, subMonths, 
         startOfWeek, endOfWeek, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const Calendar = () => {
  const { appointments, patients, doctors, deleteAppointment } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const appointmentStatuses = [
    { value: 'programada', label: 'Programada', color: 'bg-blue-100 text-blue-800' },
    { value: 'completada', label: 'Completada', color: 'bg-green-100 text-green-800' },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    { value: 'en_proceso', label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' }
  ]

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { locale: es })
    const calendarEnd = endOfWeek(monthEnd, { locale: es })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  // Filtrar citas
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesDoctor = selectedDoctor === 'all' || appointment.doctor_id === selectedDoctor
      const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus
      return matchesDoctor && matchesStatus
    })
  }, [appointments, selectedDoctor, selectedStatus])

  // Obtener citas para un día específico
  const getAppointmentsForDay = (day) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    )
  }

  // Obtener color del estado
  const getStatusColor = (status) => {
    const statusInfo = appointmentStatuses.find(s => s.value === status)
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800'
  }

  // Navegación del calendario
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setIsViewOpen(true)
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await deleteAppointment(appointmentId)
        setIsViewOpen(false)
      } catch (error) {
        console.error('Error al eliminar cita:', error)
      }
    }
  }

  // Estadísticas del mes actual
  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    
    const monthAppointments = filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= monthStart && aptDate <= monthEnd
    })

    return {
      total: monthAppointments.length,
      programadas: monthAppointments.filter(apt => apt.status === 'programada').length,
      completadas: monthAppointments.filter(apt => apt.status === 'completada').length,
      canceladas: monthAppointments.filter(apt => apt.status === 'cancelada').length
    }
  }, [filteredAppointments, currentDate])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600">
            Vista general de todas las citas programadas
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToToday}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Hoy
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Estadísticas del mes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{monthStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-2xl font-bold text-gray-900">{monthStats.programadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{monthStats.completadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{monthStats.canceladas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Navegación de meses */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-48 text-center">
                      {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Filtros */}
                <div className="flex items-center space-x-2">
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="w-48">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los doctores</SelectItem>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {appointmentStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Vista mensual */}
              {view === 'month' && (
                <div className="calendar-grid">
                  {/* Header de días de la semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid del calendario */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const dayAppointments = getAppointmentsForDay(day)
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isTodayDay = isToday(day)
                      
                      return (
                        <div 
                          key={index} 
                          className={`min-h-24 p-2 border rounded-lg transition-colors ${
                            isCurrentMonth 
                              ? isTodayDay 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white hover:bg-gray-50' 
                              : 'bg-gray-50 text-gray-400'
                          }`}
                        >
                          {/* Número del día */}
                          <div className={`text-sm font-medium mb-1 ${
                            isTodayDay ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {format(day, 'd')}
                          </div>
                          
                          {/* Citas del día */}
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 3).map(appointment => (
                              <div
                                key={appointment.id}
                                className={`text-xs p-1 rounded cursor-pointer transition-colors hover:opacity-80 ${
                                  getStatusColor(appointment.status)
                                }`}
                                onClick={() => handleViewAppointment(appointment)}
                                title={`${appointment.time} - ${appointment.patient?.name} con ${appointment.doctor?.name}`}
                              >
                                <div className="truncate">
                                  {appointment.time} {appointment.patient?.name}
                                </div>
                              </div>
                            ))}
                            {dayAppointments.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayAppointments.length - 3} más
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar derecho */}
        <div className="space-y-6">
          {/* Citas de hoy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Citas de Hoy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const todayAppointments = getAppointmentsForDay(new Date())
                  .sort((a, b) => a.time.localeCompare(b.time))
                
                return todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.slice(0, 5).map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{appointment.time}</span>
                          <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{appointment.patient?.name}</div>
                          <div className="text-xs">{appointment.doctor?.name}</div>
                          <div className="text-xs text-gray-500">{appointment.type}</div>
                        </div>
                      </div>
                    ))}
                    {todayAppointments.length > 5 && (
                      <div className="text-center text-sm text-gray-500">
                        +{todayAppointments.length - 5} citas más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay citas para hoy</p>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Próximas citas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Próximas Citas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const upcomingAppointments = filteredAppointments
                  .filter(apt => new Date(apt.date) > new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                
                return upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {format(new Date(appointment.date), 'dd/MM')} - {appointment.time}
                          </span>
                          <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{appointment.patient?.name}</div>
                          <div className="text-xs">{appointment.doctor?.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay citas próximas</p>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Resumen de doctores activos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Doctores Activos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {doctors
                  .filter(doctor => doctor.status === 'online' || doctor.status === 'available')
                  .slice(0, 4)
                  .map(doctor => {
                    const doctorTodayAppointments = getAppointmentsForDay(new Date())
                      .filter(apt => apt.doctor_id === doctor.id)
                    
                    return (
                      <div key={doctor.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {doctor.name?.split(' ').map(n => n[0]).join('') || 'D'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            doctor.status === 'online' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{doctor.name}</div>
                          <div className="text-xs text-gray-500">
                            {doctorTodayAppointments.length} citas hoy
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de detalles de cita */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription>
              Información completa de la cita seleccionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              {/* Información principal */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    {selectedAppointment.patient?.name}
                  </h3>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <div className="font-medium">
                      {format(new Date(selectedAppointment.date), 'EEEE, d MMMM yyyy', { locale: es })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Hora:</span>
                    <div className="font-medium">{selectedAppointment.time}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <div className="font-medium">{selectedAppointment.doctor?.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <div className="font-medium">{selectedAppointment.type}</div>
                  </div>
                </div>
              </div>

              {/* Información del paciente */}
              <div className="space-y-3">
                <h4 className="font-medium">Información del Paciente</h4>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {selectedAppointment.patient?.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedAppointment.patient?.name}</div>
                    {selectedAppointment.patient?.email && (
                      <div className="text-sm text-gray-600">{selectedAppointment.patient.email}</div>
                    )}
                    {selectedAppointment.patient?.phone && (
                      <div className="text-sm text-gray-600">{selectedAppointment.patient.phone}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedAppointment.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notas</h4>
                  <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Paciente
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Calendar