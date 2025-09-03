import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout' // <-- Asegúrate de que esto se importa
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas que usarán el Layout con el Navbar */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            
            {/* Ruta por defecto para cualquier otra cosa */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster position="top-right" richColors />
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
