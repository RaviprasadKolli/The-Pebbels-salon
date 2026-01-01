import React, { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getBookingsByEmail,
  getBookingsByPhone,
} from "../services/storageService";

export default function BookingStatus() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [foundBookings, setFoundBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearched(false);

    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        let result;

        if (searchEmail) {
          result = getBookingsByEmail(searchEmail);
        } else if (searchPhone) {
          result = getBookingsByPhone(searchPhone);
        }

        if (result && result.success) {
          setFoundBookings(result.bookings);
          console.log("Found bookings:", result.bookings.length);
        } else {
          setFoundBookings([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setFoundBookings([]);
      }

      setSearched(true);
      setIsSearching(false);
    }, 300);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "pending":
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section
      id="status"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Check Booking Status
          </h2>
          <p className="text-gray-600 text-lg">
            Enter your email or phone number to view your appointment details
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-pink-600" />
                Email Address
              </label>
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setSearchPhone("");
                }}
                disabled={searchPhone.length > 0}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all ${
                  searchPhone ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="john@example.com"
              />
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <div className="h-px w-16 bg-gray-300"></div>
                <span className="text-sm font-semibold">OR</span>
                <div className="h-px w-16 bg-gray-300"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-pink-600" />
                Phone Number
              </label>
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  setSearchEmail("");
                }}
                disabled={searchEmail.length > 0}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all ${
                  searchEmail ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <button
              type="submit"
              disabled={(!searchEmail && !searchPhone) || isSearching}
              className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                (!searchEmail && !searchPhone) || isSearching
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search My Bookings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {searched && (
          <div>
            {foundBookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-xl text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Bookings Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any bookings with the provided information.
                </p>
                <button
                  onClick={() => {
                    setSearched(false);
                    setSearchEmail("");
                    setSearchPhone("");
                  }}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Your Booking{foundBookings.length > 1 ? "s" : ""} (
                    {foundBookings.length})
                  </h3>
                  <button
                    onClick={() => {
                      setSearched(false);
                      setSearchEmail("");
                      setSearchPhone("");
                      setFoundBookings([]);
                    }}
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
                  >
                    New Search
                  </button>
                </div>

                {foundBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(booking.status)}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Booking #{booking.id.substring(0, 8)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Customer Name
                            </p>
                            <p className="font-semibold text-gray-800">
                              {booking.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-semibold text-gray-800">
                              {booking.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                            <p className="font-semibold text-gray-800">
                              {booking.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Service
                            </p>
                            <p className="font-semibold text-gray-800">
                              {booking.service}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Date</p>
                            <p className="font-semibold text-gray-800">
                              {formatDate(booking.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Time</p>
                            <p className="font-semibold text-gray-800">
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">
                          Additional Notes
                        </p>
                        <p className="text-gray-700 italic">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {booking.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-yellow-800 mb-1">
                              Awaiting Confirmation
                            </p>
                            <p className="text-sm text-yellow-700">
                              Your booking is being reviewed. We'll contact you
                              soon to confirm your appointment.
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-green-800 mb-1">
                              Confirmed!
                            </p>
                            <p className="text-sm text-green-700">
                              Your appointment is confirmed. We look forward to
                              seeing you!
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.status === "cancelled" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-800 mb-1">
                              Cancelled
                            </p>
                            <p className="text-sm text-red-700">
                              This appointment has been cancelled. Please
                              contact us if you'd like to reschedule.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
