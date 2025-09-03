import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se crea el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Objeto 'db' con las funciones de la base de datos
export const db = {
  // --- DOCTORS ---
  getDoctors: async () => {
    const { data, error } = await supabase.from('doctors').select('*')
    if (error) throw error
    return data
  },
  // ... (aquí van el resto de tus funciones: createDoctor, getPatients, etc.)
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
      appointmentChange: 15, // Placeholder
    };
  }
}

// Exportamos el cliente como default
export default supabase
