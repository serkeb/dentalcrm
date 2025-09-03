import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.jsx'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Calendar } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  FileText,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

const Appointments = () => {
  const { 
    appointments, 
    patients, 
    doctors, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment 
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  
  // Formulario
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: new Date(),
    time: '',
    type: '',
    notes: '',
    status: 'programada'
  })

  const appointmentTypes = [
    'Consulta General',
    'Limpieza Dental',
    'Empaste',
    'Extracción',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Cirugía Oral'
  ]

  const appointmentStatuses = [
    { value: 'programada', label: 'Programada', color: 'bg-blue-100 text-blue-800' },
    { value: 'completada', label: 'Completada', color: 'bg-green-100 text-green-800' },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    { value: 'en_proceso', label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' }
  ]

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ]

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      date: new Date(),
      time: '',
      type: '',
      notes: '',
      status: 'programada'
    })
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await createAppointment({
        ...formData,
        date: format(formData.date, 'yyyy-MM-dd')
      })
      
      setIsCreateOpen(false)
      resetForm()
      toast.success('Cita creada correctamente')
    } catch (error) {
      toast.error('Error al crear la cita')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateAppointment(selectedAppointment.id, {
        ...formData,
        date: format(formData.date, 'yyyy-MM-dd')
      })
      
      setIsEditOpen(false)
      setSelectedAppointment(null)
      resetForm()
      toast.success('Cita actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la cita')
    }
  }

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      date: new Date(appointment.date),
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes || '',
      status: appointment.status
    })
    setIsEditOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await deleteAppointment(id)
        toast.success('Cita eliminada correctamente')
      } catch (error) {
        toast.error('Error al eliminar la cita')
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusInfo = appointmentStatuses.find(s => s.value === status)
    return statusInfo || { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
          <p className="text-gray-600">
            Administra todas las citas de tu clínica dental
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cita</DialogTitle>
              <DialogDescription>
                Programa una nueva cita para un paciente
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Seleccionar Paciente */}
              <div>
                <Label htmlFor="patient">Paciente</Label>
                <Select 
                  value={formData.patient_id} 
                  onValueChange={(value) => setFormData({...formData, patient_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleccionar Doctor */}
              <div>
                <Label htmlFor="doctor">Doctor</Label>
                <Select 
                  value={formData.doctor_id} 
                  onValueChange={(value) => setFormData({...formData, doctor_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha */}
              <div>
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({...formData, date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Hora */}
              <div>
                <Label htmlFor="time">Hora</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({...formData, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de cita */}
              <div>
                <Label htmlFor="type">Tipo de Cita</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notas */}
              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notas adicionales sobre la cita"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Cita</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Citas</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'programada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'completada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'cancelada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Buscar por paciente, doctor o tipo de cita..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtro por estado */}
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Tabla de citas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Citas {filteredAppointments.length !== appointments.length && `(${filteredAppointments.length} de ${appointments.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha & Hora</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
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
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{appointment.doctor?.name || 'Doctor'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('es-ES')}
                          </span>
                          <span className="text-sm text-gray-500">{appointment.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{appointment.type}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadge(appointment.status).color}>
                          {getStatusBadge(appointment.status).label}
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 hover:bg-yellow-100 hover:text-yellow-600"
                            onClick={() => handleEdit(appointment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleDelete(appointment.id)}
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
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No se encontraron citas con los filtros aplicados' 
                  : 'Aún no has creado ninguna cita'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primera cita
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cita</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cita
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Formulario similar al de creación */}
            <div>
              <Label htmlFor="patient">Paciente</Label>
              <Select 
                value={formData.patient_id} 
                onValueChange={(value) => setFormData({...formData, patient_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doctor">Doctor</Label>
              <Select 
                value={formData.doctor_id} 
                onValueChange={(value) => setFormData({...formData, doctor_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({...formData, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Hora</Label>
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData({...formData, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Cita</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notas adicionales"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Cita</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Appointments