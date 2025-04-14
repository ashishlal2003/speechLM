import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TVARAHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ghostPositions, setGhostPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // Handle initial load animation
  useEffect(() => {
    setIsLoaded(true);

    // Handle scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse movement for ghost cursor effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Add new position to ghost trail
      setGhostPositions(prev => {
        const newPositions = [...prev, { x, y, opacity: 1 }];
        // Keep only last 15 positions
        return newPositions.slice(-15);
      });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Gradually fade ghost cursors
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setGhostPositions(prev =>
        prev.map(pos => ({
          ...pos,
          opacity: pos.opacity > 0 ? pos.opacity - 0.04 : 0
        })).filter(pos => pos.opacity > 0)
      );
    }, 40);

    return () => clearInterval(fadeInterval);
  }, []);

  const navigate = useNavigate();
  const handleNavigate = ()=>{
    navigate("/tvara")
  }

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center"
    >
      {/* Classical background with grid animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5 transition-opacity duration-1000"
        style={{ opacity: isLoaded ? 0.07 : 0, transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>

      {/* Classical background animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Golden ratio spiral element */}
        <div className="absolute left-1/4 top-1/4 w-96 h-96 border border-white opacity-10 rounded-full animate-classical-rotate"></div>
        
        {/* Diagonal lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white opacity-5 transform -rotate-45 animate-fade-in-out"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-white opacity-5 transform rotate-12 animate-fade-in-out" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Classical circular elements */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-white opacity-5 rounded-full animate-expand-contract"></div>
          <div className="absolute inset-0 w-full h-full border border-white opacity-5 rounded-full animate-clockwise" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 w-2/3 h-2/3 top-1/6 left-1/6 border border-white opacity-10 rounded-full animate-counterclockwise" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Additional animated elements */}
        {/* <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-white opacity-5 animate-pulse-slow"></div> */}
      </div>

      {/* Ghost mouse trail */}
      {ghostPositions.map((pos, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white pointer-events-none mix-blend-difference"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: pos.opacity,
            width: `${Math.max(4, 12 - index * 0.8)}px`,
            height: `${Math.max(4, 12 - index * 0.8)}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease-out',
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Main content */}
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-10 text-center">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* TVARA Logo - Centered and corrected */}
          <div className="mb-8 sm:mb-12 overflow-hidden flex justify-center">
            <div className="font-serif text-6xl sm:text-7xl transform transition duration-1000"
              style={{ transitionDelay: '100ms', transform: isLoaded ? 'translateY(0)' : 'translateY(50px)', opacity: isLoaded ? 1 : 0 }}>
              <div className="flex items-center">
                <div className="relative">
                  <span className="text-white">T</span>
                  <div className="absolute -top-1 -left-2 w-10 h-10 border-t-2 border-l-2 border-white opacity-30"></div>
                </div>
                <span className="text-gray-300">V</span>
                <span className="text-gray-350">A</span>
                <span className="text-gray-400">R</span>
                <span className="text-gray-500">A</span>
                <div className="relative ml-1">
                  <div className="absolute -bottom-8 -right-1 w-10 h-10 border-b-2 border-r-2 border-white opacity-30"></div>
                </div>
              </div>
              <div className="text-xs tracking-widest uppercase text-gray-500 mt-3 text-center">Voice Advanced Assistance</div>
            </div>
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
            <p className="text-gray-400 max-w-2xl mx-auto transform transition duration-1000"
              style={{ transitionDelay: '600ms', transform: isLoaded ? 'translateY(0)' : 'translateY(50px)', opacity: isLoaded ? 1 : 0 }}>
              TVARA delivers sophisticated voice assistance solutions with a timeless aesthetic.
              Our approach balances classical principles with modern AI technology,
              creating voice experiences that resonate on a deeper level.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transform transition duration-1000"
            style={{ transitionDelay: '700ms', transform: isLoaded ? 'translateY(0)' : 'translateY(30px)', opacity: isLoaded ? 1 : 0 }}>
            <button onClick={handleNavigate} className="px-8 py-4 bg-white text-black rounded-none hover:bg-gray-100 transition flex items-center justify-center group font-medium">
              Experience TVARA
              <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* <button className="px-8 py-4 bg-transparent border border-white border-opacity-30 hover:bg-white hover:bg-opacity-5 hover:text-black text-white transition flex items-center justify-center">
              Our Solutions
            </button> */}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes classical-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fade-in-out {
          0% {
            opacity: 0.02;
          }
          50% {
            opacity: 0.08;
          }
          100% {
            opacity: 0.02;
          }
        }
        
        @keyframes expand-contract {
          0% {
            transform: scale(0.95);
            opacity: 0.04;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.07;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.04;
          }
        }
        
        @keyframes clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes counterclockwise {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        
        .animate-classical-rotate {
          animation: classical-rotate 120s linear infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 8s ease-in-out infinite;
        }
        
        .animate-expand-contract {
          animation: expand-contract 15s ease-in-out infinite;
        }
        
        .animate-clockwise {
          animation: clockwise 60s linear infinite;
        }
        
        .animate-counterclockwise {
          animation: counterclockwise 45s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}