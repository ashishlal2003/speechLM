import { useState, useEffect } from 'react';
import { Mic, Volume2, MessageSquare, Lock, Moon, AlertCircle } from 'lucide-react';

export default function App1() {
  const [scrollY, setScrollY] = useState(0);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    const waveInterval = setInterval(() => {
      setIsWaveActive(prev => !prev);
    }, 2000);

    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 5);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(waveInterval);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <Mic className="text-orange-500" />,
      title: "Voice Recognition",
      description: "Advanced AI that understands various Indian accents and languages"
    },
    {
      icon: <Volume2 className="text-green-600" />,
      title: "Natural Responses",
      description: "Human-like conversation with cultural context awareness"
    },
    {
      icon: <MessageSquare className="text-blue-500" />,
      title: "Multilingual Support",
      description: "Communicates in Hindi, Tamil, Bengali, and 20+ Indian languages"
    },
    {
      icon: <Lock className="text-purple-600" />,
      title: "Privacy Focused",
      description: "Your conversations stay secure and private"
    },
    {
      icon: <Moon className="text-indigo-500" />,
      title: "Personalized Experience",
      description: "Adapts to your preferences and communication style"
    }
  ];

  const scrollOpacity = Math.max(0, Math.min(1, 1 - scrollY / 400));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 font-['Poppins']">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-orange-500 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-3 h-3 bg-white rounded-full ${isWaveActive ? 'animate-ping' : ''}`}></div>
              </div>
              <div className={`absolute inset-0 border-2 border-orange-500 rounded-full ${isWaveActive ? 'animate-pulse' : ''}`}></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-600 to-green-500 text-transparent bg-clip-text">Tvara</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors">How It Works</a>
            <a href="#about" className="text-gray-700 hover:text-orange-500 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors">Contact</a>
          </nav>

          <div>
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Try Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Patterns - Inspired by Indian Rangoli */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] border-[40px] border-orange-500 rounded-full animate-spin-slow"></div>
          <div className="absolute w-[600px] h-[600px] border-[30px] border-green-600 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute w-[400px] h-[400px] border-[20px] border-blue-500 rounded-full animate-spin-moderate"></div>
        </div>

        <div className="relative max-w-6xl w-full mx-auto mt-64 md:mt-0 mb-12 text-center z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-green-700 to-green-600 text-transparent bg-clip-text">
            Discover Tvara: Your Indian Voice AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Experience the power of voice technology designed specifically for Indian languages and culture, bringing ancient wisdom to modern convenience.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Get Started
            </button>
            <button className="bg-white text-gray-800 border border-gray-200 px-8 py-3 rounded-full text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-opacity duration-500"
          style={{ opacity: scrollOpacity }}
        >
          <p className="text-gray-500 mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 text-transparent bg-clip-text">
              Features inspired by Indian heritage
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI combines cutting-edge technology with deep cultural understanding to create a truly Indian voice assistant experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl border transition-all duration-500 flex flex-col items-center text-center ${activeFeature === index ? 'border-orange-500 shadow-lg transform -translate-y-1' : 'border-gray-100'}`}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-orange-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Indian-inspired graphics */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        {/* Decorative elements inspired by Indian patterns */}
        <div className="absolute top-0 left-0 w-full h-32 opacity-10">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M0,0 C150,100 350,0 500,100 C650,0 850,100 1000,0 L1000,100 L0,100 Z"
              fill="url(#grad1)"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 text-transparent bg-clip-text">
              How Vāṇī Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple, intuitive, and designed with Indian users in mind.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden border border-gray-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full"></div>

                <ol className="relative">
                  {[
                    "Speak in your preferred Indian language",
                    "Vāṇī processes your request with cultural context",
                    "Get responses tailored to Indian sensibilities",
                    "Continue the conversation naturally"
                  ].map((step, index) => (
                    <li key={index} className="mb-8 last:mb-0 pl-10 relative">
                      <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <p className="text-lg">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Mandala-inspired element */}
                <div className="absolute inset-0 rounded-full border-8 border-dashed border-orange-200 animate-spin-very-slow"></div>
                <div className="absolute inset-[12%] rounded-full border-8 border-dashed border-green-200 animate-spin-very-slow-reverse"></div>

                <div className="absolute inset-[25%] bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center">
                    <Mic className="text-white w-10 h-10" />
                  </div>
                </div>

                {/* Animated dots around the circle */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const x = Math.cos(angle) * 120;
                  const y = Math.sin(angle) * 120;

                  return (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-gradient-to-r from-orange-500 to-green-600 rounded-full"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        animation: `pulse 2s infinite ${i * 0.25}s`
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Voice Assistant Designed for India</h2>
          <p className="text-xl mb-10 opacity-90">Join us in bringing the richness of Indian languages and culture to AI voice technology.</p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Get Early Access
            </button>
            <button className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-orange-500 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-green-400 text-transparent bg-clip-text">Vāṇī</span>
              </div>
              <p className="text-gray-400">India's own voice assistant, bringing the richness of our languages to AI.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Facebook</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-400 not-italic">
                Vāṇī AI Technologies<br />
                Bengaluru, Karnataka<br />
                India<br />
                <a href="mailto:hello@vani.ai" className="hover:text-orange-400 transition-colors">hello@vani.ai</a>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Vāṇī AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes spin-moderate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }

        @keyframes spin-very-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }

        .animate-spin-moderate {
          animation: spin-moderate 12s linear infinite alternate;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 30s linear infinite;
        }

        .animate-spin-very-slow-reverse {
          animation: spin-very-slow-reverse 25s linear infinite;
        }

        .animate-ripple {
          animation: ripple 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
