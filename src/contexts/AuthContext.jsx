import React, { createContext, useState, useEffect, useContext } from 'react'
import supabase from '../lib/supabase' // Importamos el cliente por defecto

// 1. Creamos el contexto
const AuthContext = createContext()

// 2. Creamos el componente Proveedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificamos si hay una sesión activa al cargar
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    
    getSession()

    // Escuchamos los cambios en la autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Limpiamos la suscripción al desmontar el componente
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Las funciones que estarán disponibles en toda la app
  const value = {
    user,
    loading,
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    signUp: (data) => supabase.auth.signUp(data),
    updateProfile: (data) => supabase.auth.updateUser({ data })
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. Hook para usar el contexto de forma sencilla (ESTA ES LA PARTE CLAVE)
export const useAuth = () => {
  return useContext(AuthContext)
}