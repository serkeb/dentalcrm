import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { useApp } from '../contexts/AppContext'
import { format, startOfMonth, endOfMonth, subMonths, 
         parseISO, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  Clock,
  Download,
  FileText,
  Filter,
  Eye,
  Stethoscope,
  UserCheck,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

const Reports = () => {
  const { appointments, patients, doctors } = useApp()
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  })
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedDoctor, setSelectedDoctor] = useState('all')

  // Filtrar datos por rango de fechas
  const filteredData = useMemo(() => {
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.date)
      return isWithinInterval(aptDate, { start: dateRange.from, end: dateRange.to })
    })

    return {
      appointments: filteredAppointments,
      patients: patients,
      doctors: doctors
    }
  }, [appointments, patients, doctors, dateRange])

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const total = filteredData.appointments.length
    const completed = filteredData.appointments.filter(apt => apt.status === 'completada').length
    const cancelled = filteredData.appointments.filter(apt => apt.status === 'cancelada').length
    const scheduled = filteredData.appointments.filter(apt => apt.status === 'programada').length
    
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0
    const cancellationRate = total > 0 ? (cancelled / total * 100).toFixed(1) : 0
    
    // Ingresos estimados (asumiendo un precio promedio por cita completada)
    const averagePrice = 25000 // Precio promedio por consulta
    const estimatedRevenue = completed * averagePrice
    
    return {
      totalAppointments: total,
      completedAppointments: completed,
      cancelledAppointments: cancelled,
      scheduledAppointments: scheduled,
      completionRate: parseFloat(completionRate),
      cancellationRate: parseFloat(cancellationRate),
      estimatedRevenue,
      averagePrice
    }
  }, [filteredData])

  // Estadísticas por doctor
  const doctorStats = useMemo(() => {
    return doctors.map(doctor => {
      const doctorAppointments = filteredData.appointments.filter(apt => apt.doctor_id === doctor.id)
      const completed = doctorAppointments.filter(apt => apt.status === 'completada').length
      const total = doctorAppointments.length
      const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0
      
      return {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        totalAppointments: total,
        completedAppointments: completed,
        completionRate: parseFloat(completionRate),
        estimatedRevenue: completed * generalStats.averagePrice
      }
    }).sort((a, b) => b.totalAppointments - a.totalAppointments)
  }, [doctors, filteredData, generalStats.averagePrice])

  // Estadísticas por tipo de cita
  const appointmentTypeStats = useMemo(() => {
    const typeCount = {}
    filteredData.appointments.forEach(apt => {
      const type = apt.type || 'Sin especificar'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    return Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        percentage: ((count / filteredData.appointments.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredData])

  // Estadísticas por día de la semana
  const dayOfWeekStats = useMemo(() => {
    const dayCount = {
      'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 
      'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0
    }

    filteredData.appointments.forEach(apt => {
      const dayName = format(parseISO(apt.date), 'EEEE', { locale: es })
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
      if (dayCount[capitalizedDay] !== undefined) {
        dayCount[capitalizedDay]++
      }
    })

    return Object.entries(dayCount).map(([day, count]) => ({
      day,
      count,
      percentage: filteredData.appointments.length > 0 
        ? ((count / filteredData.appointments.length) * 100).toFixed(1) 
        : 0
    }))
  }, [filteredData])

  // Tendencias mensuales (últimos 6 meses)
  const monthlyTrends = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i)
      months.push({
        month: format(month, 'MMM yyyy', { locale: es }),
        start: startOfMonth(month),
        end: endOfMonth(month)
      })
    }

    return months.map(({ month, start, end }) => {
      const monthAppointments = appointments.filter(apt => {
        const aptDate = parseISO(apt.date)
        return isWithinInterval(aptDate, { start, end })
      })

      const completed = monthAppointments.filter(apt => apt.status === 'completada').length
      const total = monthAppointments.length

      return {
        month,
        total,
        completed,
        cancelled: monthAppointments.filter(apt => apt.status === 'cancelada').length,
        revenue: completed * generalStats.averagePrice
      }
    })
  }, [appointments, generalStats.averagePrice])

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    const now = new Date()
    
    switch (period) {
      case 'week':
        setDateRange({
          from: new Date(now.setDate(now.getDate() - 7)),
          to: new Date()
        })
        break
      case 'month':
        setDateRange({
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date())
        })
        break
      case 'quarter':
        setDateRange({
          from: subMonths(new Date(), 3),
          to: new Date()
        })
        break
      case 'year':
        setDateRange({
          from: new Date(new Date().getFullYear(), 0, 1),
          to: new Date()
        })
        break
    }
  }

  const exportReport = (type) => {
    // Simulación de exportación
    toast.success(`Exportando reporte en formato ${type.toUpperCase()}...`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600">
            Análisis detallado del rendimiento de tu clínica dental
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-40">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Período seleccionado */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Período:</span>
              <Badge variant="outline">
                {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
              </Badge>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Personalizar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="doctors">Doctores</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen General */}
        <TabsContent value="overview" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {generalStats.totalAppointments}
                    </p>
                    <p className="text-sm text-gray-600">Total de Citas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {generalStats.completedAppointments}
                    </p>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-xs text-green-600">
                      {generalStats.completionRate}% éxito
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredData.patients.length}
                    </p>
                    <p className="text-sm text-gray-600">Pacientes Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(generalStats.estimatedRevenue)}
                    </p>
                    <p className="text-sm text-gray-600">Ingresos Estimados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos de resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado de citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Estado de Citas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Completadas</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{generalStats.completedAppointments}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({generalStats.completionRate}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">Programadas</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{generalStats.scheduledAppointments}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({((generalStats.scheduledAppointments / generalStats.totalAppointments) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Canceladas</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{generalStats.cancelledAppointments}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({generalStats.cancellationRate}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top tipos de citas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Tipos de Tratamientos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointmentTypeStats.slice(0, 5).map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{type.count}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({type.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Días más activos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Distribución por Día de la Semana</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {dayOfWeekStats.map(day => (
                  <div key={day.day} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {day.day.slice(0, 3)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {day.count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Análisis de Citas */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen de citas */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Total', value: generalStats.totalAppointments, color: 'bg-blue-500' },
                    { label: 'Completadas', value: generalStats.completedAppointments, color: 'bg-green-500' },
                    { label: 'Programadas', value: generalStats.scheduledAppointments, color: 'bg-yellow-500' },
                    { label: 'Canceladas', value: generalStats.cancelledAppointments, color: 'bg-red-500' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${item.color} rounded-full`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-xl font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasa de finalización */}
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tasa de Finalización</span>
                      <span className="text-sm font-bold text-green-600">
                        {generalStats.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${generalStats.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tasa de Cancelación</span>
                      <span className="text-sm font-bold text-red-600">
                        {generalStats.cancellationRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${generalStats.cancellationRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {generalStats.completionRate >= 80 ? '🎉' : generalStats.completionRate >= 60 ? '👍' : '⚠️'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {generalStats.completionRate >= 80 ? 'Excelente' : 
                           generalStats.completionRate >= 60 ? 'Bueno' : 'Mejorable'}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {Math.round(generalStats.totalAppointments / 30)}
                        </div>
                        <div className="text-xs text-gray-600">Citas/día promedio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista detallada de tipos de citas */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle por Tipo de Tratamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Tipo de Tratamiento</th>
                      <th className="text-center py-2 font-medium">Cantidad</th>
                      <th className="text-center py-2 font-medium">Porcentaje</th>
                      <th className="text-right py-2 font-medium">Ingresos Est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentTypeStats.map(type => (
                      <tr key={type.type} className="border-b hover:bg-gray-50">
                        <td className="py-3">{type.type}</td>
                        <td className="text-center py-3 font-medium">{type.count}</td>
                        <td className="text-center py-3">
                          <Badge variant="outline">{type.percentage}%</Badge>
                        </td>
                        <td className="text-right py-3 font-medium">
                          {formatCurrency(type.count * generalStats.averagePrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Análisis de Doctores */}
        <TabsContent value="doctors" className="space-y-6">
          {/* Ranking de doctores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5" />
                <span>Ranking de Doctores por Rendimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorStats.map((doctor, index) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{doctor.name}</div>
                        <div className="text-sm text-gray-600">{doctor.specialty}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{doctor.totalAppointments}</div>
                        <div className="text-xs text-gray-500">Citas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{doctor.completionRate}%</div>
                        <div className="text-xs text-gray-500">Finalización</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{formatCurrency(doctor.estimatedRevenue)}</div>
                        <div className="text-xs text-gray-500">Ingresos Est.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas por especialidad */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Especialidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const specialtyCount = {}
                  doctors.forEach(doctor => {
                    const specialty = doctor.specialty || 'Sin especialidad'
                    specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1
                  })

                  return Object.entries(specialtyCount).map(([specialty, count]) => (
                    <div key={specialty} className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{count}</div>
                      <div className="text-sm font-medium text-gray-700">{specialty}</div>
                    </div>
                  ))
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Análisis Financiero */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resumen financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Resumen Financiero</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Ingresos Brutos</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(generalStats.estimatedRevenue)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Ingreso Promedio por Cita</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(generalStats.averagePrice)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Citas Facturadas</div>
                    <div className="text-xl font-bold text-gray-900">
                      {generalStats.completedAppointments}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proyecciones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Proyecciones Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Proyección Optimista</div>
                      <div className="text-xl font-bold text-green-800">
                        {formatCurrency(generalStats.estimatedRevenue * 1.2)}
                      </div>
                      <div className="text-xs text-green-600">+20% vs actual</div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Proyección Conservadora</div>
                      <div className="text-xl font-bold text-blue-800">
                        {formatCurrency(generalStats.estimatedRevenue * 0.9)}
                      </div>
                      <div className="text-xs text-blue-600">-10% vs actual</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Recomendaciones:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Reducir tasa de cancelación para aumentar ingresos</li>
                      <li>• Implementar recordatorios automáticos</li>
                      <li>• Optimizar horarios de doctores estrella</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingresos por doctor */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Doctor</th>
                      <th className="text-center py-2 font-medium">Citas Completadas</th>
                      <th className="text-center py-2 font-medium">Tasa Finalización</th>
                      <th className="text-right py-2 font-medium">Ingresos Generados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorStats.map(doctor => (
                      <tr key={doctor.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-gray-600">{doctor.specialty}</div>
                          </div>
                        </td>
                        <td className="text-center py-3 font-medium">
                          {doctor.completedAppointments}
                        </td>
                        <td className="text-center py-3">
                          <Badge 
                            variant="outline"
                            className={doctor.completionRate >= 80 ? 'text-green-700' : 
                                      doctor.completionRate >= 60 ? 'text-yellow-700' : 'text-red-700'}
                          >
                            {doctor.completionRate}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 font-bold text-green-600">
                          {formatCurrency(doctor.estimatedRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Tendencias */}
        <TabsContent value="trends" className="space-y-6">
          {/* Tendencias mensuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Tendencias de los Últimos 6 Meses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Mes</th>
                      <th className="text-center py-2 font-medium">Total Citas</th>
                      <th className="text-center py-2 font-medium">Completadas</th>
                      <th className="text-center py-2 font-medium">Canceladas</th>
                      <th className="text-right py-2 font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTrends.map((month, index) => {
                      const prevMonth = monthlyTrends[index - 1]
                      const growthRate = prevMonth ? 
                        ((month.total - prevMonth.total) / prevMonth.total * 100).toFixed(1) : 0
                      
                      return (
                        <tr key={month.month} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">{month.month}</td>
                          <td className="text-center py-3">
                            <div className="flex items-center justify-center space-x-2">
                              <span>{month.total}</span>
                              {growthRate > 0 && (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              )}
                              {growthRate < 0 && (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="text-center py-3">{month.completed}</td>
                          <td className="text-center py-3">{month.cancelled}</td>
                          <td className="text-right py-3 font-medium">
                            {formatCurrency(month.revenue)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Insights y recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Insights y Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      💡
                    </div>
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Optimización de Horarios</div>
                      <div className="text-sm text-blue-800">
                        Los {dayOfWeekStats.reduce((max, day) => day.count > max.count ? day : max).day.toLowerCase()} 
                        son tus días más activos. Considera aumentar la disponibilidad estos días.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ⭐
                    </div>
                    <div>
                      <div className="font-medium text-green-900 mb-1">Doctor Destacado</div>
                      <div className="text-sm text-green-800">
                        {doctorStats[0]?.name} tiene la mejor tasa de finalización 
                        ({doctorStats[0]?.completionRate}%). Considera implementar sus prácticas.
                      </div>
                    </div>
                  </div>
                </div>

                {generalStats.cancellationRate > 15 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        ⚠️
                      </div>
                      <div>
                        <div className="font-medium text-yellow-900 mb-1">Alta Tasa de Cancelación</div>
                        <div className="text-sm text-yellow-800">
                          Tu tasa de cancelación es del {generalStats.cancellationRate}%. 
                          Implementa recordatorios automáticos para reducirla.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports