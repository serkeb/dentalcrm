import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'; // <-- 1. Importa la nueva página
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* --- 2. RUTAS PÚBLICAS (Visibles para todos) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            
            {/* --- 3. RUTAS PROTEGIDAS (Solo para usuarios logueados) --- */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* La ruta principal para usuarios logueados será el dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            
            {/* Si un usuario escribe cualquier otra URL, lo redirige a la página de inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster position="top-right" richColors />
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
