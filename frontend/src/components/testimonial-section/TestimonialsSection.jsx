import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection({ testimonialsRef, scrollY }) {
    const testimonials = [
        {
            quote: "TVARA has revolutionized how we interact with our systems. The classical aesthetics paired with cutting-edge AI create an experience that feels both familiar and innovative.",
            name: "Alexandra Chen",
            title: "CTO, NexTech Solutions"
        },
        {
            quote: "The attention to detail in TVARA's interface design shows a deep understanding of human-computer interaction. It's not just functional—it's beautiful.",
            name: "Marcus Johnson",
            title: "Design Director, Artisan Digital"
        },
        {
            quote: "Implementation was seamless, and our customers immediately noticed the difference. TVARA's voice recognition accuracy is simply unmatched in the industry.",
            name: "Sophia Rodriguez",
            title: "VP of Product, Global Solutions"
        }
    ];

    return (
        <section
            ref={testimonialsRef}
            className="pt-24 relative overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, #101010, #050505)'
            }}
        >
            {/* Parallax decorative elements */}
            <div
                className="absolute right-0 top-1/4 w-64 h-64 border border-white opacity-5 rounded-full"
                style={{ transform: `translateY(${(scrollY - 1200) * 0.15}px)` }}
            ></div>

            <div
                className="absolute left-1/6 bottom-1/4 w-32 h-32 border border-white opacity-5"
                style={{ transform: `translateY(${(scrollY - 1200) * -0.1}px)` }}
            ></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover how TVARA is transforming voice interactions across various industries
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            quote={testimonial.quote}
                            name={testimonial.name}
                            title={testimonial.title}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

