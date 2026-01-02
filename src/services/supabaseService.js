import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Add a new booking
 */
export const addBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          name: bookingData.name,
          email: bookingData.email.toLowerCase(),
          phone: bookingData.phone,
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          notes: bookingData.notes || "",
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    console.log("✅ Booking added to Supabase:", data[0].id);
    return { success: true, id: data[0].id };
  } catch (error) {
    console.error("❌ Error adding booking:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all bookings (for admin)
 */
export const getAllBookings = async () => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log("✅ Loaded", data.length, "bookings from Supabase");
    return { success: true, bookings: data };
  } catch (error) {
    console.error("❌ Error getting bookings:", error);
    return { success: false, error: error.message, bookings: [] };
  }
};

/**
 * Get bookings by email
 */
export const getBookingsByEmail = async (email) => {
  try {
    // Convert search email to lowercase to match stored format
    const searchEmail = email.toLowerCase();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", searchEmail) // ✅ Exact match with lowercase
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log(`🔍 Found ${data.length} bookings for: ${searchEmail}`);
    return { success: true, bookings: data };
  } catch (error) {
    console.error("❌ Error getting bookings by email:", error);
    return { success: false, error: error.message, bookings: [] };
  }
};

/**
 * Get bookings by phone
 */
export const getBookingsByPhone = async (phone) => {
  try {
    const cleanPhone = phone.replace(/\D/g, "");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Filter phone numbers on client side
    const filtered = data.filter(
      (booking) => booking.phone.replace(/\D/g, "") === cleanPhone
    );

    return { success: true, bookings: filtered };
  } catch (error) {
    console.error("❌ Error getting bookings by phone:", error);
    return { success: false, error: error.message, bookings: [] };
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (error) throw error;

    console.log(`✅ Booking ${bookingId} status updated to: ${status}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (bookingId) => {
  try {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) throw error;

    console.log(`🗑️ Booking ${bookingId} deleted from Supabase`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    return { success: false, error: error.message };
  }
};
