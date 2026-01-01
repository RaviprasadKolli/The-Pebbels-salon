// Simple localStorage-based booking service
// Works across browser tabs, persists on refresh

const BOOKINGS_KEY = "salon_bookings";

/**
 * Get all bookings from localStorage
 */
export const getAllBookings = () => {
  try {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error("Error reading bookings:", error);
    return [];
  }
};

/**
 * Save bookings to localStorage
 */
const saveBookings = (bookings) => {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error("Error saving bookings:", error);
    return false;
  }
};

/**
 * Add a new booking
 */
export const addBooking = (bookingData) => {
  try {
    const bookings = getAllBookings();
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveBookings(bookings);

    console.log("✅ Booking added:", newBooking.id);
    return { success: true, id: newBooking.id };
  } catch (error) {
    console.error("❌ Error adding booking:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get bookings by email
 */
export const getBookingsByEmail = (email) => {
  try {
    const bookings = getAllBookings();
    const filtered = bookings.filter(
      (b) => b.email.toLowerCase() === email.toLowerCase()
    );
    return { success: true, bookings: filtered };
  } catch (error) {
    console.error("❌ Error getting bookings by email:", error);
    return { success: false, bookings: [] };
  }
};

/**
 * Get bookings by phone
 */
export const getBookingsByPhone = (phone) => {
  try {
    const bookings = getAllBookings();
    const cleanPhone = phone.replace(/\D/g, "");
    const filtered = bookings.filter(
      (b) => b.phone.replace(/\D/g, "") === cleanPhone
    );
    return { success: true, bookings: filtered };
  } catch (error) {
    console.error("❌ Error getting bookings by phone:", error);
    return { success: false, bookings: [] };
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = (bookingId, status) => {
  try {
    const bookings = getAllBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index !== -1) {
      bookings[index].status = status;
      bookings[index].updatedAt = new Date().toISOString();
      saveBookings(bookings);
      console.log(`✅ Booking ${bookingId} updated to ${status}`);
      return { success: true };
    }

    return { success: false, error: "Booking not found" };
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = (bookingId) => {
  try {
    const bookings = getAllBookings();
    const filtered = bookings.filter((b) => b.id !== bookingId);
    saveBookings(filtered);
    console.log(`🗑️ Booking ${bookingId} deleted`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear all bookings (for testing)
 */
export const clearAllBookings = () => {
  try {
    localStorage.removeItem(BOOKINGS_KEY);
    console.log("🗑️ All bookings cleared");
    return { success: true };
  } catch (error) {
    console.error("❌ Error clearing bookings:", error);
    return { success: false, error: error.message };
  }
};
