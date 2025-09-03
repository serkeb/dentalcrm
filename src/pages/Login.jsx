import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const Login = () => {
  // --- NUEVO: Estado para alternar entre Login y Registro ---
  const [isLoginView, setIsLoginView] = useState(true)

  // Estados para los campos del formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // --- MODIFICADO: La función ahora maneja ambos casos ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isLoginView) {
      // Lógica de Iniciar Sesión
      try {
        const { error } = await signIn({ email, password })
        if (error) throw error
        toast.success('¡Bienvenido de vuelta!')
        navigate('/dashboard')
      } catch (error) {
        toast.error('Error al iniciar sesión: ' + error.message)
      } finally {
        setLoading(false)
      }
    } else {
      // Lógica de Registro
      try {
        const { error } = await signUp({
          email,
          password,
          options: {
            data: {
              name: name, // Guardamos el nombre en los metadatos del usuario
            },
          },
        })
        if (error) throw error
        toast.success('¡Cuenta creada! Revisa tu email para confirmar.')
        setIsLoginView(true) // Regresamos a la vista de login
      } catch (error) {
        toast.error('Error al registrarse: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* --- MODIFICADO: Título y descripción dinámicos --- */}
          <CardTitle className="text-2xl">{isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
          <CardDescription>
            {isLoginView
              ? 'Ingresa tus credenciales para acceder al dashboard.'
              : 'Completa tus datos para registrarte.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* --- NUEVO: Campo de nombre solo para registro --- */}
              {!isLoginView && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* --- MODIFICADO: Botón dinámico --- */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : (isLoginView ? 'Ingresar' : 'Crear Cuenta')}
              </Button>
            </div>
          </form>
        </CardContent>
        {/* --- NUEVO: Footer para alternar entre vistas --- */}
        <CardFooter className="text-center text-sm">
          <p>
            {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <Button variant="link" onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
