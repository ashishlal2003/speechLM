import { useState, useEffect } from 'react';

export default function Navbar({ scrollToRef, heroRef, featuresRef, testimonialsRef, pricingRef, contactRef, isLoaded }) {
    const [navbarBg, setNavbarBg] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Add background to navbar when scrolling down
            setNavbarBg(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
            <nav className={`max-w-7xl mx-auto rounded-md transition-all duration-500 ${
                navbarBg 
                    ? 'bg-black bg-opacity-80 shadow-xl border border-gray border-opacity-10 backdrop-blur-sm' 
                    : 'bg-transparent border-transparent'
            } px-6 py-4`}>
                <div className="flex justify-between items-center">
                    <div className="flex justify-center cursor-pointer" onClick={() => scrollToRef(heroRef)}>
                        <div className="font-serif text-2xl sm:text-3xl transform transition duration-1000"
                            style={{ transitionDelay: '100ms', transform: isLoaded ? 'translateY(0)' : 'translateY(50px)', opacity: isLoaded ? 1 : 0 }}>
                            <div className="flex items-center">
                                <div className="relative">
                                    <span className="text-white">T</span>
                                    <div className="absolute top-0.5 -left-1 w-6 h-4 border-t-1 border-white opacity-30"></div>
                                </div>
                                <span className="text-gray-300">V</span>
                                <span className="text-gray-300">A</span>
                                <span className="text-gray-400">R</span>
                                <span className="text-gray-400">A</span>
                                <div className="relative ml-1">
                                    <div className="absolute -bottom-4 -right-0 w-6 border-b-1 border-r-2 border-white opacity-30"></div>
                                </div>
                            </div>
                            <div className="text-[6px] tracking-widest uppercase text-gray-500 text-center">Voice Advanced Assistance</div>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        <button onClick={() => scrollToRef(heroRef)} className="text-sm text-gray-300 hover:text-white transition cursor-pointer">Home</button>
                        <button onClick={() => scrollToRef(featuresRef)} className="text-sm text-gray-300 hover:text-white transition cursor-pointer">Features</button>
                        <button onClick={() => scrollToRef(testimonialsRef)} className="text-sm text-gray-300 hover:text-white transition cursor-pointer">Testimonials</button>
                        <button onClick={() => scrollToRef(pricingRef)} className="text-sm text-gray-300 hover:text-white transition cursor-pointer">Pricing</button>
                        <button onClick={() => scrollToRef(contactRef)} className="text-sm text-gray-300 hover:text-white transition cursor-pointer">Contact</button>
                    </div>

                    <button className={`px-4 py-2 border rounded-none transition text-sm cursor-pointer ${
                        navbarBg 
                            ? 'border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 hover:text-white' 
                            : 'border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 hover:text-black'
                    }`}>
                        Log In
                    </button>
                </div>
            </nav>
        </div>
    );
}