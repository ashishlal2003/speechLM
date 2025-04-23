import { ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import videourl from '../assets/bg-video.mp4'
import musicurl from '../assets/music_beat.svg'

export default function HeroSection({ heroRef, scrollToRef, featuresRef, isLoaded, scrollY }) {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/tvara");
    };

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background video - Black and White */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover filter grayscale z-10 opacity-25"
                >
                    <source src={videourl} type="video/mp4" />
                    {/* Fallback for when video doesn't load */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
                </video>
            </div>

            {/* Classical background with grid and parallax effect */}
            <div
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 z-10 transition-opacity duration-1000"
                style={{
                    opacity: isLoaded ? 0.1 : 0,
                    transform: `translateY(${scrollY * 0.2}px)`
                }}
            ></div>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6  py-12 sm:py-16 z-20 text-center relative">
                <div
                    className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transform: `translateY(${scrollY * -0.2}px)` }} // Parallax effect
                >
                    {/* TVARA Logo - Preserved exactly as in the original code */}
                    <div className="overflow-hidden flex justify-center p-2 rounded-md">
                        <img
                            src={musicurl} // Update path as needed
                            alt="sound waveform"
                            className="h-24 w-32" style={{ filter: 'invert(40%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)' }}
                        />
                    </div>

                    {/* Main heading with animated text */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                        <div className="overflow-hidden">
                            <span className="block transform transition duration-1000"
                                style={{ transitionDelay: '300ms', transform: isLoaded ? 'translateY(0)' : 'translateY(100%)' }}>
                                Voice Intelligence
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="block transform transition duration-1000 text-gray-400"
                                style={{ transitionDelay: '500ms', transform: isLoaded ? 'translateY(0)' : 'translateY(100%)' }}>
                                with Classical Precision
                            </span>
                        </div>
                    </h1>

                    {/* Description */}
                    <div className="overflow-hidden mb-10 sm:mb-12">
                        <p className="text-gray-300 max-w-2xl mx-auto transform transition duration-1000"
                            style={{ transitionDelay: '600ms', transform: isLoaded ? 'translateY(0)' : 'translateY(50px)', opacity: isLoaded ? 1 : 0 }}>
                            TVARA delivers sophisticated voice assistance solutions with a timeless aesthetic.
                            Our approach balances classical principles with modern AI technology,
                            creating voice experiences that resonate on a deeper level.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transform transition duration-1000"
                        style={{ transitionDelay: '700ms', transform: isLoaded ? 'translateY(0)' : 'translateY(30px)', opacity: isLoaded ? 1 : 0 }}>
                        <button onClick={handleNavigate} className="cursor-pointer px-8 py-4 bg-white text-black rounded-none hover:bg-gray-100 transition flex items-center justify-center group font-medium">
                            Experience TVARA
                            <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <button onClick={() => scrollToRef(featuresRef)} className="px-8 py-4 bg-transparent border border-white border-opacity-30 hover:bg-white hover:text-black hover:bg-opacity-5 text-white transition flex items-center justify-center">
                            Learn More
                            <ChevronDown size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll down indicator */}
            <div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer"
                onClick={() => scrollToRef(featuresRef)}
            >
                <ChevronDown size={24} className="text-white opacity-70" />
            </div>
        </section>
    );
}

