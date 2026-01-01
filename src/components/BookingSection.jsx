import React, { useState, useMemo } from "react";
import { SERVICES } from "./ServicesSection";
import {
  sendBookingConfirmation,
  sendAdminNotification,
} from "./utils/emailService";
import { addBooking } from "../services/supabaseService";

// Service ID: service_2j4xuub
// Template ID (Customer): template_e7dp1c6
// Template ID (Admin): template_ngxzwfn
// Public Key: GMVy3tfpbrjzcWgdw

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function BookingSection({ onBookingSuccess }) {
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleChange = (field, value) => {
    setBookingForm({ ...bookingForm, [field]: value });
  };

  const availableTimeSlots = useMemo(() => {
    if (!bookingForm.date) return TIME_SLOTS;

    const selectedDate = new Date(bookingForm.date);
    const now = new Date();

    // If selected date is today, filter out past times
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      return TIME_SLOTS.filter((slot) => slot > currentHHMM);
    }

    // Future date: all slots
    return TIME_SLOTS;
  }, [bookingForm.date]);

  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (name.length > 50) {
      return "Name must be less than 50 characters";
    }
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "Phone number must be at least 10 digits";
    }
    if (digitsOnly.length > 15) {
      return "Phone number is too long";
    }
    return null;
  };

  const validateDate = (date) => {
    if (!date) {
      return "Please select a date";
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Cannot book appointments in the past";
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    if (selectedDate > maxDate) {
      return "Cannot book more than 90 days in advance";
    }

    if (selectedDate.getDay() === 0) {
      return "We are closed on Sundays";
    }
    return null;
  };

  const validateTime = (time, date) => {
    if (!date) {
      return "Please select a date before selecting a time";
    }
    if (!time) {
      return "Please select a time";
    }
    if (!TIME_SLOTS.includes(time)) {
      return "Please select a valid time slot";
    }

    // If booking for today, ensure the slot is still in the future
    const now = new Date();
    const selectedDate = new Date(date);
    if (selectedDate.toDateString() === now.toDateString()) {
      const [hour, minute] = time.split(":").map(Number);
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hour, minute, 0, 0);
      if (slotDate <= now) {
        return "This time slot has passed";
      }
    }

    return null;
  };

  const validateService = (service) => {
    if (!service) {
      return "Please select a service";
    }
    return null;
  };

  const validateNotes = (notes) => {
    if (notes && notes.length > 500) {
      return "Notes cannot exceed 500 characters";
    }
    return null;
  };

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(bookingForm.name);
    const emailError = validateEmail(bookingForm.email);
    const phoneError = validatePhone(bookingForm.phone);
    const serviceError = validateService(bookingForm.service);
    const dateError = validateDate(bookingForm.date);
    const timeError = validateTime(bookingForm.time, bookingForm.date);
    const notesError = validateNotes(bookingForm.notes);

    const newErrors = {
      name: nameError,
      email: emailError,
      phone: phoneError,
      service: serviceError,
      date: dateError,
      time: timeError,
      notes: notesError,
    };

    const hasErrors = Object.values(newErrors).some((error) => error !== null);

    if (hasErrors) {
      setErrors(newErrors);
      showNotification("Please fix the errors in the form", "error");
      const firstErrorField = Object.keys(newErrors).find(
        (key) => newErrors[key]
      );
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    // Show loading notification
    showNotification("Submitting booking...", "success");

    try {
      // Save to localStorage
      const result = await addBooking({
        // ✅ CORRECT - added await
        ...bookingForm,
        email: bookingForm.email.toLowerCase(),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("✅ Booking saved");

      // Send emails
      try {
        const customerResult = await sendBookingConfirmation(bookingForm);
        const adminResult = await sendAdminNotification(bookingForm);

        if (customerResult.success && adminResult.success) {
          showNotification(
            "✅ Booking submitted! Check your email for confirmation.",
            "success"
          );
        } else if (customerResult.success) {
          showNotification(
            "✅ Booking submitted! Confirmation email sent.",
            "success"
          );
        } else {
          showNotification(
            "✅ Booking submitted! We'll contact you soon.",
            "success"
          );
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
        showNotification(
          "✅ Booking saved! We'll send confirmation shortly.",
          "success"
        );
      }

      if (onBookingSuccess) {
        onBookingSuccess();
      }

      // Notify parent component
      if (onBookingSuccess) {
        onBookingSuccess();
      }

      // Reset form
      setBookingForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Booking error:", error);
      showNotification(
        "❌ Failed to submit booking. Please try again.",
        "error"
      );
    }
  };
  return (
    <section id="booking" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Book Your Appointment
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Schedule your visit in just a few clicks
        </p>

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white z-50 animate-fade-in`}
          >
            <div className="flex items-center space-x-2">
              {toastType === "success" ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={bookingForm.name}
                  onChange={(e) => {
                    handleChange("name", e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: null });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateName(e.target.value);
                    if (error) {
                      setErrors({ ...errors, name: error });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => {
                    handleChange("email", e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: null });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateEmail(e.target.value);
                    if (error) {
                      setErrors({ ...errors, email: error });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={bookingForm.phone}
                onChange={(e) => {
                  handleChange("phone", e.target.value);
                  if (errors.phone) {
                    setErrors({ ...errors, phone: null });
                  }
                }}
                onBlur={(e) => {
                  const error = validatePhone(e.target.value);
                  if (error) {
                    setErrors({ ...errors, phone: error });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                  errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Service *
              </label>
              <select
                name="service"
                required
                value={bookingForm.service}
                onChange={(e) => {
                  handleChange("service", e.target.value);
                  if (errors.service) {
                    setErrors({ ...errors, service: null });
                  }
                }}
                onBlur={(e) => {
                  const error = validateService(e.target.value);
                  if (error) {
                    setErrors({ ...errors, service: error });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                  errors.service
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Choose a service...</option>
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - ${service.price} ({service.duration})
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.service}
                </p>
              )}
            </div>

            {/* Date and Time Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={bookingForm.date}
                  onChange={(e) => {
                    handleChange("date", e.target.value);
                    if (errors.date) {
                      setErrors({ ...errors, date: null });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateDate(e.target.value);
                    if (error) {
                      setErrors({ ...errors, date: error });
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                    errors.date ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  required
                  value={bookingForm.time}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    if (newTime && !availableTimeSlots.includes(newTime)) {
                      handleChange("time", "");
                      setErrors({ ...errors, time: null });
                    } else {
                      handleChange("time", newTime);
                      if (errors.time) {
                        setErrors({ ...errors, time: null });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateTime(
                      e.target.value,
                      bookingForm.date
                    );
                    if (error) {
                      setErrors({ ...errors, time: error });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                    errors.time ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="">Select time...</option>
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
                <span className="text-gray-400 text-xs ml-2">(Optional)</span>
              </label>
              <textarea
                name="notes"
                value={bookingForm.notes}
                onChange={(e) => {
                  handleChange("notes", e.target.value);
                  if (errors.notes) {
                    setErrors({ ...errors, notes: null });
                  }
                }}
                onBlur={(e) => {
                  const error = validateNotes(e.target.value);
                  if (error) {
                    setErrors({ ...errors, notes: error });
                  }
                }}
                rows="3"
                maxLength="500"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors ${
                  errors.notes ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Any special requests or preferences..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes ? (
                  <p className="text-red-500 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.notes}
                  </p>
                ) : (
                  <span></span>
                )}
                <span className="text-gray-400 text-xs">
                  {bookingForm.notes.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Confirm Booking</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
