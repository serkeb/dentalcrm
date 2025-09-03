import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, Calendar, Users, Stethoscope, BarChart3, Settings, LogOut, Search, Bell, Menu, X, Package
} from 'lucide-react';

// Componente reutilizable para cada enlace del menú de navegación
const NavLink = ({ to, icon: Icon, children, badge }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{children}</span>
      {badge ? (
        <Badge className="ml-auto bg-blue-100 text-blue-800">{badge}</Badge>
      ) : null}
    </Link>
  );
};

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { stats, loading } = useApp();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const menuItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/appointments', icon: Calendar, label: 'Citas', badge: stats.todayAppointments > 0 ? stats.todayAppointments : null },
    { to: '/patients', icon: Users, label: 'Pacientes' },
    { to: '/doctors', icon: Stethoscope, label: 'Doctores' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
  ];

  // Contenido de la barra lateral, para no repetirlo en móvil y escritorio
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 flex items-center space-x-2 border-b">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">DentalCRM</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map(item => <NavLink key={item.to} {...item}>{item.label}</NavLink>)}
      </nav>
      <div className="px-4 py-4 border-t">
        <NavLink to="/settings" icon={Settings}>Configuración</NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- BARRA LATERAL PARA ESCRITORIO --- */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r fixed h-full">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        {/* --- BARRA SUPERIOR (NAVBAR) --- */}
        <header className="bg-white border-b sticky top-0 z-10 px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="relative hidden sm:block ml-4">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Buscar..." className="pl-10 w-64 lg:w-96" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {stats.todayAppointments > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-600 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className='hidden sm:flex flex-col text-left'>
                      <span className='text-sm font-medium'>{user?.user_metadata?.name || 'Usuario'}</span>
                      <span className='text-xs text-gray-500'>Admin</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}><User className="mr-2 h-4 w-4" /><span>Perfil</span></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /><span>Cerrar sesión</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* --- MENÚ DESPLEGABLE PARA MÓVIL --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30">
             <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
             <div className="relative w-64 bg-white h-full border-r">
                <SidebarContent />
             </div>
          </div>
        )}

        {/* --- CONTENIDO PRINCIPAL DE CADA PÁGINA --- */}
        <main className="flex-1 p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout
