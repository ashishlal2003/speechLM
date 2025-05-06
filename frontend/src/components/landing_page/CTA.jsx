import React from 'react'

function CTA() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-green-500 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Experience the Voice of India
                </h2>
                <p className="max-w-2xl mx-auto mb-8 text-white/90">
                    Join thousands of users discovering the power of AI voice assistance
                    designed specifically for India.
                </p>
                <button className="bg-white text-gray-800 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all">
                    Start Your Free Trial
                </button>
            </div>
        </section>
    )
}

export default CTA