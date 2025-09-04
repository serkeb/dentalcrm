import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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
  Upload,
  X,
  Image,
  File,
  ZoomIn,
  Share2,
  ChevronRight,
  Folder,
  Clock,
  Activity,
  Save,
  UserPlus
} from 'lucide-react'

const Patients = () => {
  // Datos vacíos para empezar limpio
  const [patients, setPatients] = useState([])
  const [appointments] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  
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

  // Funciones CRUD reales que conectarían con Supabase
  const handleCreatePatient = async (e) => {
    e.preventDefault()
    
    try {
      // Aquí se haría la llamada real a createPatient del contexto
      const newPatient = {
        id: Date.now(), // Temporal, Supabase asignaría el ID real
        ...formData,
        birth_date: formData.birth_date.toISOString().split('T')[0],
        files: []
      }
      
      setPatients(prev => [...prev, newPatient])
      setIsCreateOpen(false)
      resetForm()
      alert('Paciente creado exitosamente')
    } catch (error) {
      alert('Error al crear paciente: ' + error.message)
    }
  }

  const handleEditPatient = async (e) => {
    e.preventDefault()
    
    try {
      const updatedPatient = {
        ...selectedPatient,
        ...formData,
        birth_date: formData.birth_date.toISOString().split('T')[0]
      }
      
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p))
      setSelectedPatient(updatedPatient)
      setIsEditOpen(false)
      resetForm()
      alert('Paciente actualizado exitosamente')
    } catch (error) {
      alert('Error al actualizar paciente: ' + error.message)
    }
  }

  const handleDeletePatient = async (patientId) => {
    if (confirm('¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
      try {
        setPatients(prev => prev.filter(p => p.id !== patientId))
        if (selectedPatient?.id === patientId) {
          closeSidebar()
        }
        alert('Paciente eliminado exitosamente')
      } catch (error) {
        alert('Error al eliminar paciente: ' + error.message)
      }
    }
  }

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setSidebarOpen(true)
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

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedPatient(null)
    setImagePreview(null)
  }

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patient_id === patientId)
  }

  // Funciones para manejo de archivos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    simulateUpload()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    simulateUpload()
  }

  const simulateUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          alert('Archivos subidos exitosamente!')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-blue-500" />
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />
      case 'document': return <FileText className="w-5 h-5 text-blue-600" />
      default: return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const openImagePreview = (file) => {
    if (file.type === 'image') {
      setImagePreview(file)
    }
  }

  const downloadFile = (file) => {
    alert(`Descargando ${file.name}...`)
  }

  const deleteFile = (fileId) => {
    if (confirm('¿Estás seguro de eliminar este archivo?')) {
      alert('Archivo eliminado')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  // Componente de barra de progreso simple
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-[480px]' : ''}`}>
        <div className="p-6 space-y-6">
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
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Crear Nuevo Paciente</span>
                    </DialogTitle>
                    <DialogDescription>Registra un nuevo paciente con toda su información</DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Información Básica</TabsTrigger>
                      <TabsTrigger value="medical">Información Médica</TabsTrigger>
                    </TabsList>
                    
                    <form onSubmit={handleCreatePatient} className="space-y-4">
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
                                {formData.birth_date ? formatShortDate(formData.birth_date.toISOString()) : 'Seleccionar fecha'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar 
                                mode="single" 
                                selected={formData.birth_date} 
                                onSelect={(date) => setFormData({...formData, birth_date: date || new Date()})} 
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
                        <Button type="button" variant="outline" onClick={() => {setIsCreateOpen(false); resetForm()}}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Crear Paciente
                        </Button>
                      </DialogFooter>
                    </form>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Estadística simple */}
          <div className="w-fit">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                    <p className="text-sm text-gray-600">Total Pacientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
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
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Archivos</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => {
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
                                  {formatShortDate(patient.birth_date)}
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
                              <div className="flex items-center space-x-2">
                                <Folder className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {patient.files?.length || 0} archivos
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600"
                                  onClick={() => handleView(patient)}
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-green-100 hover:text-green-600"
                                  onClick={() => window.open(`mailto:${patient.email}`)}
                                  title="Enviar email"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600"
                                  onClick={() => window.open(`tel:${patient.phone}`)}
                                  title="Llamar"
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-yellow-100 hover:text-yellow-600"
                                  onClick={() => handleEdit(patient)}
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-red-100 hover:text-red-600"
                                  onClick={() => handleDeletePatient(patient.id)}
                                  title="Eliminar"
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
        </div>
      </div>

      {/* Panel lateral más amplio */}
      {sidebarOpen && selectedPatient && (
        <>
          {/* Overlay para móviles */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
          
          {/* Sidebar más amplio */}
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header del sidebar */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                      {selectedPatient.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-sm text-gray-600">{calculateAge(selectedPatient.birth_date)} años • {selectedPatient.gender === 'M' ? 'Masculino' : selectedPatient.gender === 'F' ? 'Femenino' : ''}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{selectedPatient.insurance || 'Particular'}</Badge>
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Activo"></div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeSidebar}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Contenido del sidebar */}
              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="info" className="h-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Información</TabsTrigger>
                      <TabsTrigger value="medical">Médica</TabsTrigger>
                      <TabsTrigger value="appointments">Citas</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    {/* Tab: Información */}
                    <TabsContent value="info" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            INFORMACIÓN DE CONTACTO
                          </h3>
                          <div className="space-y-3">
                            {selectedPatient.email && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.email}</p>
                                  <p className="text-xs text-gray-500">Email principal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`mailto:${selectedPatient.email}`)}>
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {selectedPatient.phone && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.phone}</p>
                                  <p className="text-xs text-gray-500">Teléfono principal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`tel:${selectedPatient.phone}`)}>
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {selectedPatient.address && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.address}</p>
                                  <p className="text-xs text-gray-500">Dirección principal</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            INFORMACIÓN PERSONAL
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium">FECHA NACIMIENTO</p>
                              <p className="text-sm font-semibold text-blue-900">
                                {formatDate(selectedPatient.birth_date)}
                              </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-xs text-purple-600 font-medium">EDAD</p>
                              <p className="text-sm font-semibold text-purple-900">
                                {calculateAge(selectedPatient.birth_date)} años
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            CONTACTO DE EMERGENCIA
                          </h3>
                          {selectedPatient.emergency_contact || selectedPatient.emergency_phone ? (
                            <div className="space-y-3">
                              {selectedPatient.emergency_contact && (
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-orange-600 font-medium">NOMBRE</p>
                                    <p className="text-sm font-semibold text-orange-900">{selectedPatient.emergency_contact}</p>
                                  </div>
                                </div>
                              )}
                              {selectedPatient.emergency_phone && (
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-orange-600 font-medium">TELÉFONO</p>
                                    <p className="text-sm font-semibold text-orange-900">{selectedPatient.emergency_phone}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`tel:${selectedPatient.emergency_phone}`)}>
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                              <p className="text-sm text-gray-500">No hay contacto de emergencia registrado</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Información Médica */}
                    <TabsContent value="medical" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        {/* Información médica básica */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                            <Heart className="w-4 h-4 mr-2" />
                            INFORMACIÓN MÉDICA
                          </h3>
                          
                          {selectedPatient.allergies && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-bold text-red-900">ALERGIAS</span>
                              </div>
                              <p className="text-sm text-red-800 leading-relaxed">{selectedPatient.allergies}</p>
                            </div>
                          )}

                          {selectedPatient.medications && (
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Heart className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm font-bold text-yellow-900">MEDICAMENTOS</span>
                              </div>
                              <p className="text-sm text-yellow-800 leading-relaxed">{selectedPatient.medications}</p>
                            </div>
                          )}

                          {selectedPatient.medical_notes && (
                            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold text-blue-900">NOTAS MÉDICAS</span>
                              </div>
                              <p className="text-sm text-blue-800 leading-relaxed">{selectedPatient.medical_notes}</p>
                            </div>
                          )}

                          {!selectedPatient.allergies && !selectedPatient.medications && !selectedPatient.medical_notes && (
                            <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
                              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No hay información médica registrada</p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Sección de archivos médicos */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-900 flex items-center">
                              <Folder className="w-4 h-4 mr-2" />
                              ARCHIVOS MÉDICOS
                            </h3>
                            <Badge variant="outline">{selectedPatient.files?.length || 0} archivos</Badge>
                          </div>

                          {/* Área de subida de archivos */}
                          <div 
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <div className="space-y-2">
                                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  Arrastra archivos aquí o <span className="text-blue-600 hover:underline font-medium">selecciona</span>
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC hasta 10MB</p>
                              </div>
                            </label>
                          </div>

                          {/* Barra de progreso */}
                          {uploading && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Subiendo archivos...</span>
                                <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                              </div>
                              <ProgressBar value={uploadProgress} />
                            </div>
                          )}

                          {/* Lista de archivos */}
                          {selectedPatient.files && selectedPatient.files.length > 0 ? (
                            <div className="mt-6 space-y-3">
                              {selectedPatient.files.map((file) => (
                                <div key={file.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex-shrink-0">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <span>{file.size}</span>
                                      <span>•</span>
                                      <span>{formatShortDate(file.uploadDate)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {file.type === 'image' && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => openImagePreview(file)}
                                        title="Vista previa"
                                      >
                                        <ZoomIn className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => downloadFile(file)}
                                      title="Descargar"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                                      onClick={() => deleteFile(file.id)}
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                              <Folder className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No hay archivos subidos</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Citas */}
                    <TabsContent value="appointments" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          HISTORIAL DE CITAS
                        </h3>
                        <Badge variant="outline">
                          {getPatientAppointments(selectedPatient.id).length} citas
                        </Badge>
                      </div>

                      {(() => {
                        const patientAppointments = getPatientAppointments(selectedPatient.id)
                        
                        return patientAppointments.length > 0 ? (
                          <div className="space-y-3">
                            {patientAppointments
                              .sort((a, b) => new Date(b.date) - new Date(a.date))
                              .map(appointment => (
                              <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm font-medium">
                                        {formatDate(appointment.date)}
                                      </span>
                                      <Badge 
                                        variant="outline"
                                        className={
                                          appointment.status === 'completada' ? 'border-green-200 text-green-800' :
                                          appointment.status === 'programada' ? 'border-blue-200 text-blue-800' :
                                          'border-red-200 text-red-800'
                                        }
                                      >
                                        {appointment.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{appointment.time}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Activity className="w-3 h-3" />
                                        <span>{appointment.type}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">{appointment.doctor.name}</span>
                                    </p>
                                    {appointment.notes && (
                                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                        <strong>Notas:</strong> {appointment.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h4>
                            <p className="text-sm text-gray-500 mb-4">Este paciente aún no tiene citas programadas</p>
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Programar Cita
                            </Button>
                          </div>
                        )
                      })()}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Footer del sidebar */}
              <div className="border-t p-4 bg-gray-50">
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleEdit(selectedPatient)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDeletePatient(selectedPatient.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de edición */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Editar Paciente</span>
            </DialogTitle>
            <DialogDescription>Modifica la información del paciente</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="medical">Información Médica</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleEditPatient} className="space-y-4">
              <TabsContent value="basic" className="space-y-4">
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
                
                <div>
                  <Label>Fecha de Nacimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birth_date ? formatShortDate(formData.birth_date.toISOString()) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={formData.birth_date} 
                        onSelect={(date) => setFormData({...formData, birth_date: date || new Date()})} 
                        disabled={(date) => date > new Date()} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="edit-address">Dirección</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Av. Corrientes 1234, CABA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-emergency_contact">Contacto de Emergencia</Label>
                    <Input
                      id="edit-emergency_contact"
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                      placeholder="María Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-emergency_phone">Teléfono de Emergencia</Label>
                    <Input
                      id="edit-emergency_phone"
                      value={formData.emergency_phone}
                      onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                      placeholder="+54 11 9876-5432"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <div>
                  <Label htmlFor="edit-insurance">Obra Social / Seguro</Label>
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
                  <Label htmlFor="edit-allergies">Alergias</Label>
                  <Textarea
                    id="edit-allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    placeholder="Penicilina, frutos secos..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-medications">Medicamentos Actuales</Label>
                  <Textarea
                    id="edit-medications"
                    value={formData.medications}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    placeholder="Aspirina 100mg, Omeprazol..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-medical_notes">Notas Médicas</Label>
                  <Textarea
                    id="edit-medical_notes"
                    value={formData.medical_notes}
                    onChange={(e) => setFormData({...formData, medical_notes: e.target.value})}
                    placeholder="Historial médico relevante..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => {setIsEditOpen(false); resetForm()}}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Actualizar Paciente
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de vista previa de imagen */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20 z-10"
              onClick={() => setImagePreview(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="bg-white p-2 rounded-lg">
              <div className="w-96 h-64 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Vista previa: {imagePreview.name}</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
              {imagePreview.name}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
