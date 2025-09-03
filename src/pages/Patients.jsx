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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
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
  User,
  Users,
  FileText,
  MapPin,
  Heart,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'

const Patients = () => {
  const { 
    patients, 
    appointments,
    createPatient, 
    updatePatient, 
    deletePatient 
  } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  
  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: new Date(),
    gender: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    insurance: '',
    medical_notes: '',
    allergies: '',
    medications: ''
  })

  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Other', label: 'Otro' }
  ]

  const insuranceOptions = [
    'Particular',
    'OSDE',
    'Swiss Medical',
    'Galeno',
    'Medicus',
    'Sancor Salud',
    'Accord Salud',
    'Otra'
  ]

  // Calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
    
    let matchesAge = true
    if (ageFilter !== 'all') {
      const age = calculateAge(patient.birth_date)
      switch (ageFilter) {
        case 'child':
          matchesAge = age < 18
          break
        case 'adult':
          matchesAge = age >= 18 && age < 65
          break
        case 'senior':
          matchesAge = age >= 65
          break
      }
    }
    
    return matchesSearch && matchesAge
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birth_date: new Date(),
      gender: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      insurance: '',
      medical_notes: '',
      allergies: '',
      medications: ''
    })
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await createPatient({
        ...formData,
        birth_date: format(formData.birth_date, 'yyyy-MM-dd')
      })
      
      setIsCreateOpen(false)
      resetForm()
      toast.success('Paciente creado correctamente')
    } catch (error) {
      toast.error('Error al crear el paciente')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updatePatient(selectedPatient.id, {
        ...formData,
        birth_date: format(formData.birth_date, 'yyyy-MM-dd')
      })
      
      setIsEditOpen(false)
      setSelectedPatient(null)
      resetForm()
      toast.success('Paciente actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el paciente')
    }
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      birth_date: new Date(patient.birth_date),
      gender: patient.gender || '',
      address: patient.address || '',
      emergency_contact: patient.emergency_contact || '',
      emergency_phone: patient.emergency_phone || '',
      insurance: patient.insurance || '',
      medical_notes: patient.medical_notes || '',
      allergies: patient.allergies || '',
      medications: patient.medications || ''
    })
    setIsEditOpen(true)
  }

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setIsViewOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await deletePatient(id)
        toast.success('Paciente eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar el paciente')
      }
    }
  }

  // Obtener citas de un paciente
  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patient_id === patientId)
  }

  // Estadísticas por edades
  const getAgeStats = () => {
    const stats = {
      children: patients.filter(p => calculateAge(p.birth_date) < 18).length,
      adults: patients.filter(p => {
        const age = calculateAge(p.birth_date)
        return age >= 18 && age < 65
      }).length,
      seniors: patients.filter(p => calculateAge(p.birth_date) >= 65).length
    }
    return stats
  }

  const ageStats = getAgeStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-600">
            Administra la información de todos tus pacientes
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Paciente</DialogTitle>
                <DialogDescription>
                  Registra un nuevo paciente en el sistema
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="medical">Información Médica</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <TabsContent value="basic" className="space-y-4">
                    {/* Información básica */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Juan Pérez"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="juan@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+54 11 1234-5678"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Género</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => setFormData({...formData, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Fecha de Nacimiento *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.birth_date ? format(formData.birth_date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.birth_date}
                            onSelect={(date) => setFormData({...formData, birth_date: date})}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Av. Corrientes 1234, CABA"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency_contact">Contacto de Emergencia</Label>
                        <Input
                          id="emergency_contact"
                          value={formData.emergency_contact}
                          onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                          placeholder="Nombre del contacto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_phone">Teléfono de Emergencia</Label>
                        <Input
                          id="emergency_phone"
                          value={formData.emergency_phone}
                          onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                          placeholder="+54 11 9876-5432"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="insurance">Obra Social/Seguro</Label>
                      <Select 
                        value={formData.insurance} 
                        onValueChange={(value) => setFormData({...formData, insurance: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar obra social" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceOptions.map(insurance => (
                            <SelectItem key={insurance} value={insurance}>
                              {insurance}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="space-y-4">
                    {/* Información médica */}
                    <div>
                      <Label htmlFor="allergies">Alergias</Label>
                      <Textarea
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                        placeholder="Medicamentos, alimentos, materiales..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medications">Medicamentos Actuales</Label>
                      <Textarea
                        id="medications"
                        value={formData.medications}
                        onChange={(e) => setFormData({...formData, medications: e.target.value})}
                        placeholder="Lista de medicamentos que toma regularmente..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medical_notes">Notas Médicas</Label>
                      <Textarea
                        id="medical_notes"
                        value={formData.medical_notes}
                        onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}
                        placeholder="Historial médico, condiciones especiales, observaciones..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Paciente</Button>
                  </DialogFooter>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Niños</p>
                <p className="text-2xl font-bold text-gray-900">{ageStats.children}</p>
                <p className="text-xs text-gray-500">Menores de 18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Adultos</p>
                <p className="text-2xl font-bold text-gray-900">{ageStats.adults}</p>
                <p className="text-xs text-gray-500">18-64 años</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Adultos Mayores</p>
                <p className="text-2xl font-bold text-gray-900">{ageStats.seniors}</p>
                <p className="text-xs text-gray-500">65+ años</p>
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
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtro por edad */}
            <div className="sm:w-48">
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las edades</SelectItem>
                  <SelectItem value="child">Niños (5-17)</SelectItem>
                  <SelectItem value="adult">Adultos (18-64)</SelectItem>
                  <SelectItem value="senior">Mayores (65+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pacientes {filteredPatients.length !== patients.length && `(${filteredPatients.length} de ${patients.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Paciente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contacto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Edad</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Obra Social</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Citas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const age = calculateAge(patient.birth_date)
                    const patientAppointments = getPatientAppointments(patient.id)
                    
                    return (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {patient.name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{patient.name}</span>
                              {patient.gender && (
                                <p className="text-xs text-gray-500">
                                  {patient.gender === 'M' ? 'Masculino' : 
                                   patient.gender === 'F' ? 'Femenino' : 'Otro'}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {patient.email && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-32">{patient.email}</span>
                              </div>
                            )}
                            {patient.phone && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium">{age} años</span>
                          {patient.birth_date && (
                            <p className="text-xs text-gray-500">
                              {format(new Date(patient.birth_date), 'dd/MM/yyyy')}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {patient.insurance ? (
                            <Badge variant="outline">{patient.insurance}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">No especificada</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {patientAppointments.length}
                            </Badge>
                            {patientAppointments.length > 0 && (
                              <span className="text-xs text-gray-500">
                                Última: {format(new Date(Math.max(...patientAppointments.map(a => new Date(a.date)))), 'dd/MM')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600"
                              onClick={() => handleView(patient)}
                            >
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
                              onClick={() => handleEdit(patient)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDelete(patient.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pacientes</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || ageFilter !== 'all' 
                  ? 'No se encontraron pacientes con los filtros aplicados' 
                  : 'Aún no has registrado ningún paciente'
                }
              </p>
              {!searchTerm && ageFilter === 'all' && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar primer paciente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualización */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Información del Paciente</DialogTitle>
            <DialogDescription>
              Detalles completos del paciente
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="medical">Médica</TabsTrigger>
                <TabsTrigger value="appointments">Citas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                      {selectedPatient.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                    <p className="text-gray-600">{calculateAge(selectedPatient.birth_date)} años</p>
                    {selectedPatient.insurance && (
                      <Badge className="mt-1">{selectedPatient.insurance}</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Contacto</h4>
                      {selectedPatient.email && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{selectedPatient.email}</span>
                        </div>
                      )}
                      {selectedPatient.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{selectedPatient.phone}</span>
                        </div>
                      )}
                    </div>

                    {selectedPatient.address && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Dirección</h4>
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          <span>{selectedPatient.address}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Información Personal</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Fecha de nacimiento: </span>
                          {format(new Date(selectedPatient.birth_date), 'dd/MM/yyyy')}
                        </div>
                        {selectedPatient.gender && (
                          <div>
                            <span className="font-medium">Género: </span>
                            {selectedPatient.gender === 'M' ? 'Masculino' : 
                             selectedPatient.gender === 'F' ? 'Femenino' : 'Otro'}
                          </div>
                        )}
                      </div>
                    </div>

                    {(selectedPatient.emergency_contact || selectedPatient.emergency_phone) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Contacto de Emergencia</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {selectedPatient.emergency_contact && (
                            <div>{selectedPatient.emergency_contact}</div>
                          )}
                          {selectedPatient.emergency_phone && (
                            <div>{selectedPatient.emergency_phone}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                {selectedPatient.allergies && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Alergias</h4>
                    </div>
                    <p className="text-sm text-red-800">{selectedPatient.allergies}</p>
                  </div>
                )}

                {selectedPatient.medications && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Medicamentos Actuales</h4>
                    </div>
                    <p className="text-sm text-yellow-800">{selectedPatient.medications}</p>
                  </div>
                )}

                {selectedPatient.medical_notes && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Notas Médicas</h4>
                    </div>
                    <p className="text-sm text-blue-800">{selectedPatient.medical_notes}</p>
                  </div>
                )}

                {!selectedPatient.allergies && !selectedPatient.medications && !selectedPatient.medical_notes && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No hay información médica registrada</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                {(() => {
                  const patientAppointments = getPatientAppointments(selectedPatient.id)
                  
                  return patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {patientAppointments
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(appointment => (
                        <div key={appointment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {format(new Date(appointment.date), 'dd/MM/yyyy')} - {appointment.time}
                                </span>
                                <Badge className="text-xs">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.type} con {appointment.doctor?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No tiene citas registradas</p>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Modifica la información del paciente
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="medical">Información Médica</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <TabsContent value="basic" className="space-y-4">
                {/* Campos similares al modal de creación */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                {/* ... resto de campos similares ... */}
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                {/* Campos médicos similares al modal de creación */}
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Paciente</Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Patients