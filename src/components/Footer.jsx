import React from "react";
import { Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Scissors className="w-8 h-8 text-pink-400" />
          <span className="text-2xl font-bold">
            The Pebbles Hair & Beauty Unisex Salon
          </span>
        </div>
        <p className="text-gray-400 mb-4">Where beauty meets elegance</p>
        <p className="text-gray-500 text-sm">
          © 2024 The Pebbles Hair & Beauty Unisex Salon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
