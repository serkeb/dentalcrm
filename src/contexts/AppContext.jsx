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
  // Aquí se importa createPatient desde el contexto, ¡esto está bien!
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

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
        default:
          break;
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

  // === LA CORRECCIÓN ESTÁ AQUÍ ===
  // Renombramos la función para que no choque con la del contexto
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Usamos la función 'createPatient' que viene del contexto
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
                
                {/* === Y LA CORRECCIÓN EN EL FORMULARIO === */}
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <TabsContent value="basic" className="space-y-4">
                    {/* ... (el resto del formulario se queda igual) ... */}
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
      {/* ... (el resto del JSX se queda igual) ... */}
    </div>
  )
}

export default Patients
