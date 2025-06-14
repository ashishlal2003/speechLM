import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 text-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Say Hello to Tvarā!
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-700">
          Currently fluent in English, with support for 22+ Indian languages
          coming soon. Tvara is your AI friend and agent, ready to understand,
          act, and grow with you.
        </p>
        <Link to="/dashboard">
          <button className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all">
            Try Now
          </button>
        </Link>
      </div>
    </section>
  );
}

export default CTA;
