import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import { 
  Calendar, 
  Users, 
  Search,
  Bell,
  Settings,
  Stethoscope,
  UserCheck,
  BarChart3,
  LogOut,
  User,
  Home,
  Menu // Ícono para menú móvil
} from 'lucide-react'

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { user, signOut } = useAuth()
  const { stats, loading } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, badge: null },
    { name: 'Citas', path: '/appointments', icon: Calendar, badge: stats.todayAppointments > 0 ? stats.todayAppointments : null },
    { name: 'Pacientes', path: '/patients', icon: Users, badge: null },
    { name: 'Doctores', path: '/doctors', icon: UserCheck, badge: null },
    { name: 'Calendario', path: '/calendar', icon: Calendar },
    { name: 'Reportes', path: '/reports', icon: BarChart3, badge: null },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const isActivePath = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar / Navegación Lateral para Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-4 flex items-center space-x-2 border-b">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DentalCRM</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActivePath(item.path)
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.badge && (
                <Badge className="ml-auto bg-red-100 text-red-800 text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t">
           <button
              onClick={() => navigate('/settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActivePath('/settings')
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header / Barra Superior */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Botón de menú para móvil y búsqueda */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </Button>
              <div className="relative hidden sm:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input 
                  type="text" 
                  placeholder="Buscar..."
                  className="pl-10 w-80"
                />
              </div>
            </div>
            
            {/* Iconos de la derecha y menú de usuario */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {stats.todayAppointments > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.name || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActivePath(item.path) ? 'text-white bg-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
                 <button
                    onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActivePath('/settings') ? 'text-white bg-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    >
                    <Settings className="w-5 h-5" />
                    <span>Configuración</span>
                </button>
            </nav>
          </div>
        )}

        {/* Contenido Principal de la Página */}
        <main className="flex-1 p-6 lg:p-8">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando datos...</span>
            </div>
          )}
          {!loading && <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default Layout
