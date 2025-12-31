import React from "react";
import { Clock } from "lucide-react";

const SERVICES = [
  {
    id: 1,
    name: "Haircut & Styling",
    price: 45,
    duration: "60 min",
    category: "Hair",
  },
  {
    id: 2,
    name: "Hair Coloring",
    price: 85,
    duration: "120 min",
    category: "Hair",
  },
  {
    id: 3,
    name: "Highlights",
    price: 95,
    duration: "150 min",
    category: "Hair",
  },
  {
    id: 4,
    name: "Hair Treatment",
    price: 55,
    duration: "45 min",
    category: "Hair",
  },
  { id: 5, name: "Manicure", price: 30, duration: "30 min", category: "Nails" },
  { id: 6, name: "Pedicure", price: 40, duration: "45 min", category: "Nails" },
  {
    id: 7,
    name: "Facial Treatment",
    price: 70,
    duration: "60 min",
    category: "Skin",
  },
  {
    id: 8,
    name: "Makeup Application",
    price: 60,
    duration: "45 min",
    category: "Makeup",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Discover our range of premium beauty services
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {service.name}
                </h3>
                <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-pink-600">
                  ${service.price}
                </span>
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { SERVICES };
