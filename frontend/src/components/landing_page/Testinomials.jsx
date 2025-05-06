import React from 'react'

function Testinomials() {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 text-transparent bg-clip-text">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Join thousands of satisfied users across India experiencing the future of voice technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Priya Sharma",
                            location: "Mumbai",
                            quote: "Vāṇī understands my Marathi accent perfectly! It's like talking to someone who truly gets our culture."
                        },
                        {
                            name: "Rahul Verma",
                            location: "Delhi",
                            quote: "I use Vāṇī every day to manage my schedule. Its Hindi support is flawless and the cultural references make it feel like home."
                        },
                        {
                            name: "Anjali Patel",
                            location: "Ahmedabad",
                            quote: "The way Vāṇī understands context in Gujarati conversations is amazing. Technology with Indian soul!"
                        }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testinomials