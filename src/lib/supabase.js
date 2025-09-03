import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Objeto 'db' que contiene todas las interacciones con la base de datos
export const db = {
  // --- DOCTORS ---
  getDoctors: async () => {
    const { data, error } = await supabase.from('doctors').select('*')
    if (error) throw error
    return data
  },
  createDoctor: async (doctorData) => {
    const { data, error } = await supabase.from('doctors').insert([doctorData]).select().single()
    if (error) throw error
    return data
  },
  updateDoctor: async (id, updates) => {
    const { data, error } = await supabase.from('doctors').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  deleteDoctor: async (id) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id)
    if (error) throw error
  },

  // --- PATIENTS ---
  getPatients: async () => {
    const { data, error } = await supabase.from('patients').select('*')
    if (error) throw error
    return data
  },
  createPatient: async (patientData) => {
    const { data, error } = await supabase.from('patients').insert([patientData]).select().single()
    if (error) throw error
    return data
  },
  updatePatient: async (id, updates) => {
    const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  deletePatient: async (id) => {
    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) throw error
  },

  // --- APPOINTMENTS ---
  getAppointments: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patients(name, email), doctor:doctors(name)')
    if (error) throw error
    return data
  },
  createAppointment: async (appointmentData) => {
    const { data, error } = await supabase.from('appointments').insert([appointmentData]).select().single()
    if (error) throw error
    return data
  },
  updateAppointment: async (id, updates) => {
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  deleteAppointment: async (id) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) throw error
  },
  
  // --- STATS ---
  getStats: async () => {
    const [{ count: totalAppointments }, { count: totalPatients }] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('patients').select('*', { count: 'exact', head: true }),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    return {
      totalAppointments: totalAppointments || 0,
      totalPatients: totalPatients || 0,
      todayAppointments: todayAppointments || 0,
      appointmentChange: 15, // Puedes calcular esto de forma más compleja si lo necesitas
    };
  }
}

// Exportamos el cliente como default para usarlo en la autenticación
export default supabase
