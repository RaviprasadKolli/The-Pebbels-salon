import emailjs from "@emailjs/browser";

// Get configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TEMPLATE_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER;
const TEMPLATE_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN;

// Salon information
const SALON_INFO = {
  salon_name: import.meta.env.VITE_SALON_NAME || "The Pebbles Unisex Salon",
  salon_phone: import.meta.env.VITE_SALON_PHONE || "+91 7306115227",
  salon_email:
    import.meta.env.VITE_SALON_EMAIL || "raviprasadkolli123@gmail.com",
  admin_email:
    import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL ||
    "raviprasadkolli123@gmail.com",
};

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Format date for email display
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Send booking confirmation email to customer (PENDING status)
 */
export const sendBookingConfirmation = async (booking) => {
  try {
    console.log("📧 Sending confirmation email to:", booking.email);

    const templateParams = {
      to_email: booking.email,
      subject_line: `Booking Received - ${SALON_INFO.salon_name}`,
      email_title: "Booking Confirmation",
      customer_name: booking.name,
      service_name: booking.service,
      booking_date: formatDate(booking.date),
      booking_time: booking.time,
      booking_status: "⏳ PENDING",
      main_message:
        "Thank you for booking with us! We've received your appointment request and will confirm it shortly. You'll receive another email once your booking is confirmed.",
      ...SALON_INFO,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_CUSTOMER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Confirmation email sent successfully:", response);
    return { success: true, message: "Confirmation email sent to customer" };
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error);
    return {
      success: false,
      message: error.text || "Failed to send confirmation email",
    };
  }
};

/**
 * Send status update email to customer (CONFIRMED or CANCELLED)
 */
export const sendStatusUpdateEmail = async (booking, status) => {
  try {
    console.log(`📧 Sending ${status} email to:`, booking.email);

    let subjectLine = "";
    let mainMessage = "";
    let bookingStatusDisplay = "";

    if (status === "confirmed") {
      subjectLine = `Booking CONFIRMED - ${SALON_INFO.salon_name}`;
      mainMessage =
        "🎉 Great news! Your appointment has been CONFIRMED. We look forward to seeing you! If you need to make any changes, please contact us.";
      bookingStatusDisplay = "✅ CONFIRMED";
    } else if (status === "cancelled") {
      subjectLine = `Booking CANCELLED - ${SALON_INFO.salon_name}`;
      mainMessage =
        "❌ Unfortunately, your appointment has been CANCELLED. We apologize for any inconvenience. Please contact us to reschedule at your convenience.";
      bookingStatusDisplay = "❌ CANCELLED";
    }

    const templateParams = {
      to_email: booking.email,
      subject_line: subjectLine,
      email_title: "Booking Update",
      customer_name: booking.name,
      service_name: booking.service,
      booking_date: formatDate(booking.date),
      booking_time: booking.time,
      booking_status: bookingStatusDisplay,
      main_message: mainMessage,
      ...SALON_INFO,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_CUSTOMER,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log(`✅ ${status} email sent successfully:`, response);
    return { success: true, message: `${status} email sent to customer` };
  } catch (error) {
    console.error(`❌ Error sending ${status} email:`, error);
    return {
      success: false,
      message: error.text || `Failed to send ${status} email`,
    };
  }
};

/**
 * Send new booking notification to admin
 */
export const sendAdminNotification = async (booking) => {
  try {
    console.log("📧 Sending admin notification to:", SALON_INFO.admin_email);

    const templateParams = {
      to_email: SALON_INFO.admin_email,
      customer_name: booking.name,
      customer_email: booking.email,
      customer_phone: booking.phone,
      service_name: booking.service,
      booking_date: formatDate(booking.date),
      booking_time: booking.time,
      customer_notes: booking.notes || "None",
      ...SALON_INFO,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_ADMIN,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Admin notification sent successfully:", response);
    return { success: true, message: "Admin has been notified" };
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    return { success: false, message: error.text || "Failed to notify admin" };
  }
};
