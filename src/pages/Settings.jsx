import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useAuth } from '../contexts/AuthContext'
import { 
  User,
  Building2,
  Bell,
  Clock,
  Shield,
  Settings as SettingsIcon,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Stethoscope,
  CreditCard,
  Database,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Wifi
} from 'lucide-react'
import { toast } from 'sonner'

const Settings = () => {
  const { user, updateProfile } = useAuth()
  
  // Estados para las diferentes configuraciones
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    role: user?.user_metadata?.role || 'admin',
    bio: user?.user_metadata?.bio || ''
  })

  const [clinicData, setClinicData] = useState({
    name: 'Clínica Dental Excellence',
    address: 'Av. Corrientes 1234, CABA',
    phone: '+54 11 1234-5678',
    email: 'info@dentalexcellence.com',
    website: 'www.dentalexcellence.com',
    license: 'RNOS 12345',
    description: 'Clínica dental especializada en tratamientos integrales con tecnología de vanguardia.'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    appointmentCancellations: true,
    newPatients: true,
    systemUpdates: false,
    marketingEmails: false
  })

  const [scheduleSettings, setScheduleSettings] = useState({
    workingHours: {
      monday: { enabled: true, start: '08:00', end: '17:00' },
      tuesday: { enabled: true, start: '08:00', end: '17:00' },
      wednesday: { enabled: true, start: '08:00', end: '17:00' },
      thursday: { enabled: true, start: '08:00', end: '17:00' },
      friday: { enabled: true, start: '08:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '09:00', end: '13:00' }
    },
    appointmentDuration: '30',
    breakTime: '15',
    maxAdvanceBooking: '90',
    cancellationPolicy: '24'
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotifications: true,
    deviceTracking: true
  })

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'ARS',
    language: 'es',
    backupFrequency: 'daily',
    dataRetention: '5'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  const timezones = [
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
    { value: 'America/Argentina/Cordoba', label: 'Córdoba (GMT-3)' },
    { value: 'America/Argentina/Mendoza', label: 'Mendoza (GMT-3)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' }
  ]

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ]

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar perfil')
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    try {
      // Aquí implementarías el cambio de contraseña
      toast.success('Contraseña actualizada correctamente')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Error al cambiar contraseña')
    }
  }

  const updateScheduleDay = (day, field, value) => {
    setScheduleSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleExportData = () => {
    toast.success('Exportando datos del sistema...')
  }

  const handleBackupData = () => {
    toast.success('Creando respaldo de datos...')
  }

  const getUserInitials = () => {
    return profileData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuraciones</h1>
        <p className="text-gray-600">
          Personaliza tu experiencia y administra las configuraciones del sistema
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:block">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="clinic" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:block">Clínica</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:block">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:block">Horarios</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:block">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:block">Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Perfil de Usuario */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del perfil */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Dr. Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="doctor@clinica.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select 
                      value={profileData.role} 
                      onValueChange={(value) => setProfileData({...profileData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="receptionist">Recepcionista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía profesional</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Breve descripción profesional..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleProfileUpdate} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>

            {/* Avatar y acciones rápidas */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Foto
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan Actual</span>
                    <Badge>Profesional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Almacenamiento</span>
                    <span className="text-sm text-gray-600">2.3GB / 10GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cambio de contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Cambiar Contraseña</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repetir nueva contraseña"
                  />
                </div>
              </div>
              <Button onClick={handlePasswordChange} className="mt-4">
                <Key className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración de la Clínica */}
        <TabsContent value="clinic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Información de la Clínica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinicName">Nombre de la Clínica</Label>
                  <Input
                    id="clinicName"
                    value={clinicData.name}
                    onChange={(e) => setClinicData({...clinicData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="clinicLicense">Número de Licencia</Label>
                  <Input
                    id="clinicLicense"
                    value={clinicData.license}
                    onChange={(e) => setClinicData({...clinicData, license: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clinicAddress">Dirección</Label>
                <Input
                  id="clinicAddress"
                  value={clinicData.address}
                  onChange={(e) => setClinicData({...clinicData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clinicPhone">Teléfono</Label>
                  <Input
                    id="clinicPhone"
                    value={clinicData.phone}
                    onChange={(e) => setClinicData({...clinicData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="clinicEmail">Email</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => setClinicData({...clinicData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="clinicWebsite">Sitio Web</Label>
                  <Input
                    id="clinicWebsite"
                    value={clinicData.website}
                    onChange={(e) => setClinicData({...clinicData, website: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clinicDescription">Descripción</Label>
                <Textarea
                  id="clinicDescription"
                  value={clinicData.description}
                  onChange={(e) => setClinicData({...clinicData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Información de la Clínica
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones Generales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Notificaciones por Email', icon: Mail },
                  { key: 'smsNotifications', label: 'Notificaciones por SMS', icon: Smartphone },
                  { key: 'pushNotifications', label: 'Notificaciones Push', icon: Bell },
                  { key: 'systemUpdates', label: 'Actualizaciones del Sistema', icon: Download }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <Switch
                      checked={notificationSettings[item.key]}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, [item.key]: checked})
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Notificaciones de Citas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'appointmentReminders', label: 'Recordatorios de Citas', desc: 'Enviar recordatorios a pacientes' },
                  { key: 'appointmentCancellations', label: 'Cancelaciones', desc: 'Notificar cuando se cancele una cita' },
                  { key: 'newPatients', label: 'Nuevos Pacientes', desc: 'Notificar cuando se registre un paciente' },
                  { key: 'marketingEmails', label: 'Emails de Marketing', desc: 'Promociones y ofertas especiales' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                    <Switch
                      checked={notificationSettings[item.key]}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, [item.key]: checked})
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Horarios */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Horarios de Atención</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {daysOfWeek.map(day => (
                  <div key={day.key} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-20">
                      <Switch
                        checked={scheduleSettings.workingHours[day.key].enabled}
                        onCheckedChange={(checked) => updateScheduleDay(day.key, 'enabled', checked)}
                      />
                      <span className="text-sm font-medium ml-2">{day.label}</span>
                    </div>
                    
                    {scheduleSettings.workingHours[day.key].enabled && (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          type="time"
                          value={scheduleSettings.workingHours[day.key].start}
                          onChange={(e) => updateScheduleDay(day.key, 'start', e.target.value)}
                          className="w-24"
                        />
                        <span className="text-gray-500">a</span>
                        <Input
                          type="time"
                          value={scheduleSettings.workingHours[day.key].end}
                          onChange={(e) => updateScheduleDay(day.key, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuraciones de Citas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appointmentDuration">Duración de Citas (minutos)</Label>
                  <Select 
                    value={scheduleSettings.appointmentDuration}
                    onValueChange={(value) => setScheduleSettings({...scheduleSettings, appointmentDuration: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="breakTime">Tiempo entre Citas (minutos)</Label>
                  <Select 
                    value={scheduleSettings.breakTime}
                    onValueChange={(value) => setScheduleSettings({...scheduleSettings, breakTime: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin pausa</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxAdvanceBooking">Reserva Máxima con Anticipación (días)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={scheduleSettings.maxAdvanceBooking}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, maxAdvanceBooking: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="cancellationPolicy">Política de Cancelación (horas antes)</Label>
                  <Input
                    id="cancellationPolicy"
                    type="number"
                    value={scheduleSettings.cancellationPolicy}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, cancellationPolicy: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Autenticación y Acceso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Autenticación de Dos Factores</div>
                    <div className="text-sm text-gray-600">Capa adicional de seguridad</div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, twoFactorEnabled: checked})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                  <Select 
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, passwordExpiry: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="180">180 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoreo y Alertas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Notificaciones de Inicio de Sesión</div>
                    <div className="text-sm text-gray-600">Alertar sobre nuevos inicios de sesión</div>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, loginNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Seguimiento de Dispositivos</div>
                    <div className="text-sm text-gray-600">Rastrear dispositivos utilizados</div>
                  </div>
                  <Switch
                    checked={securitySettings.deviceTracking}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, deviceTracking: checked})
                    }
                  />
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-800">Última Actividad</div>
                      <div className="text-sm text-yellow-700">
                        Sesión iniciada desde Buenos Aires, Argentina hace 2 horas
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Sistema */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Configuración Regional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select 
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFormat">Formato de Fecha</Label>
                    <Select 
                      value={systemSettings.dateFormat}
                      onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeFormat">Formato de Hora</Label>
                    <Select 
                      value={systemSettings.timeFormat}
                      onValueChange={(value) => setSystemSettings({...systemSettings, timeFormat: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select 
                    value={systemSettings.currency}
                    onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="BRL">Real Brasileño (BRL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Respaldo y Datos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
                  <Select 
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataRetention">Retención de Datos (años)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => setSystemSettings({...systemSettings, dataRetention: e.target.value})}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={handleBackupData} className="w-full" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Crear Respaldo Ahora
                  </Button>
                  
                  <Button onClick={handleExportData} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Datos
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">Último Respaldo</div>
                    <div className="text-blue-700">
                      Ayer a las 23:00 - 2.3 MB
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings