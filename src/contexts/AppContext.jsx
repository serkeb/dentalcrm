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

// ... (el resto de tu appReducer se queda igual)
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
  loading: true, // Inicia en true
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

  useEffect(() => {
    if (user) {
      loadAllData()
    } else {
        dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [user])

  const loadAllData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const [doctors, patients, appointments, stats] = await Promise.all([
        db.getDoctors(),
        db.getPatients(),
        db.getAppointments(),
        db.getStats()
      ])
      dispatch({ type: 'SET_DOCTORS', payload: doctors })
      dispatch({ type: 'SET_PATIENTS', payload: patients })
      dispatch({ type: 'SET_APPOINTMENTS', payload: appointments })
      dispatch({ type: 'SET_STATS', payload: stats })
    } catch (error) {
      toast.error('Error al cargar datos: ' + error.message)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // --- MODIFICADO ---
  // Ahora pasamos el user.id a la base de datos
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
    // ... (el resto de funciones se quedan igual)
  }
  
  // --- MODIFICADO ---
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

  // (El resto de tus funciones como updatePatient, deleteDoctor, etc., se quedan igual)

  const value = {
    ...state,
    // ... (resto de tus funciones exportadas)
    createDoctor,
    createPatient,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
