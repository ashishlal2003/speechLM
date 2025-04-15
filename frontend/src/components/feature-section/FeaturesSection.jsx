import { ArrowRight, Mic, MessageSquare, Shield, ArrowUpRight, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from './FeatureCard';

export default function FeaturesSection({ featuresRef, scrollY }) {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/tvara");
    };

    const features = [
        {
            icon: Mic,
            title: "Natural Voice Recognition",
            description: "Advanced neural processing enables TVARA to understand nuanced speech patterns with exceptional accuracy."
        },
        {
            icon: MessageSquare,
            title: "Contextual Understanding",
            description: "TVARA maintains conversation context, providing responses that feel natural and continuous."
        },
        {
            icon: Shield,
            title: "Enhanced Privacy",
            description: "Your data remains secure with TVARA's advanced encryption and privacy-first design principles."
        },
        {
            icon: ArrowUpRight,
            title: "Adaptive Learning",
            description: "TVARA continually improves by learning from interactions while maintaining a classical interface."
        },
        {
            icon: Mic,
            title: "Multi-language Support",
            description: "Communicate in multiple languages with TVARA's advanced linguistic capabilities."
        },
        {
            icon: Link,
            title: "Seamless Integration",
            description: "Connect TVARA with your existing systems through our elegant API architecture."
        }
    ];

    return (
        <section
            ref={featuresRef}
            className="pt-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #000000, #101010)' }}
        >
            {/* Parallax background elements */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 30%)',
                    transform: `translateY(${(scrollY - 500) * 0.1}px)`
                }}
            ></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Features</span>
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        TVARA combines classical elegance with cutting-edge voice technology, offering a suite of features that elevate your interaction with AI.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>

                {/* CTA button */}
                <div className="text-center">
                    <button onClick={handleNavigate} className="px-8 py-4 bg-white text-black rounded-none hover:bg-gray-100 transition flex items-center justify-center mx-auto group">
                        Explore All Features
                        <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}
