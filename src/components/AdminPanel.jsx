import React from "react";
import { Users, Calendar, Check, X } from "lucide-react";
import { sendStatusUpdateEmail } from "./utils/emailService";

export default function AdminPanel({
  bookings,
  isLoading,
  updateBookingStatus,
  deleteBooking,
  onRefresh,
}) {
  const handleConfirm = async (booking) => {
    // Update status in Firebase
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

    // Update status in Firebase
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
      alert("❌ Booking cancelled. (Email pending)");
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Header with Refresh Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center">
              <Users className="w-8 h-8 mr-3 text-pink-600" />
              Admin Panel - Booking Management
            </h2>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">
                Loading bookings from Firebase...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Bookings will appear here once customers make appointments
              </p>
            </div>
          ) : (
            /* Bookings List */
            <div className="space-y-4">
              {/* Booking Count */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                <p className="text-gray-700 font-semibold">
                  📊 Total Bookings:{" "}
                  <span className="text-pink-600">{bookings.length}</span>
                  {" | "}
                  Pending:{" "}
                  <span className="text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </span>
                  {" | "}
                  Confirmed:{" "}
                  <span className="text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </span>
                  {" | "}
                  Cancelled:{" "}
                  <span className="text-red-600">
                    {bookings.filter((b) => b.status === "cancelled").length}
                  </span>
                </p>
              </div>

              {/* Bookings */}
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
                        {booking.createdAt && (
                          <p className="md:col-span-2 text-xs text-gray-500">
                            <strong>Booked on:</strong>{" "}
                            {new Date(booking.createdAt).toLocaleString()}
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
