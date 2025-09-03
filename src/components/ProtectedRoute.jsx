import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Muestra un mensaje de carga mientras se verifica la sesión
  if (loading) {
    return <div>Cargando...</div>
  }

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si hay un usuario, muestra el contenido de la ruta protegida (el Layout)
  return <Outlet />
}

export default ProtectedRoute