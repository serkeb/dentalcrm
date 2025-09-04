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
  Activity
} from 'lucide-react'

const Patients = () => {
  // Datos de ejemplo
  const [patients] = useState([
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+54 11 1234-5678',
      birth_date: '1985-06-15',
      gender: 'F',
      address: 'Av. Corrientes 1234, CABA',
      emergency_contact: 'Juan González',
      emergency_phone: '+54 11 9876-5432',
      insurance: 'OSDE',
      medical_notes: 'Paciente con historial de bruxismo',
      allergies: 'Penicilina',
      medications: 'Ibuprofeno 400mg cuando sea necesario',
      files: [
        { id: 1, name: 'Radiografía_2024.jpg', type: 'image', size: '2.3 MB', uploadDate: '2024-01-15' },
        { id: 2, name: 'Historial_médico.pdf', type: 'pdf', size: '1.2 MB', uploadDate: '2024-01-10' },
        { id: 3, name: 'Tratamiento_ortodontico.docx', type: 'document', size: '856 KB', uploadDate: '2024-01-08' }
      ]
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+54 11 2345-6789',
      birth_date: '1975-03-20',
      gender: 'M',
      address: 'San Martín 567, CABA',
      emergency_contact: 'Ana Rodríguez',
      emergency_phone: '+54 11 8765-4321',
      insurance: 'Swiss Medical',
      medical_notes: 'Paciente diabético',
      allergies: 'Ninguna conocida',
      medications: 'Metformina 850mg',
      files: []
    }
  ])

  const [appointments] = useState([
    { 
      id: 1, 
      patient_id: 1, 
      doctor: { name: 'Dr. Pérez' }, 
      date: '2024-01-20', 
      time: '10:00', 
      type: 'Limpieza', 
      status: 'completada', 
      notes: 'Limpieza rutinaria realizada' 
    },
    { 
      id: 2, 
      patient_id: 1, 
      doctor: { name: 'Dr. García' }, 
      date: '2024-02-15', 
      time: '14:30', 
      type: 'Empaste', 
      status: 'programada', 
      notes: 'Empaste molar superior derecho' 
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [ageFilter, setAgeFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  
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

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setSidebarOpen(true)
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
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-96' : ''}`}>
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
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Paciente</DialogTitle>
                    <DialogDescription>Registra un nuevo paciente en el sistema</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="Juan Pérez" 
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
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Paciente</Button>
                  </DialogFooter>
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
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-green-100 hover:text-green-600"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600"
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-yellow-100 hover:text-yellow-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-8 h-8 hover:bg-red-100 hover:text-red-600"
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

      {/* Panel lateral */}
      {sidebarOpen && selectedPatient && (
        <>
          {/* Overlay para móviles */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header del sidebar */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {selectedPatient.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-sm text-gray-600">{calculateAge(selectedPatient.birth_date)} años</p>
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
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">CONTACTO</h3>
                          <div className="space-y-3">
                            {selectedPatient.email && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.email}</p>
                                  <p className="text-xs text-gray-500">Email principal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {selectedPatient.phone && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.phone}</p>
                                  <p className="text-xs text-gray-500">Teléfono principal</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {selectedPatient.address && (
                              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{selectedPatient.address}</p>
                                  <p className="text-xs text-gray-500">Dirección</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">INFORMACIÓN PERSONAL</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Fecha de nacimiento</span>
                              <span className="text-sm font-medium">
                                {formatDate(selectedPatient.birth_date)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Género</span>
                              <span className="text-sm font-medium">
                                {selectedPatient.gender === 'M' ? 'Masculino' : 
                                 selectedPatient.gender === 'F' ? 'Femenino' : 'No especificado'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Obra Social</span>
                              <Badge variant="outline">{selectedPatient.insurance || 'Particular'}</Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">CONTACTO DE EMERGENCIA</h3>
                          <div className="space-y-3">
                            {selectedPatient.emergency_contact && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Nombre</span>
                                <span className="text-sm font-medium">{selectedPatient.emergency_contact}</span>
                              </div>
                            )}
                            {selectedPatient.emergency_phone && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Teléfono</span>
                                <span className="text-sm font-medium">{selectedPatient.emergency_phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Información Médica */}
                    <TabsContent value="medical" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        {/* Información médica básica */}
                        <div className="space-y-4">
                          {selectedPatient.allergies && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-900">Alergias</span>
                              </div>
                              <p className="text-sm text-red-800">{selectedPatient.allergies}</p>
                            </div>
                          )}

                          {selectedPatient.medications && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Heart className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-900">Medicamentos Actuales</span>
                              </div>
                              <p className="text-sm text-yellow-800">{selectedPatient.medications}</p>
                            </div>
                          )}

                          {selectedPatient.medical_notes && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Notas Médicas</span>
                              </div>
                              <p className="text-sm text-blue-800">{selectedPatient.medical_notes}</p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Sección de archivos médicos */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-900">ARCHIVOS MÉDICOS</h3>
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
                                  Arrastra archivos aquí o <span className="text-blue-600 hover:underline">selecciona</span>
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
                                <span className="text-sm text-gray-600">{uploadProgress}%</span>
                              </div>
                              <ProgressBar value={uploadProgress} />
                            </div>
                          )}

                          {/* Lista de archivos */}
                          {selectedPatient.files && selectedPatient.files.length > 0 && (
                            <div className="mt-6 space-y-3">
                              {selectedPatient.files.map((file) => (
                                <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                                      >
                                        <ZoomIn className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => downloadFile(file)}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                                      onClick={() => deleteFile(file.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Citas */}
                    <TabsContent value="appointments" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">HISTORIAL DE CITAS</h3>
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
                          <div className="text-center py-8">
                            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-500">No tiene citas programadas</p>
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
                  <Button size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
