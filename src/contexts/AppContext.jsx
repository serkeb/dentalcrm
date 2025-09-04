import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { db } from '../lib/supabase'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'

const AppContext = createContext({})

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider')
  }
  return context
}

// Reducer para manejar el estado de la aplicación
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload }
    
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] }
    
    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        )
      }
    
    case 'DELETE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.filter(doc => doc.id !== action.payload)
      }
    
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload }
    
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] }
    
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(patient => 
          patient.id === action.payload.id ? action.payload : patient
        )
      }
    
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(patient => patient.id !== action.payload)
      }
    
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload }
    
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] }
    
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt => 
          apt.id === action.payload.id ? action.payload : apt
        )
      }
    
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload)
      }
    
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    
    default:
      return state
  }
}

const initialState = {
  loading: true, // Inicia en true para mostrar carga al principio
  doctors: [],
  patients: [],
  appointments: [],
  stats: {
    totalAppointments: 0,
    totalPatients: 0,
    todayAppointments: 0,
    appointmentChange: 0
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user } = useAuth()

  // ⭐ CORRECCIÓN: Cargar datos iniciales solo cuando el usuario se autentica
  useEffect(() => {
    if (user) {
      loadAllData()
    } else {
      // Si no hay usuario, resetea el estado pero mantiene loading en false
      dispatch({ type: 'SET_DOCTORS', payload: [] })
      dispatch({ type: 'SET_PATIENTS', payload: [] })
      dispatch({ type: 'SET_APPOINTMENTS', payload: [] })
      dispatch({ type: 'SET_STATS', payload: {
        totalAppointments: 0,
        totalPatients: 0,
        todayAppointments: 0,
        appointmentChange: 0
      } })
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [user])

  // ⭐ CORRECCIÓN: Función para cargar todos los datos con mejor manejo de errores
  const loadAllData = async () => {
    if (!user) return; // ⭐ Agregar esta verificación
    
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Cargar datos de forma secuencial para evitar problemas de concurrencia
      const doctors = await db.getDoctors()
      dispatch({ type: 'SET_DOCTORS', payload: doctors })
      
      const patients = await db.getPatients()
      dispatch({ type: 'SET_PATIENTS', payload: patients })
      
      const appointments = await db.getAppointments()
      dispatch({ type: 'SET_APPOINTMENTS', payload: appointments })
      
      const stats = await db.getStats()
      dispatch({ type: 'SET_STATS', payload: stats })
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar datos: ' + error.message)
      // ⭐ En caso de error, establecer datos vacíos para evitar el loading infinito
      dispatch({ type: 'SET_DOCTORS', payload: [] })
      dispatch({ type: 'SET_PATIENTS', payload: [] })
      dispatch({ type: 'SET_APPOINTMENTS', payload: [] })
      dispatch({ type: 'SET_STATS', payload: {
        totalAppointments: 0,
        totalPatients: 0,
        todayAppointments: 0,
        appointmentChange: 0
      } })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // --- FUNCIONES CRUD ---
  
  const createDoctor = async (doctorData) => {
    if (!user) throw new Error("Debes iniciar sesión para crear un doctor");
    try {
      const doctor = await db.createDoctor({ ...doctorData, user_id: user.id });
      dispatch({ type: 'ADD_DOCTOR', payload: doctor });
      toast.success('Doctor creado correctamente');
      return doctor;
    } catch (error) {
      toast.error('Error al crear doctor: ' + error.message);
      throw error;
    }
  }

  const updateDoctor = async (id, updates) => {
    try {
      const doctor = await db.updateDoctor(id, updates)
      dispatch({ type: 'UPDATE_DOCTOR', payload: doctor })
      toast.success('Doctor actualizado correctamente')
      return doctor
    } catch (error) {
      toast.error('Error al actualizar doctor: ' + error.message)
      throw error
    }
  }

  const deleteDoctor = async (id) => {
    try {
      await db.deleteDoctor(id)
      dispatch({ type: 'DELETE_DOCTOR', payload: id })
      toast.success('Doctor eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar doctor: ' + error.message)
      throw error
    }
  }

  const createPatient = async (patientData) => {
    if (!user) throw new Error("Debes iniciar sesión para crear un paciente");
    try {
      const patient = await db.createPatient({ ...patientData, user_id: user.id });
      dispatch({ type: 'ADD_PATIENT', payload: patient });
      toast.success('Paciente creado correctamente');
      return patient;
    } catch (error) {
      toast.error('Error al crear paciente: ' + error.message);
      throw error;
    }
  }

  const updatePatient = async (id, updates) => {
    try {
      const patient = await db.updatePatient(id, updates)
      dispatch({ type: 'UPDATE_PATIENT', payload: patient })
      toast.success('Paciente actualizado correctamente')
      return patient
    } catch (error) {
      toast.error('Error al actualizar paciente: ' + error.message)
      throw error
    }
  }

  const deletePatient = async (id) => {
    try {
      await db.deletePatient(id)
      dispatch({ type: 'DELETE_PATIENT', payload: id })
      toast.success('Paciente eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar paciente: ' + error.message)
      throw error
    }
  }
  
  const createAppointment = async (appointmentData) => {
    if (!user) throw new Error("Debes iniciar sesión para crear una cita");
    try {
      const appointment = await db.createAppointment({ ...appointmentData, user_id: user.id });
      dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
      toast.success('Cita creada correctamente');
      await refreshStats();
      return appointment;
    } catch (error) {
      toast.error('Error al crear cita: ' + error.message);
      throw error;
    }
  }

  const updateAppointment = async (id, updates) => {
    try {
      const appointment = await db.updateAppointment(id, updates)
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment })
      toast.success('Cita actualizada correctamente')
      return appointment
    } catch (error) {
      toast.error('Error al actualizar cita: ' + error.message)
      throw error
    }
  }

  const deleteAppointment = async (id) => {
    try {
      await db.deleteAppointment(id)
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id })
      toast.success('Cita eliminada correctamente')
      await refreshStats();
    } catch (error) {
      toast.error('Error al eliminar cita: ' + error.message)
      throw error
    }
  }

  const refreshStats = async () => {
    try {
      const stats = await db.getStats()
      dispatch({ type: 'SET_STATS', payload: stats })
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error)
    }
  }

  // Valor que se pasa al provider
  const value = {
    ...state,
    loadAllData,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createPatient,
    updatePatient,
    deletePatient,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshStats,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
