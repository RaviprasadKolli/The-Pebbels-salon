import React from "react";
import { Users, Star, Clock } from "lucide-react";

export default function HeroSection({ scrollToSection }) {
  return (
    <section id="home" className="pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ lineHeight: "6rem" }}
          >
            Beauty & Elegance
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-8">
            Experience luxury salon services with our expert stylists. Your
            beauty journey starts here.
          </p>
          <button
            onClick={() => scrollToSection("booking")}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Book Your Appointment
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Stylists</h3>
            <p className="text-gray-600">
              Trained professionals with years of experience
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Products</h3>
            <p className="text-gray-600">
              Only the finest quality products for your care
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
            <p className="text-gray-600">
              Convenient scheduling to fit your lifestyle
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
