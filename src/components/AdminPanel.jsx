import React from "react";
import { Users, Calendar, Check, X } from "lucide-react";
import { sendStatusUpdateEmail } from "./utils/emailService";

export default function AdminPanel({
  bookings,
  updateBookingStatus,
  deleteBooking,
}) {
  const handleConfirm = async (booking) => {
    // Update status in state
    updateBookingStatus(booking.id, "confirmed");

    // Send email notification to customer
    try {
      const result = await sendStatusUpdateEmail(booking, "confirmed");
      if (result.success) {
        alert("✅ Booking confirmed! Customer has been notified via email.");
      } else {
        alert("✅ Booking confirmed! (Email notification failed)");
      }
    } catch {
      // Removed 'error' parameter since we're not using it
      alert("✅ Booking confirmed! (Email pending)");
    }
  };

  const handleCancel = async (booking) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? The customer will be notified."
      )
    ) {
      return;
    }

    // Update status in state
    updateBookingStatus(booking.id, "cancelled");

    // Send email notification to customer
    try {
      const result = await sendStatusUpdateEmail(booking, "cancelled");
      if (result.success) {
        alert("❌ Booking cancelled. Customer has been notified via email.");
      } else {
        alert("❌ Booking cancelled. (Email notification failed)");
      }
    } catch {
      // Removed 'error' parameter since we're not using it
      alert("❌ Booking cancelled. (Email pending)");
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Users className="w-8 h-8 mr-3 text-pink-600" />
            Admin Panel - Booking Management
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {booking.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <strong>Service:</strong> {booking.service}
                        </p>
                        <p>
                          <strong>Date:</strong> {booking.date}
                        </p>
                        <p>
                          <strong>Time:</strong> {booking.time}
                        </p>
                        <p>
                          <strong>Phone:</strong> {booking.phone}
                        </p>
                        <p className="md:col-span-2">
                          <strong>Email:</strong> {booking.email}
                        </p>
                        {booking.notes && (
                          <p className="md:col-span-2">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 md:mt-0">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleConfirm(booking)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </button>
                      )}
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
