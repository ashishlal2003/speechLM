import React from 'react'
import { Quote } from 'lucide-react'

function Testimonials() {
    return (
        <section  id="testimonials" className="py-20 px-6 bg-gradient-to-b from-white to-orange-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 text-transparent bg-clip-text">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Hear from fellow Indians embracing Tvara, the voice assistant built with our roots.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
                    {[
                        {
                            name: "Priya Sharma",
                            location: "Mumbai",
                            quote:
                                "Tvara understands my Marathi accent perfectly! It's like talking to someone who truly gets our culture.",
                        },
                        {
                            name: "Rahul Verma",
                            location: "Delhi",
                            quote:
                                "I use Tvara every day to manage my schedule. Its Hindi support is flawless and the cultural references make it feel like home.",
                        },
                        {
                            name: "Anjali Patel",
                            location: "Ahmedabad",
                            quote:
                                "The way Tvara understands context in Gujarati conversations is amazing. Technology with Indian soul!",
                        },
                    ].map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl border border-orange-100 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                        >
                            <Quote className="absolute top-4 right-4 text-orange-200 w-6 h-6" />

                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>

                            <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
