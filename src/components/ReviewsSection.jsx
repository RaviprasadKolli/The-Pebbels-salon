import React from "react";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing service! The stylist really understood what I wanted.",
    date: "2024-12-15",
  },
  {
    id: 2,
    name: "Emily Davis",
    rating: 5,
    comment: "Best salon experience ever. Will definitely come back!",
    date: "2024-12-10",
  },
  {
    id: 3,
    name: "Michael Brown",
    rating: 4,
    comment: "Great atmosphere and professional staff.",
    date: "2024-12-05",
  },
  {
    id: 4,
    name: "Jessica Wilson",
    rating: 5,
    comment: "Love my new hair color! Thank you so much!",
    date: "2024-11-28",
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Customer Reviews
        </h2>
        <p className="text-center text-gray-600 mb-12">
          See what our clients say about us
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
