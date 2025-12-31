import React from "react";
import { Phone, Mail, MapPin, Clock, Calendar } from "lucide-react";

export default function ContactSection() {
  // Get values from environment variables
  const salonPhone = import.meta.env.VITE_SALON_PHONE || "+91-7306115227";
  const salonEmail =
    import.meta.env.VITE_SALON_EMAIL || "raviprasadkolli123@gmail.com";
  const salonAddress =
    import.meta.env.VITE_SALON_ADDRESS ||
    "6-46/1, Sherlingampalli, Hyderabad, Telangana 500019";
  const mapsLink =
    import.meta.env.VITE_MAPS_LINK ||
    "https://maps.app.goo.gl/qiddfrRpYw91GrFL6";

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-gradient-to-br from-pink-50 via-white to-purple-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg">
            We're here to make you look and feel amazing
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Phone Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Call Us</h3>
            <p className="text-gray-800 font-semibold text-center text-lg">
              {salonPhone}
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Mon-Sat: 9 AM - 8 PM
            </p>
            <a
              href={`tel:${salonPhone.replace(/\s/g, "")}`}
              className="mt-4 block text-center text-pink-600 hover:text-pink-700 font-semibold"
            >
              Tap to Call →
            </a>
          </div>

          {/* Email Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Email Us</h3>
            <p className="text-gray-800 font-semibold text-center text-lg break-all">
              {salonEmail}
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Reply within 24 hours
            </p>
            <a
              href={`mailto:${salonEmail}`}
              className="mt-4 block text-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              Send Email →
            </a>
          </div>

          {/* Location Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Visit Us</h3>
            <p className="text-gray-800 text-center font-medium leading-relaxed">
              {salonAddress}
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-pink-600 hover:text-pink-700 font-semibold"
            >
              Get Directions →
            </a>
          </div>
        </div>

        {/* Opening Hours Card */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <Clock className="w-8 h-8 text-pink-600 mr-3" />
            <h3 className="text-3xl font-bold text-gray-800">Opening Hours</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-pink-600 mr-3" />
                <span className="font-bold text-gray-800">Monday - Friday</span>
              </div>
              <span className="text-gray-700 font-semibold">
                9:00 AM - 8:00 PM
              </span>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-bold text-gray-800">Saturday</span>
              </div>
              <span className="text-gray-700 font-semibold">
                9:00 AM - 6:00 PM
              </span>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-pink-600 mr-3" />
                <span className="font-bold text-gray-800">Sunday</span>
              </div>
              <span className="text-gray-700 font-semibold">
                10:00 AM - 5:00 PM
              </span>
            </div>

            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-red-200">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-red-600 mr-3" />
                <span className="font-bold text-gray-800">Holidays</span>
              </div>
              <span className="text-red-600 font-semibold">Closed</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              📍 Walk-ins welcome! | 📞 Call ahead for guaranteed slot | 🎁
              Special packages available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
