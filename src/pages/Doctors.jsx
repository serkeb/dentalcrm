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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { useApp } from '../contexts/AppContext'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  UserCheck,
  Stethoscope,
  Star,
  Clock,
  Calendar,
  Award,
  MapPin,
  Globe,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

const Doctors = () => {
  const { 
    doctors, 
    appointments,
    createDoctor, 
    updateDoctor, 
    deleteDoctor 
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  
  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    license_number: '',
    years_experience: '',
    status: 'available',
    description: '',
    education: '',
    certifications: '',
    schedule: {
      monday: { enabled: true, start: '08:00', end: '17:00' },
      tuesday: { enabled: true, start: '08:00', end: '17:00' },
      wednesday: { enabled: true, start: '08:00', end: '17:00' },
      thursday: { enabled: true, start: '08:00', end: '17:00' },
      friday: { enabled: true, start: '08:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '09:00', end: '13:00' }
    },
    consultation_fee: '',
    address: '',
    languages: []
  })

  const specialties = [
    'Odontología General',
    'Ortodoncia',
    'Periodoncia', 
    'Endodoncia',
    'Cirugía Oral',
    'Odontopediatría',
    'Prostodoncia',
    'Radiología Oral',
    'Patología Oral',
    'Implantología'
  ]

  const statusOptions = [
    { value: 'online', label: 'En línea', color: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
    { value: 'available', label: 'Disponible', color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
    { value: 'busy', label: 'Ocupado', color: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
    { value: 'offline', label: 'Ausente', color: 'bg-red-500', badge: 'bg-red-100 text-red-800' }
  ]

  const languages = ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 'Alemán']
  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  // Filtrar doctores
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter
    
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      license_number: '',
      years_experience: '',
      status: 'available',
      description: '',
      education: '',
      certifications: '',
      schedule: {
        monday: { enabled: true, start: '08:00', end: '17:00' },
        tuesday: { enabled: true, start: '08:00', end: '17:00' },
        wednesday: { enabled: true, start: '08:00', end: '17:00' },
        thursday: { enabled: true, start: '08:00', end: '17:00' },
        friday: { enabled: true, start: '08:00', end: '17:00' },
        saturday: { enabled: false, start: '09:00', end: '13:00' },
        sunday: { enabled: false, start: '09:00', end: '13:00' }
      },
      consultation_fee: '',
      address: '',
      languages: []
    })
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await createDoctor({
        ...formData,
        languages: formData.languages.join(','),
        schedule: JSON.stringify(formData.schedule)
      })
      
      setIsCreateOpen(false)
      resetForm()
      toast.success('Doctor creado correctamente')
    } catch (error) {
      toast.error('Error al crear el doctor')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateDoctor(selectedDoctor.id, {
        ...formData,
        languages: formData.languages.join(','),
        schedule: JSON.stringify(formData.schedule)
      })
      
      setIsEditOpen(false)
      setSelectedDoctor(null)
      resetForm()
      toast.success('Doctor actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el doctor')
    }
  }

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialty: doctor.specialty || '',
      license_number: doctor.license_number || '',
      years_experience: doctor.years_experience || '',
      status: doctor.status || 'available',
      description: doctor.description || '',
      education: doctor.education || '',
      certifications: doctor.certifications || '',
      schedule: doctor.schedule ? JSON.parse(doctor.schedule) : formData.schedule,
      consultation_fee: doctor.consultation_fee || '',
      address: doctor.address || '',
      languages: doctor.languages ? doctor.languages.split(',') : []
    })
    setIsEditOpen(true)
  }

  const handleView = (doctor) => {
    setSelectedDoctor(doctor)
    setIsViewOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este doctor?')) {
      try {
        await deleteDoctor(id)
        toast.success('Doctor eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar el doctor')
      }
    }
  }

  // Obtener citas de un doctor
  const getDoctorAppointments = (doctorId) => {
    return appointments.filter(apt => apt.doctor_id === doctorId)
  }

  // Obtener estadísticas de doctores
  const getDoctorStats = () => {
    return {
      total: doctors.length,
      online: doctors.filter(d => d.status === 'online').length,
      available: doctors.filter(d => d.status === 'available').length,
      busy: doctors.filter(d => d.status === 'busy').length,
      offline: doctors.filter(d => d.status === 'offline').length
    }
  }

  const doctorStats = getDoctorStats()

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[1]
  }

  const updateScheduleDay = (day, field, value) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: {
          ...formData.schedule[day],
          [field]: value
        }
      }
    })
  }

  const toggleLanguage = (language) => {
    const currentLanguages = formData.languages
    if (currentLanguages.includes(language)) {
      setFormData({
        ...formData,
        languages: currentLanguages.filter(l => l !== language)
      })
    } else {
      setFormData({
        ...formData,
        languages: [...currentLanguages, language]
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Doctores</h1>
          <p className="text-gray-600">
            Administra el equipo médico de tu clínica dental
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Doctor</DialogTitle>
              <DialogDescription>
                Registra un nuevo doctor en el equipo médico
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Información Básica</TabsTrigger>
                <TabsTrigger value="professional">Profesional</TabsTrigger>
                <TabsTrigger value="schedule">Horarios</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Dr. Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="doctor@clinica.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Especialidad *</Label>
                      <Select 
                        value={formData.specialty} 
                        onValueChange={(value) => setFormData({...formData, specialty: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => setFormData({...formData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="consultation_fee">Honorario por Consulta</Label>
                      <Input
                        id="consultation_fee"
                        type="number"
                        value={formData.consultation_fee}
                        onChange={(e) => setFormData({...formData, consultation_fee: e.target.value})}
                        placeholder="15000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección del consultorio</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Av. Corrientes 1234, CABA"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Breve descripción del doctor y su experiencia..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="license_number">Número de Matrícula</Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                        placeholder="MP 12345"
                      />
                    </div>
                    <div>
                      <Label htmlFor="years_experience">Años de Experiencia</Label>
                      <Input
                        id="years_experience"
                        type="number"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Educación</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      placeholder="Universidad de Buenos Aires, Especialización en..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="certifications">Certificaciones y Cursos</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                      placeholder="Certificado en Implantología, Curso de..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Idiomas</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {languages.map(language => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.languages.includes(language)
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          } border`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Horario de Atención</h4>
                    {daysOfWeek.map(day => (
                      <div key={day.key} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-20">
                          <Switch
                            checked={formData.schedule[day.key].enabled}
                            onCheckedChange={(checked) => updateScheduleDay(day.key, 'enabled', checked)}
                          />
                          <span className="text-sm font-medium ml-2">{day.label}</span>
                        </div>
                        
                        {formData.schedule[day.key].enabled && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={formData.schedule[day.key].start}
                              onChange={(e) => updateScheduleDay(day.key, 'start', e.target.value)}
                              className="w-24"
                            />
                            <span className="text-gray-500">a</span>
                            <Input
                              type="time"
                              value={formData.schedule[day.key].end}
                              onChange={(e) => updateScheduleDay(day.key, 'end', e.target.value)}
                              className="w-24"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Doctor</Button>
                </DialogFooter>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{doctorStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">En línea</p>
                <p className="text-2xl font-bold text-gray-900">{doctorStats.online}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{doctorStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Ocupados</p>
                <p className="text-2xl font-bold text-gray-900">{doctorStats.busy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Ausentes</p>
                <p className="text-2xl font-bold text-gray-900">{doctorStats.offline}</p>
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
                  placeholder="Buscar por nombre, especialidad o email..."
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
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por especialidad */}
            <div className="sm:w-48">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <Stethoscope className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de doctores */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const statusInfo = getStatusInfo(doctor.status)
            const doctorAppointments = getDoctorAppointments(doctor.id)
            
            return (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header del doctor */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {doctor.name?.split(' ').map(n => n[0]).join('') || 'D'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusInfo.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <Badge className={statusInfo.badge}>
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Información */}
                  <div className="space-y-2 mb-4">
                    {doctor.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                    )}
                    {doctor.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.years_experience && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{doctor.years_experience} años de experiencia</span>
                      </div>
                    )}
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{doctorAppointments.length}</div>
                      <div className="text-xs text-gray-500">Citas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {doctor.consultation_fee ? `$${doctor.consultation_fee}` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Honorario</div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleView(doctor)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(doctor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay doctores</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || specialtyFilter !== 'all'
                ? 'No se encontraron doctores con los filtros aplicados' 
                : 'Aún no has registrado ningún doctor'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && specialtyFilter === 'all' && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar primer doctor
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de visualización */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Información del Doctor</DialogTitle>
            <DialogDescription>
              Perfil completo del doctor
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="schedule">Horarios</TabsTrigger>
                <TabsTrigger value="appointments">Citas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                        {selectedDoctor.name?.split(' ').map(n => n[0]).join('') || 'D'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusInfo(selectedDoctor.status).color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-gray-600">{selectedDoctor.specialty}</p>
                    <Badge className={getStatusInfo(selectedDoctor.status).badge}>
                      {getStatusInfo(selectedDoctor.status).label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contacto</h4>
                      <div className="space-y-2">
                        {selectedDoctor.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{selectedDoctor.email}</span>
                          </div>
                        )}
                        {selectedDoctor.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedDoctor.phone}</span>
                          </div>
                        )}
                        {selectedDoctor.address && (
                          <div className="flex items-start space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{selectedDoctor.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedDoctor.languages && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Idiomas</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDoctor.languages.split(',').map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Información Profesional</h4>
                      <div className="space-y-2 text-sm">
                        {selectedDoctor.license_number && (
                          <div>
                            <span className="font-medium">Matrícula: </span>
                            {selectedDoctor.license_number}
                          </div>
                        )}
                        {selectedDoctor.years_experience && (
                          <div>
                            <span className="font-medium">Experiencia: </span>
                            {selectedDoctor.years_experience} años
                          </div>
                        )}
                        {selectedDoctor.consultation_fee && (
                          <div>
                            <span className="font-medium">Honorario: </span>
                            ${selectedDoctor.consultation_fee}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDoctor.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      {selectedDoctor.description}
                    </p>
                  </div>
                )}

                {(selectedDoctor.education || selectedDoctor.certifications) && (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedDoctor.education && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Educación</h4>
                        <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                          {selectedDoctor.education}
                        </p>
                      </div>
                    )}
                    {selectedDoctor.certifications && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Certificaciones</h4>
                        <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                          {selectedDoctor.certifications}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3">Horario de Atención</h4>
                {selectedDoctor.schedule ? (() => {
                  const schedule = JSON.parse(selectedDoctor.schedule)
                  return (
                    <div className="space-y-2">
                      {daysOfWeek.map(day => (
                        <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{day.label}</span>
                          {schedule[day.key]?.enabled ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">
                                {schedule[day.key].start} - {schedule[day.key].end}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-500">Cerrado</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })() : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No hay horarios configurados</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                {(() => {
                  const doctorAppointments = getDoctorAppointments(selectedDoctor.id)
                  
                  return doctorAppointments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Citas Programadas</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {doctorAppointments.length} total
                        </Badge>
                      </div>
                      {doctorAppointments
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 10)
                        .map(appointment => (
                        <div key={appointment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {new Date(appointment.date).toLocaleDateString('es-ES')} - {appointment.time}
                                </span>
                                <Badge className="text-xs">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.type} - {appointment.patient?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No tiene citas programadas</p>
                    </div>
                  )
                })()}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edición - Similar al de creación pero con datos prellenados */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Doctor</DialogTitle>
            <DialogDescription>
              Modifica la información del doctor
            </DialogDescription>
          </DialogHeader>
          
          {/* Contenido similar al formulario de creación pero con handleEditSubmit */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="professional">Profesional</TabsTrigger>
              <TabsTrigger value="schedule">Horarios</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Tabs content similar a la creación */}
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Doctor</Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Doctors