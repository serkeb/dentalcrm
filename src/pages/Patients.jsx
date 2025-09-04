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
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', birth_date: new Date(), gender: '', address: '',
    emergency_contact: '', emergency_phone: '', insurance: '', medical_notes: '',
    allergies: '', medications: ''
  })

  const genderOptions = [
    { value: 'M', label: 'Masculino' }, 
    { value: 'F', label: 'Femenino' }, 
    { value: 'Other', label: 'Otro' }
  ]
  const insuranceOptions = [
    'Particular', 'OSDE', 'Swiss Medical', 'Galeno', 'Medicus', 'Sancor Salud', 'Accord Salud', 'Otra'
  ]

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
    
    let matchesAge = true;
    if (ageFilter !== 'all') {
      const age = calculateAge(patient.birth_date);
      switch (ageFilter) {
        case 'child': matchesAge = age < 18; break;
        case 'adult': matchesAge = age >= 18 && age < 65; break;
        case 'senior': matchesAge = age >= 65; break;
        default: break;
      }
    }
    return matchesSearch && matchesAge;
  })

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', birth_date: new Date(), gender: '', address: '',
      emergency_contact: '', emergency_phone: '', insurance: '', medical_notes: '',
      allergies: '', medications: ''
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
      toast.error('Error al crear el paciente: ' + error.message)
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
      toast.error('Error al actualizar el paciente: ' + error.message)
    }
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name || '', 
      email: patient.email || '', 
      phone: patient.phone || '',
      birth_date: patient.birth_date ? new Date(patient.birth_date) : new Date(), 
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

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patient_id === patientId)
  }

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
          <p className="text-gray-600">Administra la información de todos tus pacientes</p>
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
                <DialogDescription>Registra un nuevo paciente en el sistema</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="medical">Información Médica</TabsTrigger>
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
                        <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                          placeholder="María Pérez"
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
                  </TabsContent>

                  <TabsContent value="medical" className="space-y-4">
                    <div>
                      <Label htmlFor="insurance">Obra Social / Seguro</Label>
                      <Select value={formData.insurance} onValueChange={(value) => setFormData({...formData, insurance: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar obra social" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceOptions.map(insurance => (
                            <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="allergies">Alergias</Label>
                      <Textarea
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                        placeholder="Penicilina, frutos secos..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medications">Medicamentos Actuales</Label>
                      <Textarea
                        id="medications"
                        value={formData.medications}
                        onChange={(e) => setFormData({...formData, medications: e.target.value})}
                        placeholder="Aspirina 100mg, Omeprazol..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medical_notes">Notas Médicas</Label>
                      <Textarea
                        id="medical_notes"
                        value={formData.medical_notes}
                        onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}
                        placeholder="Historial médico relevante..."
                        rows={3}
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
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Adultos</p>
                <p className="text-2xl font-bold text-gray-900">{ageStats.adults}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Adultos Mayores</p>
                <p className="text-2xl font-bold text-gray-900">{ageStats.seniors}</p>
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
                  <SelectItem value="child">Niños (0-17)</SelectItem>
                  <SelectItem value="adult">Adultos (18-64)</SelectItem>
                  <SelectItem value="senior">Adultos Mayores (65+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Edad</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contacto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Obra Social</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Citas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const patientAppointments = getPatientAppointments(patient.id)
                    const age = calculateAge(patient.birth_date)
                    
                    return (
                      <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {patient.name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{patient.name}</span>
                              <p className="text-xs text-gray-500">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{age} años</span>
                            <span className="text-xs text-gray-500">
                              {patient.birth_date ? format(new Date(patient.birth_date), 'dd/MM/yyyy') : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {patient.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1" />
                                {patient.phone}
                              </div>
                            )}
                            {patient.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-3 h-3 mr-1" />
                                {patient.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {patient.insurance || 'Particular'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">
                            {patientAppointments.length} citas
                          </Badge>
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 hover:bg-green-100 hover:text-green-600"
                              onClick={() => window.open(`mailto:${patient.email}`)}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600"
                              onClick={() => window.open(`tel:${patient.phone}`)}
                            >
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
                  Crear primer paciente
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
              Perfil completo del paciente
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
                    <p className="text-sm text-gray-500">
                      {selectedPatient.birth_date && format(new Date(selectedPatient.birth_date), 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contacto</h4>
                      <div className="space-y-2">
                        {selectedPatient.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{selectedPatient.email}</span>
                          </div>
                        )}
                        {selectedPatient.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedPatient.phone}</span>
                          </div>
                        )}
                        {selectedPatient.address && (
                          <div className="flex items-start space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{selectedPatient.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contacto de Emergencia</h4>
                      <div className="space-y-2 text-sm">
                        {selectedPatient.emergency_contact && (
                          <div>
                            <span className="font-medium">Nombre: </span>
                            {selectedPatient.emergency_contact}
                          </div>
                        )}
                        {selectedPatient.emergency_phone && (
                          <div>
                            <span className="font-medium">Teléfono: </span>
                            {selectedPatient.emergency_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <div className="space-y-4">
                  {selectedPatient.insurance && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Obra Social / Seguro</h4>
                      <p className="text-blue-800">{selectedPatient.insurance}</p>
                    </div>
                  )}

                  {selectedPatient.allergies && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-1">Alergias</h4>
                      <p className="text-red-800">{selectedPatient.allergies}</p>
                    </div>
                  )}

                  {selectedPatient.medications && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-1">Medicamentos Actuales</h4>
                      <p className="text-yellow-800">{selectedPatient.medications}</p>
                    </div>
                  )}

                  {selectedPatient.medical_notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Notas Médicas</h4>
                      <p className="text-gray-800">{selectedPatient.medical_notes}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                {(() => {
                  const patientAppointments = getPatientAppointments(selectedPatient.id)
                  
                  return patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Historial de Citas</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {patientAppointments.length} total
                        </Badge>
                      </div>
                      {patientAppointments
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 10)
                        .map(appointment => (
                        <div key={appointment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {new Date(appointment.date).toLocaleDateString('es-ES')} - {appointment.time}
                                </span>
                                <Badge className="text-xs">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.type} - Dr. {appointment.doctor?.name}
                              </p>
                              {appointment.notes && (
                                <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No tiene citas programadas</p>
                    </div>
                  )
                })()}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
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
                {/* Mismo formulario que en creación */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Nombre completo *</Label>
                    <Input 
                      id="edit-name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Juan Pérez" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="juan@email.com" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-phone">Teléfono *</Label>
                    <Input 
                      id="edit-phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      placeholder="+54 11 1234-5678" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-gender">Género</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resto de campos básicos */}
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                {/* Mismos campos médicos que en creación */}
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
